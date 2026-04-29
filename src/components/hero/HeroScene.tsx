import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Line, Html } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { createNoise3D } from 'simplex-noise';
import * as THREE from 'three';
import {
  JOINT_NAMES,
  CONNECTIONS,
  JOINT_PRETTY_NAME,
  JOINT_ANGLE_ADJACENCY,
  JOINT_HEADLINE_CLAIM,
  type JointName,
} from './jointMeta';
import {
  setHeadlineOverride,
  requestRestart,
  useRestartTick,
} from './useHeroState';

const ACCENT_COLOR = '#00E5A0';
const GLB_URL = '/skeletons/nfl.glb';

// ---------------------------------------------------------------------------
// Pointer / motion helpers
// ---------------------------------------------------------------------------

interface NormalisedPointer {
  x: number; // -1..1
  y: number; // -1..1
}

const isCoarsePointer = (): boolean => {
  if (typeof window === 'undefined') return false;
  if ('matchMedia' in window && window.matchMedia('(pointer: coarse)').matches) return true;
  if ('ontouchstart' in window) return true;
  return false;
};

// ---------------------------------------------------------------------------
// Skeleton — renders joints + lines, handles hover/click and angle metrics.
// ---------------------------------------------------------------------------

interface SkeletonProps {
  reduceMotion: boolean;
  hoverEnabled: boolean;
}

const TOOLTIP_DASH = '—';
const PULSE_DURATION_MS = 350;
const HOVER_SCALE = 1.6;
const ANGULAR_VELOCITY_SMOOTHING_FRAMES = 5;
const PULSE_EASE = (t: number): number => {
  // cubic-bezier(0.22, 1, 0.36, 1) approximation via the standard
  // ease-out-expo curve. Adequate for a 350ms pulse.
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
};

interface JointAngleState {
  angle: number | null;
  angularVelocity: number | null;
  lastAngle: number | null;
  // Rolling buffer of recent per-frame velocity samples.
  velocitySamples: number[];
}

const createInitialAngleState = (): JointAngleState => ({
  angle: null,
  angularVelocity: null,
  lastAngle: null,
  velocitySamples: [],
});

const formatNumber = (value: number | null): string => {
  if (value === null) return TOOLTIP_DASH;
  return value.toFixed(0);
};

