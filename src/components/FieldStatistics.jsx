import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

export default function FieldStatistics() {
  const root = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const blocks = [...root.current.querySelectorAll('.stat-block')];
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
      });
      timeline.from(root.current, { opacity: 0, y: 8, duration: .65 }, 0)
        .from(root.current, { '--stat-ambient-opacity': 0, duration: .9 }, 0)
        .from('.stat-content', { opacity: 0, y: 10, duration: .45, stagger: .09 }, .12)
        .from('.stat-rule-vertical', { scaleY: 0, transformOrigin: 'top', duration: .65, stagger: .08 }, .15)
        .from('.stat-rule-horizontal', { scaleX: 0, transformOrigin: 'left', duration: .65, stagger: .08 }, .15);
      blocks.forEach((block, index) => {
        const start = .2 + index * .09;
        block.querySelectorAll('[data-count]').forEach((number) => {
          timeline.fromTo(number, { textContent: 0 }, {
            textContent: Number(number.dataset.count), snap: { textContent: 1 },
            duration: .95,
          }, start);
        });
        const strokes = block.querySelectorAll('.stat-draw');
        const dots = block.querySelectorAll('.stat-dot');
        if (strokes.length) timeline.from(strokes, { drawSVG: '0%', duration: .7, stagger: .05 }, start);
        if (dots.length) timeline.from(dots, { opacity: 0, duration: .3, stagger: .035 }, start);
      });
      timeline.fromTo('.stat-packet', { attr: { cx: 9 } }, { attr: { cx: 51 }, duration: .8, ease: 'power1.inOut' }, .32);

      const dataCount = root.current.querySelector('.stat-data-count');
      const dataNumber = dataCount.querySelector('text');
      const dataFinal = root.current.querySelector('.stat-data-final');
      const counter = { value: 0 };
      const formatCount = new Intl.NumberFormat('en-GB');
      const countStart = .47;
      const countDuration = 3;
      const settleAt = countStart + countDuration + .4;

      // Count individual points past the eight-million threshold, then abbreviate.
      // This is a visual threshold illustration; the reported metric remains 8M+.
      timeline.set(dataFinal, { autoAlpha: 0 }, 0)
        .set(dataCount, { autoAlpha: 1 }, 0)
        .to(counter, {
          value: 8_012_851,
          duration: countDuration,
          ease: 'power2.out',
          onUpdate: () => { dataNumber.textContent = formatCount.format(Math.floor(counter.value)); },
        }, countStart)
        .to(dataCount, { autoAlpha: 0, duration: .18 }, settleAt)
        .to(dataFinal, { autoAlpha: 1, duration: .18 }, settleAt + .1);

      // Keep the accessible copy and reduced-motion view at their final values.
      return () => {
        root.current?.querySelectorAll('[data-count]').forEach((number) => { number.textContent = number.dataset.count; });
        dataNumber.textContent = '0';
      };
    });
    return () => mm.revert();
  }, { scope: root });

  return <div className="field-statistics" ref={root} role="group" aria-label="Analysis performance and event statistics">
    <div className="stat-block" role="group" aria-label="Real time: 120 FPS+, live processing">
      <div className="stat-content" aria-hidden="true">
        <div className="stat-top"><span>Real time</span><svg className="stat-motif" viewBox="0 0 60 24"><path className="stat-draw" d="M2 13 H14 L20 5 L26 19 L32 10 L37 13 H58" /><path className="stat-ticks" d="M5 20 V23 M15 20 V23 M25 20 V23 M35 20 V23 M45 20 V23 M55 20 V23" /></svg></div>
        <div className="stat-body"><strong className="stat-metric stat-fps"><span className="stat-number" data-count="120">120</span><span className="stat-unit">FPS+</span></strong><span className="stat-label">Live processing</span></div>
      </div>
    </div>
    <div className="stat-block" role="group" aria-label="Low latency, high ingest rate">
      <span className="stat-rule stat-rule-vertical" aria-hidden="true" /><span className="stat-rule stat-rule-horizontal" aria-hidden="true" />
      <div className="stat-content" aria-hidden="true">
        <div className="stat-top"><span>Low latency</span><svg className="stat-motif" viewBox="0 0 60 24"><path className="stat-draw" d="M3 12 H57 M3 8 V16 M57 8 V16" /><circle className="stat-packet stat-dot" cx="51" cy="12" r="2.4" /></svg></div>
        <div className="stat-body"><strong className="stat-throughput">High ingest<br />rate</strong></div>
      </div>
    </div>
    <div className="stat-block" role="group" aria-label="33 Matches, 788 Rallies">
      <span className="stat-rule stat-rule-vertical" aria-hidden="true" /><span className="stat-rule stat-rule-horizontal" aria-hidden="true" />
      <div className="stat-content" aria-hidden="true">
        <div className="stat-top"><span>Match coverage</span><svg className="stat-motif" viewBox="0 0 60 24"><path className="stat-draw" d="M3 7 H35 M3 17 H53" /><circle className="stat-dot" cx="40" cy="7" r="1.8" /><circle className="stat-dot" cx="58" cy="17" r="1.8" /></svg></div>
        <div className="stat-body stat-pair"><div><strong className="stat-metric"><span className="stat-number" data-count="33">33</span></strong><span className="stat-label">Matches</span></div><div><strong className="stat-metric"><span className="stat-number" data-count="788">788</span></strong><span className="stat-label">Rallies</span></div></div>
      </div>
    </div>
    <div className="stat-block" role="group" aria-label="8M+ Data points, 13 Days running">
      <span className="stat-rule stat-rule-vertical" aria-hidden="true" /><span className="stat-rule stat-rule-horizontal" aria-hidden="true" />
      <div className="stat-content" aria-hidden="true">
        <div className="stat-top"><span>Data capture</span><svg className="stat-motif stat-data-grid" viewBox="0 0 60 24">{Array.from({ length: 15 }, (_, index) => <circle className="stat-dot" key={index} cx={10 + (index % 5) * 10} cy={5 + Math.floor(index / 5) * 7} r="1.3" />)}</svg></div>
        <div className="stat-body stat-pair"><div><strong className="stat-metric stat-data-metric"><span className="stat-data-final"><span className="stat-number">8</span><span className="stat-suffix">M+</span></span><svg className="stat-data-count" viewBox="0 0 168 60" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><text x="0" y="46">0</text></svg></strong><span className="stat-label">Data points</span></div><div><strong className="stat-metric"><span className="stat-number" data-count="13">13</span></strong><span className="stat-label">Days running</span></div></div>
      </div>
    </div>
  </div>;
}
