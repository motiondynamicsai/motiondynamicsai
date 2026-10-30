import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { BAT_PIVOT, BAT_REST_ANGLE, cricketHeadingGeometry, cubicPoint, keepBatRight } from './cricketHeadingGeometry';
import './CricketHeading.css';

function createInteraction(root) {
  const title = root.querySelector('h2');
  const anchor = root.querySelector('.cricket-dot-anchor');
  const motion = root.querySelector('.cricket-dot-motion');
  const glyph = root.querySelector('.cricket-dot-glyph');
  const baseline = root.querySelector('.cricket-dot-baseline');
  const seam = root.querySelector('.cricket-dot-seam');
  const trigger = root.querySelector('.cricket-dot-trigger');
  const bat = root.querySelector('.cricket-heading-bat');
  const batTravel = root.querySelector('.cricket-bat-travel');
  const batRotor = root.querySelector('.cricket-bat-body');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const context = document.createElement('canvas').getContext('2d');
  const batPose = { x: 0, y: 0, angle: BAT_REST_ANGLE };
  const ballPose = { progress: 0, spin: 0 };
  let geometry;
  let dot;
  let timeline;
  let signature = '';
  let frame = 0;
  let disposed = false;
  let running = false;
  let automaticPlayed = false;

  const phase = value => {
    root.dataset.phase = value;
    trigger.setAttribute('aria-disabled', String(value !== 'idle'));
  };
  const renderBat = () => {
    const pose = geometry ? keepBatRight(batPose, geometry) : batPose;
    batTravel.setAttribute('transform', `translate(${pose.x} ${pose.y})`);
    batRotor.setAttribute('transform', `rotate(${pose.angle} ${BAT_PIVOT.x} ${BAT_PIVOT.y})`);
  };
  const rest = () => {
    Object.assign(batPose, geometry?.rest || { x: 0, y: 0, angle: BAT_REST_ANGLE });
    Object.assign(ballPose, { progress: 0, spin: 0 });
    renderBat();
    motion.style.transform = 'none';
    gsap.set(seam, { opacity: 0 });
    running = false;
    phase('idle');
  };
  const renderBall = () => {
    const point = cubicPoint(geometry.points, ballPose.progress);
    motion.style.transform = `translate3d(${point.x - dot.x}px, ${point.y - dot.y}px, 0) rotate(${ballPose.spin}deg)`;
  };

  const measure = (force = false) => {
    if (disposed || !context) return;
    const font = getComputedStyle(glyph);
    const nextSignature = [root.clientWidth, root.clientHeight, title.offsetWidth, title.offsetHeight, bat.clientWidth, bat.clientHeight, font.fontSize, font.fontFamily].join('|');
    if (!force && nextSignature === signature) return;
    signature = nextSignature;
    timeline?.kill();
    gsap.killTweensOf(seam);
    rest();
    context.font = `${font.fontStyle} ${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
    context.fontKerning = font.fontKerning;
    const kerning = context.measureText('in focus.').width - context.measureText('in focus').width - context.measureText('.').width;
    anchor.style.marginLeft = `${kerning}px`;
    const metrics = context.measureText('.');
    const bounds = root.getBoundingClientRect();
    const motionBounds = motion.getBoundingClientRect();
    const baselineY = baseline.getBoundingClientRect().top;
    const inkLeft = motionBounds.left - metrics.actualBoundingBoxLeft;
    const inkTop = baselineY - metrics.actualBoundingBoxAscent;
    const inkWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const inkHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    dot = { x: inkLeft + inkWidth / 2 - bounds.left, y: inkTop + inkHeight / 2 - bounds.top };
    motion.style.transformOrigin = `${inkLeft + inkWidth / 2 - motionBounds.left}px ${inkTop + inkHeight / 2 - motionBounds.top}px`;
    glyph.style.transformOrigin = motion.style.transformOrigin;
    Object.assign(seam.style, { left: `${inkLeft - motionBounds.left}px`, top: `${inkTop - motionBounds.top}px`, width: `${inkWidth}px`, height: `${inkHeight}px` });
    Object.assign(trigger.style, { left: `${dot.x - 22}px`, top: `${dot.y - 22}px` });
    const matrix = bat.getScreenCTM();
    if (!matrix || inkWidth <= 0 || inkHeight <= 0) return;
    geometry = cricketHeadingGeometry({
      dot, radius: (inkWidth + inkHeight) / 4, fontSize: Number.parseFloat(font.fontSize), width: bounds.width,
      batMatrix: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e - bounds.left, f: matrix.f - bounds.top },
    });
    rest();
    root.dataset.ready = 'true';
  };

  const play = () => {
    if (disposed || running || !geometry) return;
    automaticPlayed = true;
    visibility.disconnect();
    running = true;
    phase('preparing');
    timeline?.kill();
    if (reducedMotion.matches) {
      rest();
      return;
    }
    const strike = .50;
    const impact = .74;
    const returnAt = impact + .65;
    timeline = gsap.timeline({ onComplete: rest });
    timeline.to(batPose, { ...geometry.prepare, duration: .40, ease: 'power2.inOut', onUpdate: renderBat }, .10)
      .call(() => phase('swing'), [], strike)
      .to(batPose, { ...geometry.impact, duration: .24, ease: 'power2.in', onUpdate: renderBat }, strike)
      .call(() => phase('flight'), [], impact)
      .to(seam, { opacity: .9, duration: .08, ease: 'power1.out' }, impact)
      .to(batPose, { ...geometry.followThrough, duration: .22, ease: 'power2.out', onUpdate: renderBat }, impact)
      .to(ballPose, { progress: 1, spin: 80, duration: .55, ease: 'power2.out', onUpdate: renderBall }, impact)
      .call(() => phase('return'), [], returnAt)
      .to(ballPose, { progress: 0, spin: 150, duration: .50, ease: 'power2.inOut', onUpdate: renderBall }, returnAt)
      .to(batPose, { ...geometry.rest, duration: .58, ease: 'power2.inOut', onUpdate: renderBat }, returnAt)
      .to(seam, { opacity: 0, duration: .14, ease: 'power1.out' }, returnAt + .36);
  };
  const visibility = new IntersectionObserver(([entry]) => {
    if (!automaticPlayed && geometry && entry.isIntersecting && entry.intersectionRatio >= .75) play();
  }, { threshold: .75 });
  const requestMeasure = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => measure());
  };
  const resize = new ResizeObserver(requestMeasure);
  const hoverIn = event => { if (event.pointerType !== 'touch') root.dataset.dotHover = 'true'; };
  const hoverOut = () => { delete root.dataset.dotHover; };
  const motionPreferenceChanged = () => {
    timeline?.kill();
    gsap.killTweensOf(seam);
    rest();
  };
  trigger.addEventListener('click', play);
  trigger.addEventListener('pointerenter', hoverIn);
  trigger.addEventListener('pointerleave', hoverOut);
  reducedMotion.addEventListener('change', motionPreferenceChanged);
  window.addEventListener('resize', requestMeasure, { passive: true });
  document.fonts?.addEventListener('loadingdone', requestMeasure);
  [root, title, bat].forEach(element => resize.observe(element));
  measure();
  Promise.resolve(document.fonts?.ready).then(() => {
    if (disposed) return;
    measure(true);
    visibility.observe(title);
  });
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    visibility.disconnect();
    resize.disconnect();
    timeline?.kill();
    gsap.killTweensOf(seam);
    trigger.removeEventListener('click', play);
    trigger.removeEventListener('pointerenter', hoverIn);
    trigger.removeEventListener('pointerleave', hoverOut);
    reducedMotion.removeEventListener('change', motionPreferenceChanged);
    window.removeEventListener('resize', requestMeasure);
    document.fonts?.removeEventListener('loadingdone', requestMeasure);
  };
}

export default function CricketHeading() {
  const root = useRef(null);
  useLayoutEffect(() => createInteraction(root.current), []);
  return <div className="cricket-title-row" ref={root} data-phase="idle">
    <h2 id="cricket-title" aria-label="Cricket, in focus.">Cricket,<br /><span className="cricket-title-accent">in focus<span className="cricket-dot-anchor"><span className="cricket-dot-motion"><span className="cricket-dot-glyph">.</span><span className="cricket-dot-baseline" aria-hidden="true" /><svg className="cricket-dot-seam" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7 2 C12 7 12 13 7 18" /></svg></span></span></span></h2>
    <svg className="cricket-heading-bat" viewBox="0 0 96 112" aria-hidden="true" focusable="false">
      <g className="cricket-bat-travel"><g className="cricket-bat-body" transform={`rotate(${BAT_REST_ANGLE} 48 21)`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="45" y="10" width="6" height="31" rx="2.5" />
        <path d="M45 37 C43 41 39 45 39 51 V87 Q39 95 48 95 Q57 95 57 87 V51 C57 45 53 41 51 37 Z" />
      </g></g>
    </svg>
    <button className="cricket-dot-trigger" type="button" aria-label="Replay cricket batting animation" />
  </div>;
}