const Skeleton = ({ reduceMotion, hoverEnabled }: SkeletonProps) => {
  const { scene, animations } = useGLTF(GLB_URL);
  const { actions } = useAnimations(animations, scene);
  // drei Line returns a Line2 instance; we type loosely as THREE.Object3D
  // because the precise type lives in three-stdlib and changes between versions.
  const lineRefs = useRef<Array<THREE.Object3D | null>>([]);
  const sphereRefs = useRef<Array<THREE.Mesh | null>>([]);
  const tempA = useRef(new THREE.Vector3());
  const tempB = useRef(new THREE.Vector3());
  const tempC = useRef(new THREE.Vector3());
  const vecParent = useRef(new THREE.Vector3());
  const vecChild = useRef(new THREE.Vector3());

  const angleStatesRef = useRef<Map<JointName, JointAngleState>>(new Map());
  const pulseStartRef = useRef<Map<JointName, number>>(new Map());

  const [hoveredJoint, setHoveredJoint] = useState<JointName | null>(null);
  // Force a re-render of the tooltip text ~10×/s without re-rendering on every frame.
  const [tooltipTick, setTooltipTick] = useState(0);
  const lastTooltipTickRef = useRef(0);

  const restartTick = useRestartTick();

  const joints = useMemo(() => {
    const map: Partial<Record<JointName, THREE.Object3D>> = {};
    for (const name of JOINT_NAMES) {
      const node = scene.getObjectByName(`MD_J_${name}`);
      if (node) map[name] = node;
    }
    return map as Record<JointName, THREE.Object3D>;
  }, [scene]);

  // Hide the GLB's built-in body segments and joint markers — we render our own.
  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const name = obj.name;
      if (name.startsWith('MD_B_') || name.startsWith('MD_J_')) {
        obj.visible = false;
      }
    });
  }, [scene]);

  // Play all animations together, looped.
  useEffect(() => {
    if (!actions) return;
    const playing: THREE.AnimationAction[] = [];
    for (const action of Object.values(actions)) {
      if (!action) continue;
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.reset().play();
      action.paused = reduceMotion;
      if (reduceMotion) action.time = 0;
      playing.push(action);
    }
    return () => {
      playing.forEach((a) => a.stop());
    };
  }, [actions, reduceMotion]);

  // Restart-on-spacebar — observed via the module-scoped store.
  // Skip the first run (initial mount); only react to subsequent ticks.
  const lastRestartTickRef = useRef(restartTick);
  useEffect(() => {
    if (restartTick === lastRestartTickRef.current) return;
    lastRestartTickRef.current = restartTick;
    if (!actions) return;
    for (const action of Object.values(actions)) {
      if (!action) continue;
      action.reset().play();
      action.paused = reduceMotion;
    }
  }, [restartTick, actions, reduceMotion]);

  // Update line endpoints + sphere positions every frame from joint world positions.
  useFrame((state, delta) => {
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

    for (let i = 0; i < CONNECTIONS.length; i += 1) {
      const conn = CONNECTIONS[i];
      if (!conn) continue;
      const [a, b] = conn;
      const ja = joints[a];
      const jb = joints[b];
      if (!ja || !jb) continue;
      ja.getWorldPosition(tempA.current);
      jb.getWorldPosition(tempB.current);
      const line = lineRefs.current[i];
      if (!line) continue;
      const geometry = (line as unknown as { geometry: { setPositions: (p: number[]) => void } }).geometry;
      geometry.setPositions([
        tempA.current.x, tempA.current.y, tempA.current.z,
        tempB.current.x, tempB.current.y, tempB.current.z,
      ]);
    }

    const now = state.clock.getElapsedTime() * 1000;

    for (let i = 0; i < JOINT_NAMES.length; i += 1) {
      const name = JOINT_NAMES[i];
      if (!name) continue;
      const node = joints[name];
      const sphere = sphereRefs.current[i];
      if (!node || !sphere) continue;
      node.getWorldPosition(tempA.current);
      sphere.position.copy(tempA.current);

      // Hover scale + click-pulse scale.
      let scale = 1;
      if (hoverEnabled && hoveredJoint === name) {
        scale = HOVER_SCALE;
      }
      const pulseStart = pulseStartRef.current.get(name);
      if (pulseStart !== undefined && !reduceMotion) {
        const elapsed = now - pulseStart;
        if (elapsed >= PULSE_DURATION_MS) {
          pulseStartRef.current.delete(name);
        } else {
          // Triangular envelope through ease — 1 → 2 → 1.
          const phase = elapsed / PULSE_DURATION_MS;
          const triangular = phase < 0.5
            ? PULSE_EASE(phase * 2)
            : PULSE_EASE((1 - phase) * 2);
          const pulseScale = 1 + triangular; // 1..2..1
          scale = Math.max(scale, pulseScale);
        }
      }
      sphere.scale.setScalar(scale);
    }

    // Update joint-angle metrics for joints with well-defined adjacency.
    for (const [jointKey, adj] of Object.entries(JOINT_ANGLE_ADJACENCY)) {
      if (!adj) continue;
      const name = jointKey as JointName;
      const here = joints[name];
      const parent = joints[adj.parent];
      const child = joints[adj.child];
      if (!here || !parent || !child) continue;
      here.getWorldPosition(tempA.current);
      parent.getWorldPosition(tempB.current);
      child.getWorldPosition(tempC.current);
      vecParent.current.subVectors(tempB.current, tempA.current);
      vecChild.current.subVectors(tempC.current, tempA.current);
      const lenP = vecParent.current.length();
      const lenC = vecChild.current.length();
      if (lenP < 1e-5 || lenC < 1e-5) continue;
      vecParent.current.divideScalar(lenP);
      vecChild.current.divideScalar(lenC);
      const dot = THREE.MathUtils.clamp(vecParent.current.dot(vecChild.current), -1, 1);
      const angleRad = Math.acos(dot);
      const angleDeg = THREE.MathUtils.radToDeg(angleRad);

      const map = angleStatesRef.current;
      const prev = map.get(name) ?? createInitialAngleState();
      let velocity: number | null = prev.angularVelocity;
      const samples = prev.velocitySamples;
      if (prev.lastAngle !== null && delta > 0) {
        const instantaneous = (angleDeg - prev.lastAngle) / delta;
        samples.push(instantaneous);
        if (samples.length > ANGULAR_VELOCITY_SMOOTHING_FRAMES) samples.shift();
        let sum = 0;
        for (const s of samples) sum += s;
        velocity = sum / samples.length;
      }
      map.set(name, {
        angle: angleDeg,
        angularVelocity: velocity,
        lastAngle: angleDeg,
        velocitySamples: samples,
      });
    }

    // Drive a low-frequency tooltip refresh (~10Hz) so numbers don't strobe.
    if (now - lastTooltipTickRef.current > 100) {
      lastTooltipTickRef.current = now;
      setTooltipTick((tick) => (tick + 1) % 1_000_000);
    }
  }, 1);

  const handlePointerOver = useCallback((name: JointName) => {
    if (!hoverEnabled) return;
    setHoveredJoint(name);
  }, [hoverEnabled]);

  const handlePointerOut = useCallback(() => {
    setHoveredJoint(null);
  }, []);

  const handleClick = useCallback((name: JointName) => {
    if (!reduceMotion) {
      pulseStartRef.current.set(
        name,
        (typeof performance !== 'undefined' ? performance.now() : Date.now()),
      );
    }
    const claim = JOINT_HEADLINE_CLAIM[name];
    if (claim) setHeadlineOverride(claim, 5000);
  }, [reduceMotion]);

  // Cleanup: dispose geometries/materials we created. The GLB scene is
  // managed by useGLTF's cache, so we leave it alone.
  useEffect(() => {
    const spheres = sphereRefs.current;
    return () => {
      for (const sphere of spheres) {
        if (!sphere) continue;
        sphere.geometry.dispose();
        const material = sphere.material;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else if (material) {
          material.dispose();
        }
      }
    };
  }, []);

  const renderTooltip = () => {
    if (!hoverEnabled || !hoveredJoint) return null;
    const node = joints[hoveredJoint];
    if (!node) return null;
    const angleState = angleStatesRef.current.get(hoveredJoint);
    const angleStr = formatNumber(angleState?.angle ?? null);
    const velocityStr = formatNumber(angleState?.angularVelocity ?? null);
    const pretty = JOINT_PRETTY_NAME[hoveredJoint];
    // Reference tooltipTick to keep the lint/dependency story honest about
    // why this re-renders. The actual value is unused in the JSX.
    void tooltipTick;
    return (
      <Html
        position={node.getWorldPosition(new THREE.Vector3())}
        center={false}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'none', transform: 'translate(12px, -100%)' }}
      >
        <div
          className="select-none px-3 py-2 rounded-sm text-xs tabular-nums whitespace-nowrap"
          style={{
            backgroundColor: 'color-mix(in oklab, var(--color-md-surface) 85%, transparent)',
            border: '1px solid color-mix(in oklab, var(--color-md-text-mid) 15%, transparent)',
            color: 'var(--color-md-text-hi)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            boxShadow: '0 1px 0 0 color-mix(in oklab, var(--color-md-accent) 40%, transparent) inset',
          }}
        >
          <div className="font-medium tracking-tight">{pretty}</div>
          <div
            className="mt-1 text-[11px]"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            {angleStr === TOOLTIP_DASH ? TOOLTIP_DASH : `${angleStr}°`}
            {'  /  '}
            {velocityStr === TOOLTIP_DASH ? TOOLTIP_DASH : `${velocityStr}°/s`}
          </div>
        </div>
      </Html>
    );
  };

  return (
    <group>
      <primitive object={scene} />
      {CONNECTIONS.map(([a, b], i) => (
        <Line
          key={`${a}-${b}`}
          ref={(el: THREE.Object3D | null) => {
            lineRefs.current[i] = el;
          }}
          points={[[0, 0, 0], [0, 0, 0.001]]}
          color={ACCENT_COLOR}
          lineWidth={1.5}
          transparent
          opacity={0.85}
        />
      ))}
      {JOINT_NAMES.map((name, i) => (
        <mesh
          key={name}
          ref={(el: THREE.Mesh | null) => {
            sphereRefs.current[i] = el;
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            handlePointerOver(name);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            handlePointerOut();
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(name);
          }}
        >
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial
            color={ACCENT_COLOR}
            emissive={ACCENT_COLOR}
            emissiveIntensity={0.9}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
      {renderTooltip()}
    </group>
  );
};

// ---------------------------------------------------------------------------
// Particle field — atmospheric drift behind the skeleton.
// ---------------------------------------------------------------------------

interface ParticleFieldProps {
  reduceMotion: boolean;
}

const PARTICLE_COUNT = 800;
const PARTICLE_BOUNDS = { x: 6, y: 4, z: 6 };
const PARTICLE_DRIFT_AMPLITUDE = 0.15;
const PARTICLE_DRIFT_SPEED = 0.15;
const PARTICLE_RADIUS = 0.008;
const PARTICLE_FADE_NEAR = 1.5;
const PARTICLE_FADE_FAR = 4.5;
const PARTICLE_ACCENT_SOFT = '#7C5CFF';

interface ParticleSeed {
  x: number;
  y: number;
  z: number;
  seed: number;
}

const ParticleField = ({ reduceMotion }: ParticleFieldProps) => {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useRef(new THREE.Object3D());
  const noise = useMemo(() => createNoise3D(), []);

  const seeds = useMemo<ParticleSeed[]>(() => {
    const out: ParticleSeed[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      out.push({
        x: (Math.random() - 0.5) * PARTICLE_BOUNDS.x,
        y: (Math.random() - 0.5) * PARTICLE_BOUNDS.y,
        z: (Math.random() - 0.5) * PARTICLE_BOUNDS.z,
        seed: Math.random() * 1000,
      });
    }
    return out;
  }, []);

  // Initial matrix population — done once on mount so the static (reduceMotion)
  // case still renders the field.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const seed = seeds[i];
      if (!seed) continue;
      dummy.current.position.set(seed.x, seed.y, seed.z);
      dummy.current.scale.setScalar(1);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [seeds]);

  // Cleanup: dispose the underlying buffer geometry + material on unmount.
  useEffect(() => {
    const mesh = meshRef.current;
    return () => {
      if (!mesh) return;
      mesh.geometry.dispose();
      const material = mesh.material;
      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose());
      } else if (material) {
        material.dispose();
      }
    };
  }, []);

  useFrame((state) => {
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
    if (reduceMotion) return;
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = state.clock.getElapsedTime() * PARTICLE_DRIFT_SPEED;
    const cameraPos = state.camera.position;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const seed = seeds[i];
      if (!seed) continue;
      const driftX = noise(seed.seed + t, seed.seed * 0.3, t * 0.7) * PARTICLE_DRIFT_AMPLITUDE;
      const driftY = noise(seed.seed * 0.6, seed.seed + t * 0.5, t) * PARTICLE_DRIFT_AMPLITUDE;
      const driftZ = noise(seed.seed * 0.2, t, seed.seed + t * 0.3) * PARTICLE_DRIFT_AMPLITUDE;
      dummy.current.position.set(seed.x + driftX, seed.y + driftY, seed.z + driftZ);

      // Distance-based scale attenuation: shrink particles too close to
      // the camera so they fade out rather than read as a fly-by.
      const distance = dummy.current.position.distanceTo(cameraPos);
      const t01 = THREE.MathUtils.clamp(
        (distance - PARTICLE_FADE_NEAR) / (PARTICLE_FADE_FAR - PARTICLE_FADE_NEAR),
        0,
        1,
      );
      dummy.current.scale.setScalar(0.4 + t01 * 0.7);
      dummy.current.updateMatrix();
      mesh.setMatrixAt(i, dummy.current.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[PARTICLE_RADIUS, 6, 6]} />
      <meshBasicMaterial color={PARTICLE_ACCENT_SOFT} transparent opacity={0.2} depthWrite={false} />
    </instancedMesh>
  );
};

