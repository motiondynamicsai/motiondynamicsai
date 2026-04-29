import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Line } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

const JOINT_NAMES = [
  'hip_c', 'chest', 'neck', 'head',
  'l_sh', 'l_el', 'l_wr',
  'r_sh', 'r_el', 'r_wr',
  'l_hip', 'l_kn', 'l_an',
  'r_hip', 'r_kn', 'r_an',
] as const;

type JointName = typeof JOINT_NAMES[number];

const CONNECTIONS: ReadonlyArray<readonly [JointName, JointName]> = [
  ['hip_c', 'chest'], ['chest', 'neck'], ['neck', 'head'],
  ['chest', 'l_sh'], ['l_sh', 'l_el'], ['l_el', 'l_wr'],
  ['chest', 'r_sh'], ['r_sh', 'r_el'], ['r_el', 'r_wr'],
  ['hip_c', 'l_hip'], ['l_hip', 'l_kn'], ['l_kn', 'l_an'],
  ['hip_c', 'r_hip'], ['r_hip', 'r_kn'], ['r_kn', 'r_an'],
];

const ACCENT_COLOR = '#00E5A0';
const GLB_URL = '/skeletons/nfl.glb';

interface SkeletonProps {
  reduceMotion: boolean;
}

const Skeleton = ({ reduceMotion }: SkeletonProps) => {
  const { scene, animations } = useGLTF(GLB_URL);
  const { actions } = useAnimations(animations, scene);
  // drei Line returns a Line2 instance; we type loosely as THREE.Object3D
  // because the precise type lives in three-stdlib and changes between versions.
  const lineRefs = useRef<Array<THREE.Object3D | null>>([]);
  const sphereRefs = useRef<Array<THREE.Mesh | null>>([]);
  const tempA = useRef(new THREE.Vector3());
  const tempB = useRef(new THREE.Vector3());

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

  // Update line endpoints + sphere positions every frame from joint world positions.
  useFrame(() => {
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

    for (let i = 0; i < JOINT_NAMES.length; i += 1) {
      const name = JOINT_NAMES[i];
      if (!name) continue;
      const node = joints[name];
      const sphere = sphereRefs.current[i];
      if (!node || !sphere) continue;
      node.getWorldPosition(tempA.current);
      sphere.position.copy(tempA.current);
    }
  }, 1);

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
    </group>
  );
};

interface CameraOrbitProps {
  reduceMotion: boolean;
}

const ORBIT_RADIUS = 3.5;
const ORBIT_HEIGHT = 0.4;
const ORBIT_PERIOD_SECONDS = 8;
const ORBIT_LERP = 0.06;

const CameraOrbit = ({ reduceMotion }: CameraOrbitProps) => {
  const target = useRef(new THREE.Vector3(0, ORBIT_HEIGHT, ORBIT_RADIUS));

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
    state.camera.lookAt(0, ORBIT_HEIGHT * 0.6, 0);
  });

  return null;
};

export const HeroScene = () => {
  const reduceMotion = useReducedMotion() ?? false;

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
        <Skeleton reduceMotion={reduceMotion} />
      </Suspense>
      <CameraOrbit reduceMotion={reduceMotion} />
    </Canvas>
  );
};

useGLTF.preload(GLB_URL);

export default HeroScene;
