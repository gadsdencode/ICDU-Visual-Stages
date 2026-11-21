import gsap from 'gsap';

/** All motion belongs to one exact 14s clock; context reverts on unmount. */
export function createPassTimeline(stage: SVGSVGElement) {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } });
    tl.addLabel('define', 0).addLabel('gate', 3.5).addLabel('execute', 7).addLabel('audit', 10.5);
    tl.set('.intent-capsule', { x: 0, opacity: 0, scale: 0.3, svgOrigin: '310 405' }, 0)
      .set('.output-packet', { x: 0, opacity: 0 }, 0)
      .set('.audit-seal', { opacity: 0.18, scale: 1, svgOrigin: '1210 405' }, 0)
      .set('.stamp-ripple', { opacity: 0, scale: 1, svgOrigin: '1210 405' }, 0)
      .set('.shutter-top', { y: 60 }, 0)
      .set('.shutter-bottom', { y: -60 }, 0)
      .set('.scan-beam', { opacity: 0, y: -65 }, 0)
      .set('.scan-light', { stroke: '#F59E0B' }, 0)
      .set('.gate-pass, .energy-arcs, .lineage-pulse, .lineage-drop', { opacity: 0 }, 0)
      .set('.bracket-left, .bracket-right', { x: 0 }, 0)
      .set('.model-core', { scale: 1, opacity: 0.55, svgOrigin: '910 405' }, 0)
      .set('.energy-arcs', { rotation: 0, svgOrigin: '910 405' }, 0)
      .set('.act', { opacity: 0 }, 0)
      .set('.act-0', { opacity: 1 }, 0);

    // Deterministic chaotic trajectories prevent random jumps between repeats.
    stage.querySelectorAll<SVGCircleElement>('.raw-particle').forEach((particle, i) => {
      const x = particle.cx.baseVal.value;
      const y = particle.cy.baseVal.value;
      tl.set(particle, { x: -100 - (i % 4) * 12, y: (i % 3 - 1) * 35, opacity: 0 }, 0)
        .to(particle, { x: 15 + (i % 5) * 8, y: (i % 2 ? 1 : -1) * (25 + i * 2), opacity: 0.9, duration: 0.8 }, i * 0.035)
        .to(particle, { x: 310 - x, y: 405 - y, duration: 1.1, ease: 'power3.in' }, 1.05 + i * 0.035)
        .to(particle, { opacity: 0, duration: 0.18 }, 2.15 + i * 0.035);
    });
    stage.querySelectorAll<SVGPathElement>('.intent-ring').forEach((ring, i) => {
      tl.set(ring, { rotation: (i % 2 ? -1 : 1) * 90, scale: 1.25, opacity: 0.2, svgOrigin: '310 405' }, 0)
        .to(ring, { rotation: 0, scale: 1, opacity: 1, duration: 0.65, ease: 'back.out(1.5)' }, 2.15 + i * 0.16);
    });
    tl.to('.intent-capsule', { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }, 2.65)
      .to('.intent-capsule', { x: 300, duration: 0.85 }, 3.5)
      .to('.scan-beam', { opacity: 1, duration: 0.15 }, 4.35)
      .to('.scan-beam', { y: 70, duration: 1.05, ease: 'sine.inOut' }, 4.5)
      .to('.scan-light', { stroke: '#10B981', duration: 0.2 }, 5.55)
      .to('.gate-pass', { opacity: 1, duration: 0.2 }, 5.55)
      .to('.shutter-top', { y: -8, duration: 0.55 }, 5.75)
      .to('.shutter-bottom', { y: 8, duration: 0.55 }, 5.75)
      .to('.scan-beam', { opacity: 0, duration: 0.3 }, 6.05)
      .to('.intent-capsule', { x: 600, duration: 1.05, ease: 'power2.in' }, 6.3)
      .to('.intent-capsule', { opacity: 0, scale: 0.3, duration: 0.3 }, 7.35)
      .to('.bracket-left', { x: 22, duration: 0.45, ease: 'power3.out' }, 7.4)
      .to('.bracket-right', { x: -22, duration: 0.45, ease: 'power3.out' }, 7.4)
      .to('.model-core', { opacity: 1, duration: 0.3 }, 7.4)
      .to('.model-core', { scale: 1.08, duration: 0.4, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 7.8)
      .to('.energy-arcs', { opacity: 1, duration: 0.25 }, 7.65)
      .to('.energy-arcs', { rotation: 720, duration: 2.65, ease: 'none' }, 7.8)
      .to('.energy-arcs', { opacity: 0, duration: 0.25 }, 10.25)
      .to('.output-packet', { opacity: 1, duration: 0.2 }, 10.5)
      .to('.output-packet', { x: 300, duration: 1.65, ease: 'power2.inOut' }, 10.5);

    // Sample the actual SVG curves, so pulses stay aligned at every viewport size.
    ['define', 'gate'].forEach((name) => {
      const path = stage.querySelector<SVGPathElement>(`#lineage-${name}`)!;
      const pulse = stage.querySelector<SVGCircleElement>(`.lineage-${name}`)!;
      const length = path.getTotalLength();
      const progress = { value: 0 };
      tl.to(pulse, { opacity: 1, duration: 0.1 }, 10.5)
        .fromTo(progress, { value: 0 }, {
          value: 1, duration: 1.35, ease: 'sine.inOut',
          onUpdate: () => {
            const point = path.getPointAtLength(progress.value * length);
            pulse.setAttribute('cx', String(point.x));
            pulse.setAttribute('cy', String(point.y));
          },
        }, 10.5)
        .to(pulse, { opacity: 0, duration: 0.1 }, 11.85);
    });
    tl.fromTo('.lineage-drop', { y: 0 }, { opacity: 1, y: 90, duration: 0.3, ease: 'power2.in' }, 11.85)
      .to('.lineage-drop, .output-packet', { opacity: 0, duration: 0.12 }, 12.15)
      .fromTo('.audit-seal', { scale: 0.88 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)' }, 12.15)
      .fromTo('.stamp-ripple', { scale: 0.9, opacity: 1 }, { scale: 1.8, opacity: 0, duration: 0.7, ease: 'power2.out' }, 12.15);
    [3.5, 7, 10.5].forEach((time, i) => {
      tl.to(`.act-${i}`, { opacity: 0, duration: 0.3 }, time)
        .to(`.act-${i + 1}`, { opacity: 1, duration: 0.4 }, time + 0.1);
    });
    // Return gently to the initial visual state before the exact 14s repeat.
    tl.to('.audit-seal', { opacity: 0.18, duration: 0.45 }, 13.55)
      .to('.act-3', { opacity: 0, duration: 0.35 }, 13.5)
      .to('.act-0', { opacity: 1, duration: 0.4 }, 13.6)
      .to('.bracket-left, .bracket-right', { x: 0, duration: 0.5 }, 13.5)
      .to('.model-core', { opacity: 0.55, duration: 0.5 }, 13.5)
      .to('.gate-pass', { opacity: 0, duration: 0.5 }, 13.5)
      .to('.shutter-top', { y: 60, duration: 0.5 }, 13.5)
      .to('.shutter-bottom', { y: -60, duration: 0.5 }, 13.5)
      .to('.intent-ring', { opacity: 0.2, duration: 0.4 }, 13.6);
  }, stage);
  return () => ctx.revert();
}