// ---------------------------------------------------------------------------
// Camera orbit — base orbit + cursor-driven tilt.
// ---------------------------------------------------------------------------

interface CameraOrbitProps {
  reduceMotion: boolean;
  pointerRef: React.MutableRefObject<NormalisedPointer>;
  tiltEnabled: boolean;
}

const ORBIT_RADIUS = 3.5;
const ORBIT_HEIGHT = 0.4;
const ORBIT_PERIOD_SECONDS = 8;
const ORBIT_LERP = 0.06;
const TILT_PITCH_DEG = 5; // ±X
const TILT_YAW_DEG = 10;  // ±Y
const TILT_LERP = 0.08;

const CameraOrbit = ({ reduceMotion, pointerRef, tiltEnabled }: CameraOrbitProps) => {
  const target = useRef(new THREE.Vector3(0, ORBIT_HEIGHT, ORBIT_RADIUS));
  const tiltCurrent = useRef({ pitch: 0, yaw: 0 });
  const lookAt = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
    if (reduceMotion) return;
    const t = state.clock.getElapsedTime();
    const angle = (t / ORBIT_PERIOD_SECONDS) * Math.PI * 2;
    target.current.set(
      Math.sin(angle) * ORBIT_RADIUS,
      ORBIT_HEIGHT,
      Math.cos(angle) * ORBIT_RADIUS,
    );
    state.camera.position.lerp(target.current, ORBIT_LERP);

    // Tilt the camera's lookAt point on a small sphere around the focus,
    // driven by normalised pointer position. Disabled on coarse-pointer
    // devices (passed in via tiltEnabled).
    let pitch = 0;
    let yaw = 0;
    if (tiltEnabled) {
      const pointer = pointerRef.current;
      yaw = THREE.MathUtils.degToRad(pointer.x * TILT_YAW_DEG);
      pitch = THREE.MathUtils.degToRad(pointer.y * TILT_PITCH_DEG);
    }
    tiltCurrent.current.yaw = THREE.MathUtils.lerp(tiltCurrent.current.yaw, yaw, TILT_LERP);
    tiltCurrent.current.pitch = THREE.MathUtils.lerp(tiltCurrent.current.pitch, pitch, TILT_LERP);

    const focusY = ORBIT_HEIGHT * 0.6;
    const offsetRadius = 0.6;
    lookAt.current.set(
      Math.sin(tiltCurrent.current.yaw) * offsetRadius,
      focusY + Math.sin(tiltCurrent.current.pitch) * offsetRadius,
      0,
    );
    state.camera.lookAt(lookAt.current);
  });

  return null;
};

