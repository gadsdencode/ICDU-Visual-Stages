import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);
export type Scenario = 'pass' | 'block';

/** All motion belongs to one exact 14s clock; context reverts on unmount. */
export function createPassTimeline(stage: SVGSVGElement, scenario: Scenario, onUpdate: (time: number) => void) {
  let timeline!: gsap.core.Timeline;
  const blocked = scenario === 'block';
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power3.inOut' } });
    timeline = tl;
    tl.eventCallback('onUpdate', () => onUpdate(tl.time()));
    tl.addLabel('define', 0).addLabel('gate', 3.5).addLabel('execute', 7).addLabel('audit', 10.5);
    tl.set('.intent-capsule', { x: 0, y: 0, opacity: 0, scale: 0.3, svgOrigin: '310 405' }, 0)
      .set('.energy-barrier, .rejection-seal, .quarantine-ripple', { opacity: 0 }, 0)
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
        .to(ring, { rotation: 0, scale: 1, opacity: 1, duration: 0.65, ease: 'expo.out' }, 2.15 + i * 0.16);
    });
    tl.to('.intent-capsule', { opacity: 1, scale: 1, duration: 0.55, ease: 'expo.out' }, 2.65)
      .to('.intent-capsule', { x: 300, duration: 0.85 }, 3.5)
      .to('.scan-beam', { opacity: 1, duration: 0.15 }, 4.35)
      .to('.scan-beam', { y: 70, duration: 1.05, ease: 'sine.inOut' }, 4.5);
    if (!blocked) {
    tl.to('.scan-light', { stroke: '#10B981', duration: 0.2 }, 5.55)
      .to('.gate-pass', { opacity: 1, duration: 0.2 }, 5.55)
      .to('.shutter-top', { y: -8, duration: 0.55 }, 5.75)
      .to('.shutter-bottom', { y: 8, duration: 0.55 }, 5.75)
      .to('.scan-beam', { opacity: 0, duration: 0.3 }, 6.05)
      .to('.intent-capsule', { x: 600, duration: 1.05, ease: 'power3.in' }, 6.3)
      .to('.intent-capsule', { opacity: 0, scale: 0.3, duration: 0.3 }, 7.35)
      .to('.bracket-left', { x: 22, duration: 0.45, ease: 'expo.out' }, 7.4)
      .to('.bracket-right', { x: -22, duration: 0.45, ease: 'expo.out' }, 7.4)
      .to('.model-core', { opacity: 1, duration: 0.3 }, 7.4)
      .to('.model-core', { scale: 1.08, duration: 0.4, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 7.8)
      .to('.energy-arcs', { opacity: 1, duration: 0.25 }, 7.65)
      .to('.energy-arcs', { rotation: 720, duration: 2.65, ease: 'none' }, 7.8)
      .to('.energy-arcs', { opacity: 0, duration: 0.25 }, 10.25)
      .to('.output-packet', { opacity: 1, duration: 0.2 }, 10.5)
      .to('.output-packet', { x: 300, duration: 1.65, ease: 'power3.inOut' }, 10.5);

    // Sample the actual SVG curves, so pulses stay aligned at every viewport size.
    ['define', 'gate'].forEach((name) => {
      const path = stage.querySelector<SVGPathElement>(`#lineage-${name}`)!;
      const pulse = stage.querySelector<SVGCircleElement>(`.lineage-${name}`)!;
      const length = path.getTotalLength();
      const points = Array.from({ length: 81 }, (_, i) => {
        const p = path.getPointAtLength(length * i / 80);
        return { x: p.x, y: p.y };
      });
      tl.to(pulse, { opacity: 1, duration: 0.1 }, 10.5)
        .fromTo(pulse, { x: points[0].x, y: points[0].y }, {
          motionPath: { path: points, curviness: 0 }, duration: 1.35, ease: 'power3.inOut',
        }, 10.5)
        .to(pulse, { opacity: 0, duration: 0.1 }, 11.85);
    });
    tl.fromTo('.lineage-drop', { y: 0 }, { opacity: 1, y: 90, duration: 0.3, ease: 'power2.in' }, 11.85)
      .to('.lineage-drop, .output-packet', { opacity: 0, duration: 0.12 }, 12.15)
      .fromTo('.audit-seal', { scale: 0.88 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out' }, 12.15)
      .fromTo('.stamp-ripple', { scale: 0.9, opacity: 1 }, { scale: 1.8, opacity: 0, duration: 0.7, ease: 'expo.out' }, 12.15);
    } else {
      const path = stage.querySelector<SVGPathElement>('#quarantine-path')!;
      const length = path.getTotalLength();
      const points = Array.from({ length: 61 }, (_, i) => {
        const p = path.getPointAtLength(length * i / 60);
        return { x: p.x - 310, y: p.y - 405 };
      });
      // The capsule follows the actual deflection curve and ends at the node.
      points.unshift({ x: 300, y: 0 });
      points.push({ x: 300, y: 250 });
      tl.set('.lineage-gate, .lineage-drop', { fill: '#F43F5E' }, 0)
        .to('.scan-beam', { opacity: 0.25, duration: 0.09, repeat: 3, yoyo: true }, 5.25)
        .to('.scan-light', { stroke: '#F43F5E', duration: 0.12 }, 5.55)
        .fromTo('.energy-barrier', { scaleY: 0, svgOrigin: '610 405' }, { scaleY: 1, opacity: 1, duration: 0.18, ease: 'expo.out' }, 5.65)
        .to('.shutter-top', { y: 65, duration: 0.15 }, 5.65)
        .to('.shutter-bottom', { y: -65, duration: 0.15 }, 5.65)
        .to('.intent-capsule polygon', { stroke: '#F43F5E', fill: '#430F1D', duration: 0.2 }, 5.65)
        .to('.scan-beam', { opacity: 0, duration: 0.25 }, 5.85)
        .to('.intent-capsule', { motionPath: { path: points, curviness: 0 }, duration: 1.6, ease: 'power3.inOut' }, 5.9)
        .fromTo('.quarantine-ripple', { scale: 0.7, svgOrigin: '610 655' }, { scale: 2.2, opacity: 0.9, duration: 0.2 }, 7.5)
        .to('.quarantine-ripple', { scale: 3, opacity: 0, duration: 0.5 }, 7.7)
        .to('.intent-capsule', { scale: 0.45, opacity: 0, duration: 0.4 }, 7.55);
      const lineage = stage.querySelector<SVGPathElement>('#lineage-gate')!;
      const lineageLength = lineage.getTotalLength();
      const lineagePoints = Array.from({ length: 81 }, (_, i) => {
        const p = lineage.getPointAtLength(lineageLength * i / 80);
        return { x: p.x, y: p.y };
      });
      tl.to('.lineage-gate', { opacity: 1, duration: 0.1 }, 5.9)
        .fromTo('.lineage-gate', { x: 610, y: 315 }, { motionPath: { path: lineagePoints, curviness: 0 }, duration: 1.6 }, 5.9)
        .to('.lineage-gate', { opacity: 0, duration: 0.1 }, 7.5)
        .fromTo('.lineage-drop', { y: 0 }, { opacity: 1, y: 90, duration: 0.3 }, 7.5)
        .to('.lineage-drop', { opacity: 0, duration: 0.1 }, 7.8)
        .to('.audit-seal', { opacity: 0, duration: 0.15 }, 7.8)
        .fromTo('.rejection-seal', { scale: 0.85, svgOrigin: '1210 405' }, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out' }, 7.8)
        .to('.rejection-seal, .energy-barrier', { opacity: 0, duration: 0.5 }, 13.5);
    }
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
  return { timeline, dispose: () => ctx.revert() };
}
