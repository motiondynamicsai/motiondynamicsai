import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import useReducedMotion from '../lib/useReducedMotion';
import { FOOTER_BALL, FOOTER_BALL_VARIANTS, FOOTER_SPORTS, appendFooterBallDrop } from '../lib/footerBallMotion';
import FooterBallMark from './FooterBallMark';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const { x, y, radius } = FOOTER_BALL;

export default function FooterBall() {
  const root = useRef(null);
  const activate = useRef(null);
  const sportIndex = useRef(0);
  const entered = useRef(false);
  const [nextSport, setNextSport] = useState(0);
  const [phase, setPhase] = useState('dropReset');
  const reduced = useReducedMotion();

  useGSAP((context, contextSafe) => {
    const ball = root.current.querySelector('.footer-ball-motion');
    const surface = root.current.querySelector('.footer-wave-dot');
    const details = root.current.querySelectorAll('.footer-ball-detail');
    const equipment = root.current.querySelectorAll('.footer-ball-equipment');
    const impact = root.current.querySelector('.footer-ball-impact');
    const wave = root.current.ownerSVGElement;
    let currentPhase = 'dropReset';
    let animation;
    const changePhase = (next) => {
      currentPhase = next;
      setPhase(next);
    };
    const settle = () => changePhase('resting');

    // Scale around the same bottom-of-circle origin as the original drop.
    gsap.set(ball, { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, svgOrigin: `${x} ${y + radius}`, attr: { 'data-variant': 'brand' } });
    gsap.set(surface, { ...FOOTER_BALL_VARIANTS.brand });
    gsap.set(details, { opacity: 0 });
    gsap.set(impact, { svgOrigin: `${x} ${y}`, opacity: 0 });
    gsap.set(equipment, { opacity: 0 });

    if (reduced || entered.current) {
      entered.current = true;
      settle();
    } else {
      gsap.set(ball, { y: -180, opacity: 0 });
      animation = gsap.timeline({
        scrollTrigger: { trigger: wave, start: 'center 90%', once: true },
        onStart: () => { entered.current = true; },
        onComplete: settle,
      });
      appendFooterBallDrop(animation, ball, { onPhase: changePhase });
    }

    activate.current = contextSafe(() => {
      // This synchronous guard also covers rapid taps before React rerenders.
      if (currentPhase !== 'resting') return;
      changePhase('transforming');
      const sport = FOOTER_SPORTS[sportIndex.current];
      const implement = root.current.querySelector(`[data-sport="${sport.id}"]`);
      const detail = root.current.querySelector(`[data-ball-detail="${sport.id}"]`);
      animation?.kill();
      animation = gsap.timeline({
        onComplete: () => {
          sportIndex.current = (sportIndex.current + 1) % FOOTER_SPORTS.length;
          setNextSport(sportIndex.current);
          settle();
        },
      });
      gsap.set(equipment, { opacity: 0 });
      gsap.set(details, { opacity: 0 });
      gsap.set(implement, { x: 0, y: 0, rotation: 0, svgOrigin: sport.pivot });

      // Recolour the same circle in place. Equipment stays hidden until the
      // sport surface and its seams are fully established at this timeline label.
      animation
        .set(ball, { attr: { 'data-variant': sport.id } }, 0)
        .to(surface, { ...FOOTER_BALL_VARIANTS[sport.id], duration: .28, ease: 'power1.inOut' }, 0)
        .to(detail, { opacity: 1, duration: .2, ease: 'power1.out' }, .08)
        .addLabel('sportReady', .3)
        .call(() => changePhase('swingIn'), [], 'sportReady');
      if (!reduced) {
        animation
          .to(ball, { scaleX: 1.025, scaleY: .95, duration: .12, ease: 'power1.out' }, 0)
          .to(ball, { scaleX: 1, scaleY: 1, duration: .16, ease: 'power1.inOut' }, .12);
      }

      if (reduced) {
        // A brief equipment reveal conveys the sport without a swing or flight.
        animation
          .to(implement, { opacity: 1, duration: .12 }, 'sportReady')
          .call(() => changePhase('impact'))
          .to(ball, { scaleX: 1.04, scaleY: .97, duration: .1 }, '<')
          .to(ball, { scaleX: 1, scaleY: 1, duration: .12 }, '+=.08')
          .to(implement, { opacity: 0, duration: .16 })
          .addLabel('brandReset')
          .to(surface, { ...FOOTER_BALL_VARIANTS.brand, duration: .18 }, 'brandReset')
          .to(details, { opacity: 0, duration: .18 }, 'brandReset')
          .set(ball, { attr: { 'data-variant': 'brand' } });
        return;
      }

      const contact = animation.labels.sportReady + sport.windup + sport.swing;
      // Exit beyond the SVG's actual right edge, including the enlarged radius.
      const exitX = wave.viewBox.baseVal.x + wave.viewBox.baseVal.width - x + radius * 3;
      const apex = sport.flight * (sport.apex ?? .44);
      const swingStart = sport.swingPose?.start ?? { x: -16, y: 18, rotation: -68 };
      const swingApproach = sport.swingPose?.approach ?? { x: -10, y: 10, rotation: -52 };
      const swingFinish = sport.swingPose?.finish ?? { x: 12, y: -6, rotation: 34 };
      animation
        .set(implement, { ...swingStart }, 'sportReady')
        .to(implement, { opacity: 1, ...swingApproach, duration: sport.windup, ease: 'power1.out' }, 'sportReady')
        .to(implement, { x: 0, y: 0, rotation: 0, duration: sport.swing, ease: 'power2.in' })
        .addLabel('contact', contact)
        .call(() => changePhase('impact'), [], 'contact')
        .set(ball, { scaleX: 1.08, scaleY: .94 }, 'contact')
        .to(implement, { ...swingFinish, duration: sport.follow, ease: 'power2.out' }, 'contact')
        .to(implement, { opacity: 0, duration: .12 }, contact + sport.follow - .12)
        .fromTo(impact, { opacity: .4, scale: .8 }, { opacity: 0, scale: 1.25, duration: .2, ease: 'power1.out', immediateRender: false }, 'contact')
        // Coordinated X/Y tweens describe a parabola; no path is painted.
        .to(ball, { x: exitX, duration: sport.flight, ease: 'none' }, 'contact')
        .to(ball, { y: -sport.height, duration: apex, ease: 'power1.out' }, 'contact')
        .to(ball, { y: sport.endY, duration: sport.flight - apex, ease: 'power1.in' }, contact + apex)
        .to(ball, { scaleX: 1, scaleY: 1, duration: .07 }, 'contact')
        .to(ball, { scaleX: sport.scale, scaleY: sport.scale, duration: apex - .07, ease: 'power1.out' }, contact + .07)
        .to(ball, { scaleX: 1.2, scaleY: 1.2, duration: sport.flight - apex, ease: 'power1.in' }, contact + apex)
        .call(() => changePhase('ballFlight'), [], contact + .07)
        .addLabel('exited', contact + sport.flight)
        .set(ball, { opacity: 0 }, 'exited')
        .call(() => changePhase('exited'), [], 'exited')
        // Restore the brand only after the entire sport ball is past the edge.
        .set(equipment, { opacity: 0 }, 'exited')
        .set(surface, { ...FOOTER_BALL_VARIANTS.brand }, 'exited')
        .set(details, { opacity: 0 }, 'exited')
        .set(ball, { attr: { 'data-variant': 'brand' } }, 'exited');

      // A timeline pause in the action, followed by the exact entrance bounce.
      appendFooterBallDrop(animation, ball, { position: 'exited+=.32', onPhase: changePhase });
    });

    return () => {
      activate.current = null;
      animation?.scrollTrigger?.kill();
      animation?.kill();
    };
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  const sport = FOOTER_SPORTS[nextSport];
  const busy = phase !== 'resting';
  return <g className="footer-ball" ref={root} data-phase={phase}>
    <g transform={`translate(${x} ${y})`} aria-hidden="true" className="footer-ball-tools">
      <g className="footer-ball-equipment" data-sport="cricket" opacity="0">
        <path d="M-28 29 V62" strokeWidth="3" />
        <path d="M-37 -25 Q-37 -29 -33 -29 H-23 Q-19 -29 -19 -25 V24 Q-19 29 -24 29 H-32 Q-37 29 -37 24 Z" fill="var(--paper)" />
        <path d="M-28 -22 V21 M-31 49 H-25 M-31 54 H-25" opacity=".35" strokeWidth="1" />
      </g>
      <g className="footer-ball-equipment" data-sport="squash" opacity="0">
        <ellipse cx="-32" cy="-5" rx="14" ry="25" />
        <path d="M-39 17 L-32 34 L-25 17 M-32 34 V62" />
        <path d="M-37 -25 V15 M-27 -25 V15 M-44 -12 H-20 M-45 -3 H-19 M-42 6 H-22" opacity=".35" strokeWidth=".8" />
        <path d="M-32 49 V62" strokeWidth="3.5" />
      </g>
      <g className="footer-ball-equipment" data-sport="tennis" opacity="0">
        <ellipse cx="-36" cy="-4" rx="18" ry="22" />
        <path d="M-45 15 L-36 36 L-27 15 M-36 36 V64" />
        <path d="M-42 -23 V15 M-35 -25 V18 M-28 -23 V15 M-51 -12 H-21 M-54 -4 H-18 M-51 4 H-21" opacity=".35" strokeWidth=".8" />
        <path d="M-36 51 V64" strokeWidth="3.5" />
      </g>
      <g className="footer-ball-equipment" data-sport="golf" opacity="0">
        <path d="M-78 -70 L-36 0" strokeWidth="1.8" />
        <path d="M-78 -70 L-69 -55" strokeWidth="3.5" />
        <path d="M-39 -2 L-25 -7 Q-18 -8 -18 -1 V5 Q-24 10 -36 7 L-40 3 Z" fill="var(--ink)" />
        <path d="M-33 1 L-23 -2 M-32 4 L-23 1" stroke="var(--paper)" strokeWidth=".7" opacity=".55" />
      </g>
    </g>
    <circle className="footer-ball-impact" cx={x} cy={y} r="23" fill="none" stroke="#f0444f" strokeWidth="1" opacity="0" aria-hidden="true" />
    <FooterBallMark />
    <foreignObject className="footer-ball-control" x={x - 52} y={y - 52} width="104" height="104">
      <button
        type="button"
        className="footer-ball-hit"
        aria-label={`Hit the ball with a ${sport.implement}`}
        aria-disabled={busy}
        onClick={() => activate.current?.()}
      >
        <span className="footer-ball-hint" aria-hidden="true">Hit / {sport.name}</span>
      </button>
    </foreignObject>
  </g>;
}