// ---------------------------------------------------------------------------
// HeroScene — the canvas host. Owns pointer + keyboard listeners.
// ---------------------------------------------------------------------------

const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (target instanceof HTMLInputElement) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  if (target.isContentEditable) return true;
  return false;
};

export const HeroScene = () => {
  const reduceMotion = useReducedMotion() ?? false;
  const [coarsePointer, setCoarsePointer] = useState<boolean>(() => isCoarsePointer());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarsePointer(isCoarsePointer());
    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    // Older Safari fallback.
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  // Tilt is disabled when the device is coarse-pointer or reduced motion.
  const tiltEnabled = !reduceMotion && !coarsePointer;
  // Hover tooltip stays available with reduced motion (it's static info)
  // but is suppressed when both reduced-motion AND coarse-pointer are true.
  const hoverEnabled = !(reduceMotion && coarsePointer);

  const pointerRef = useRef<NormalisedPointer>({ x: 0, y: 0 });

  // Window-level mousemove → normalised pointer in [-1, 1].
  useEffect(() => {
    if (!tiltEnabled || typeof window === 'undefined') return;
    const handler = (event: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      pointerRef.current = {
        x: (event.clientX / w) * 2 - 1,
        // Invert Y so that "mouse up" tilts the camera up (positive pitch).
        y: -((event.clientY / h) * 2 - 1),
      };
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      pointerRef.current = { x: 0, y: 0 };
    };
  }, [tiltEnabled]);

  // Spacebar restart — extensible to clip cycling later.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cycleClip = (_clipNameOrIndex?: string | number) => {
      // Single-clip placeholder: just restart playback.
      // When more clips land, route the argument through the store.
      void _clipNameOrIndex;
      requestRestart();
    };
    const handler = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.key !== ' ') return;
      if (isTypingTarget(document.activeElement)) return;
      event.preventDefault();
      cycleClip();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, ORBIT_HEIGHT, ORBIT_RADIUS], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[-1.5, 2, 1]} intensity={0.6} />
      <Suspense fallback={null}>
        <Skeleton reduceMotion={reduceMotion} hoverEnabled={hoverEnabled} />
      </Suspense>
      <ParticleField reduceMotion={reduceMotion} />
      <CameraOrbit
        reduceMotion={reduceMotion}
        pointerRef={pointerRef}
        tiltEnabled={tiltEnabled}
      />
    </Canvas>
  );
};

useGLTF.preload(GLB_URL);

export default HeroScene;
