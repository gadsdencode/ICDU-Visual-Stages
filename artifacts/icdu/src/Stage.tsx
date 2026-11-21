import { memo, useLayoutEffect, useRef } from 'react';
import { createPassTimeline, type Scenario } from './passTimeline';
import type gsap from 'gsap';

const C = '#38BDF8';
const E = '#10B981';
const A = '#F59E0B';
const R = '#F43F5E';
const INK = '#E6EDF5';
const DIM = '#7C8A9E';
const MONO = "'Geist Mono', ui-monospace, monospace";
const SANS = "'Geist', ui-sans-serif, system-ui, sans-serif";
const SERIF = "'Instrument Serif', Georgia, serif";

// Deterministic raw-prompt particles in the input stream (x 60 to 210)
const PARTICLES: [number, number, number, number][] = [
  [64, 352, 1.4, 0.35], [78, 431, 2.2, 0.55], [86, 388, 1.1, 0.3], [97, 462, 1.6, 0.4],
  [104, 330, 1.2, 0.28], [112, 409, 2.6, 0.7], [121, 371, 1.5, 0.45], [129, 446, 1.2, 0.35],
  [138, 395, 1.9, 0.6], [146, 422, 1.3, 0.5], [152, 352, 1.1, 0.3], [160, 476, 1.0, 0.25],
  [167, 400, 2.4, 0.8], [174, 384, 1.4, 0.55], [181, 428, 1.7, 0.65], [188, 412, 1.2, 0.6],
  [194, 398, 2.0, 0.85], [200, 406, 1.5, 0.9], [206, 402, 1.1, 0.95], [71, 398, 1.0, 0.3],
  [92, 344, 0.9, 0.22], [118, 482, 0.9, 0.22], [143, 336, 1.0, 0.3], [158, 440, 1.6, 0.5],
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
}
function hex(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => polar(cx, cy, r, i * 60).map((v) => v.toFixed(2)).join(',')).join(' ');
}

function StationLabel({ x, n, name, sub, color }: { x: number; n: string; name: string; sub: string; color: string }) {
  return (
    <g textAnchor="middle">
      <line x1={x} y1={514} x2={x} y2={526} stroke={color} strokeOpacity={0.5} />
      <text x={x} y={548} fontFamily={MONO} fontSize={10} letterSpacing={2.4} fill={color} fillOpacity={0.85}>
        {n}
      </text>
      <text x={x} y={574} fontFamily={SANS} fontSize={20} fontWeight={500} letterSpacing={5} fill={INK}>
        {name}
      </text>
      <text x={x} y={596} fontFamily={MONO} fontSize={10} letterSpacing={1.2} fill={DIM}>
        {sub}
      </text>
    </g>
  );
}

function Stage({ scenario, onReady, onTime }: {
  scenario: Scenario;
  onReady: (timeline: gsap.core.Timeline | null) => void;
  onTime: (time: number) => void;
}) {
  const stage = useRef<SVGSVGElement>(null);
  useLayoutEffect(() => {
    if (!stage.current) return;
    const animation = createPassTimeline(stage.current, scenario, onTime);
    onReady(animation.timeline);
    return () => { onReady(null); animation.dispose(); };
  }, [scenario, onReady, onTime]);
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg
      ref={stage}
      viewBox="0 0 1440 810"
      preserveAspectRatio="xMidYMid meet"
      className="icdu-stage"
      role="img"
      aria-labelledby="icdu-title icdu-desc"
    >
      <title id="icdu-title">ICDU: AI Guided by Intent</title>
      <desc id="icdu-desc">
        An optical pipeline along a single horizon. Raw prompt particles enter a DEFINE lens that focuses goal, rules and
        criteria; pass through a GATE aperture with an amber scanline, where rejected intent is deflected down a crimson
        path to Quarantine; are executed inside a contained, model-agnostic neural core; and arrive at an AUDIT hexagonal
        evidence seal. A thin lineage arc carries provenance from DEFINE and GATE directly to AUDIT.
      </desc>

      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#9FB4CC" strokeOpacity="0.045" strokeWidth="1" />
        </pattern>
        <radialGradient id="spot" cx="720" cy="405" r="760" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0F1A2A" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#0A111C" stopOpacity="0.6" />
          <stop offset="1" stopColor="#05070B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gridMask" cx="720" cy="405" r="700" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="gridFade">
          <rect width="1440" height="810" fill="url(#gridMask)" />
        </mask>
        <radialGradient id="vignette" cx="720" cy="405" r="900" gradientUnits="userSpaceOnUse">
          <stop offset="0.6" stopColor="#05070B" stopOpacity="0" />
          <stop offset="1" stopColor="#020306" stopOpacity="0.85" />
        </radialGradient>

        <linearGradient id="spine" x1="210" y1="0" x2="1290" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C} stopOpacity="0" />
          <stop offset="0.12" stopColor={C} stopOpacity="0.55" />
          <stop offset="0.7" stopColor={C} stopOpacity="0.45" />
          <stop offset="0.92" stopColor={E} stopOpacity="0.6" />
          <stop offset="1" stopColor={E} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineage" x1="310" y1="0" x2="1210" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C} stopOpacity="0.9" />
          <stop offset="0.75" stopColor={C} stopOpacity="0.55" />
          <stop offset="1" stopColor={E} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="scan" x1="560" y1="0" x2="660" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={A} stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFE3A8" stopOpacity="1" />
          <stop offset="1" stopColor={A} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam" x1="0" y1="315" x2="0" y2="495" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={C} stopOpacity="0" />
          <stop offset="0.5" stopColor={C} stopOpacity="0.16" />
          <stop offset="1" stopColor={C} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A2433" />
          <stop offset="1" stopColor="#0B111A" />
        </linearGradient>
        <radialGradient id="core" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#E0F5FF" stopOpacity="0.95" />
          <stop offset="0.18" stopColor={C} stopOpacity="0.75" />
          <stop offset="0.55" stopColor="#0E4A6B" stopOpacity="0.55" />
          <stop offset="1" stopColor="#071521" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="lensGlass" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor={C} stopOpacity="0.18" />
          <stop offset="0.6" stopColor={C} stopOpacity="0.04" />
          <stop offset="1" stopColor="#05070B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sealGlass" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor={E} stopOpacity="0.22" />
          <stop offset="1" stopColor={E} stopOpacity="0.02" />
        </radialGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        <filter id="glowSoft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowHard" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="b3" />
          <feMerge>
            <feMergeNode in="b3" />
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="28" />
        </filter>

        <path id="arcGoal" d={arc(310, 405, 82, -62, 62)} />
        <path id="arcRules" d={arc(310, 405, 94, 28, 152)} />
        <path id="arcCriteria" d={arc(310, 405, 106, 208, 332)} />
        <path id="coreLabel" d={arc(910, 405, 76, 270, 450)} />
      </defs>

      {/* Atmosphere */}
      <rect width="1440" height="810" fill="#05070B" />
      <rect width="1440" height="810" fill="url(#spot)" />
      <rect width="1440" height="810" fill="url(#grid)" mask="url(#gridFade)" />
      <line x1="0" y1="405" x2="1440" y2="405" stroke="#9FB4CC" strokeOpacity="0.05" />

      {/* Header */}
      <g>
        <rect x="64" y="58" width="6" height="6" fill={C} filter="url(#glowSoft)" />
        <text x="82" y="64" dominantBaseline="middle" fontFamily={MONO} fontSize={11} letterSpacing={3.2} fill={C} fillOpacity={0.9}>
          ICDU · INTENT-CONSCIOUS DATA UNIT
        </text>
        {[
          ['AI, guided by ', 'intent.', 'ACT I — DEFINE · GOAL, RULES, CRITERIA'],
          ['Every intent, ', scenario === 'block' ? 'checked.' : 'verified.', scenario === 'block' ? 'ACT II — GATE · VIOLATION DETECTED' : 'ACT II — GATE · SCAN, VERIFY, RELEASE'],
          [scenario === 'block' ? 'Violation, ' : 'Intelligence, ', 'contained.', scenario === 'block' ? 'ACT III — QUARANTINED · EXECUTION SKIPPED' : 'ACT III — EXECUTE · ANY MODEL, WITHIN GUARDRAILS'],
          ['Every outcome, ', 'accountable.', scenario === 'block' ? 'ACT IV — AUDIT · REJECTION RECORDED' : 'ACT IV — AUDIT · LINEAGE BECOMES EVIDENCE'],
        ].map(([lead, emphasis, caption], i) => (
          <g key={caption} className={`act act-${i}`} opacity={i === 0 ? 1 : 0}>
            <text x="64" y="128" fontFamily={SANS} fontSize={46} fontWeight={300} letterSpacing={-1.2} fill={INK}>
              {lead}<tspan fontFamily={SERIF} fontStyle="italic" fontSize={54} fill={i === 3 ? E : C}>{emphasis}</tspan>
            </text>
            <text x="64" y="160" fontFamily={MONO} fontSize={11} letterSpacing={1.6} fill={DIM}>{caption}</text>
          </g>
        ))}
      </g>

      {/* Frame registration marks */}
      <g stroke="#9FB4CC" strokeOpacity="0.22" strokeWidth="1">
        <path d="M1376 40h24v24" fill="none" />
        <path d="M40 746v24h24" fill="none" />
        <path d="M1400 746v24h-24" fill="none" />
      </g>
      <text x="1376" y="64" textAnchor="end" fontFamily={MONO} fontSize={10} letterSpacing={2} fill={DIM}>
        STAGE 1440 × 810 · Y 405
      </text>

      {/* Overhead Lineage Arc */}
      <g fill="none">
        <path d="M310,315 C450,150 1070,150 1210,315" stroke="url(#lineage)" strokeOpacity="0.35" strokeWidth="5" filter="url(#bloom)" />
        <path id="lineage-define" d="M310,315 C450,150 1070,150 1210,315" stroke="url(#lineage)" strokeWidth="1" />
        <path id="lineage-gate" d="M610,315 C740,220 1080,220 1210,315" stroke="url(#lineage)" strokeWidth="1" strokeDasharray="1 5" strokeLinecap="round" />
        {[[310, 315], [610, 315]].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="3" fill={C} filter="url(#glowSoft)" />
            <line x1={x} y1={y + 6} x2={x} y2={y + 14} stroke={C} strokeOpacity="0.5" />
          </g>
        ))}
        <circle cx="1210" cy="315" r="3.5" fill={E} filter="url(#glowHard)" />
        <circle className="lineage-pulse lineage-define" r="4" fill="#E0F5FF" filter="url(#glowHard)" opacity="0" />
        <circle className="lineage-pulse lineage-gate" r="4" fill={E} filter="url(#glowHard)" opacity="0" />
        <circle className="lineage-drop" cx="1210" cy="315" r="5" fill={E} filter="url(#glowHard)" opacity="0" />
      </g>
      <text x="760" y="176" textAnchor="middle" fontFamily={MONO} fontSize={10} letterSpacing={3} fill={C} fillOpacity={0.75}>
        LINEAGE · INTENT → EVIDENCE
      </text>

      {/* Spine */}
      <line x1="210" y1="405" x2="1290" y2="405" stroke="url(#spine)" strokeWidth="1" />
      <line x1="210" y1="405" x2="1290" y2="405" stroke="url(#spine)" strokeWidth="4" strokeOpacity="0.25" filter="url(#bloom)" />

      {/* Input Stream */}
      <g>
        {PARTICLES.slice(0, 16).map(([x, y, r], i) => (
          <circle className="raw-particle" key={i} cx={x} cy={y} r={r + 0.7} fill={i % 5 === 0 ? INK : C} filter="url(#glowSoft)" />
        ))}
        <path d="M60 300 L60 292 L68 292" stroke={DIM} strokeOpacity="0.5" fill="none" />
        <text x="60" y="280" fontFamily={MONO} fontSize={10} letterSpacing={2.4} fill={DIM}>
          RAW PROMPTS
        </text>
        <text x="60" y="520" fontFamily={MONO} fontSize={9} letterSpacing={1} fill={DIM} fillOpacity={0.7}>
          "summarise q3 churn"
        </text>
        <text x="60" y="536" fontFamily={MONO} fontSize={9} letterSpacing={1} fill={DIM} fillOpacity={0.5}>
          "email every customer"
        </text>
        <text x="60" y="552" fontFamily={MONO} fontSize={9} letterSpacing={1} fill={DIM} fillOpacity={0.32}>
          "export the full ledger"
        </text>
      </g>

      {/* STATION 1 — DEFINE */}
      <g>
        <circle cx="310" cy="405" r="80" fill={C} fillOpacity="0.08" filter="url(#bloom)" />
        <circle cx="310" cy="405" r="68" fill="url(#lensGlass)" />
        {ticks.map((d) => {
          const major = d % 30 === 0;
          const [x0, y0] = polar(310, 405, 68, d);
          const [x1, y1] = polar(310, 405, major ? 60 : 64, d);
          return <line key={d} x1={x0} y1={y0} x2={x1} y2={y1} stroke={C} strokeOpacity={major ? 0.7 : 0.25} strokeWidth="1" />;
        })}
        <circle cx="310" cy="405" r="68" fill="none" stroke={C} strokeWidth="1.5" filter="url(#glowSoft)" />
        <circle cx="310" cy="405" r="44" fill="none" stroke={C} strokeOpacity="0.3" />
        <circle cx="310" cy="405" r="24" fill="none" stroke={C} strokeOpacity="0.5" strokeDasharray="2 3" />
        <path d="M296 405h28M310 391v28" stroke={C} strokeOpacity="0.8" />
        <circle cx="310" cy="405" r="3" fill="#E0F5FF" filter="url(#glowHard)" />
        {/* lens specular */}
        <path d={arc(310, 405, 56, 300, 350)} stroke="#E0F5FF" strokeOpacity="0.5" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* micro-arcs */}
        <path className="intent-ring" d={arc(310, 405, 82, -62, 62)} stroke={C} strokeOpacity="0.9" strokeWidth="1.25" fill="none" strokeLinecap="round" />
        <path className="intent-ring" d={arc(310, 405, 94, 28, 152)} stroke={C} strokeOpacity="0.6" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path className="intent-ring" d={arc(310, 405, 106, 208, 332)} stroke={C} strokeOpacity="0.4" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
        <g fontFamily={MONO} fontSize={9} letterSpacing={3} fill={C}>
          <text dy="-5">
            <textPath href="#arcGoal" startOffset="50%" textAnchor="middle" fillOpacity="0.95">GOAL</textPath>
          </text>
          <text dy="-5">
            <textPath href="#arcRules" startOffset="50%" textAnchor="middle" fillOpacity="0.75">RULES</textPath>
          </text>
          <text dy="-5">
            <textPath href="#arcCriteria" startOffset="50%" textAnchor="middle" fillOpacity="0.6">CRITERIA</textPath>
          </text>
        </g>
      </g>
      <StationLabel x={310} n="01" name="DEFINE" sub="intent is focused" color={C} />

      {/* STATION 2 — GATE */}
      <g>
        <rect x="560" y="315" width="100" height="180" fill="url(#beam)" />
        {/* housing */}
        <rect x="586" y="305" width="48" height="200" rx="2" fill="#070B12" stroke="#9FB4CC" strokeOpacity="0.18" />
        <rect x="598" y="315" width="24" height="180" fill={C} fillOpacity="0.05" stroke={C} strokeOpacity="0.75" strokeWidth="1" filter="url(#glowSoft)" />
        {/* rail ticks */}
        {Array.from({ length: 19 }, (_, i) => 315 + i * 10).map((y, i) => (
          <g key={y} stroke="#9FB4CC" strokeOpacity={i % 3 === 0 ? 0.45 : 0.18}>
            <line x1="586" y1={y} x2={i % 3 === 0 ? 578 : 582} y2={y} />
            <line x1="634" y1={y} x2={i % 3 === 0 ? 642 : 638} y2={y} />
          </g>
        ))}
        {/* iris shutters */}
        <g>
          <g className="shutter-top">
          <path d="M592 305 H628 L622 340 H598 Z" fill="url(#blade)" stroke="#9FB4CC" strokeOpacity="0.4" />
          <path d="M598 340 H622" stroke={C} strokeOpacity="0.9" filter="url(#glowSoft)" />
          <path d="M598 318 L610 330 L622 318" stroke="#9FB4CC" strokeOpacity="0.35" fill="none" />
          </g>
          <g className="shutter-bottom">
          <path d="M592 505 H628 L622 470 H598 Z" fill="url(#blade)" stroke="#9FB4CC" strokeOpacity="0.4" />
          <path d="M598 470 H622" stroke={C} strokeOpacity="0.9" filter="url(#glowSoft)" />
          <path d="M598 492 L610 480 L622 492" stroke="#9FB4CC" strokeOpacity="0.35" fill="none" />
          </g>
          <circle cx="592" cy="312" r="1.6" fill="#9FB4CC" fillOpacity="0.6" />
          <circle cx="628" cy="312" r="1.6" fill="#9FB4CC" fillOpacity="0.6" />
          <circle cx="592" cy="498" r="1.6" fill="#9FB4CC" fillOpacity="0.6" />
          <circle cx="628" cy="498" r="1.6" fill="#9FB4CC" fillOpacity="0.6" />
        </g>
        <g className="scan-beam" opacity="0">
        <rect x="556" y="394" width="108" height="10" fill={A} fillOpacity="0.12" filter="url(#bloom)" />
        <line className="scan-light" x1="560" y1="398" x2="660" y2="398" stroke={A} strokeWidth="2" filter="url(#glowHard)" />
        <line x1="590" y1="402" x2="630" y2="402" stroke={A} strokeOpacity="0.35" />
        <text x="668" y="401" fontFamily={MONO} fontSize={9} letterSpacing={2} fill={A} fillOpacity="0.9">SCAN</text>
        <text x="552" y="401" textAnchor="end" fontFamily={MONO} fontSize={9} letterSpacing={1.5} fill={A} fillOpacity="0.55">0.973</text>
        </g>
        <text className="gate-pass" opacity="0" x="650" y="410" fill={E} fontFamily={MONO} fontSize="10" letterSpacing="2">PASS</text>
        <rect className="energy-barrier" x="604" y="315" width="12" height="180" fill={R} filter="url(#glowHard)" opacity="0" />
        <text x="610" y="296" textAnchor="middle" fontFamily={MONO} fontSize={9} letterSpacing={2} fill={DIM}>APERTURE 180</text>
      </g>
      <StationLabel x={610} n="02" name="GATE" sub="out-of-policy intent stops" color={A} />

      {/* Deflection path + Quarantine */}
      <g>
        <path
          id="quarantine-path"
          d="M624,430 C690,440 708,520 700,580 C694,628 660,655 632,655"
          fill="none"
          stroke={R}
          strokeWidth="1.5"
          strokeDasharray="0.5 6"
          strokeLinecap="round"
          filter="url(#glowSoft)"
        />
        <path d="M638,649 L630,655 L638,661" fill="none" stroke={R} strokeOpacity="0.9" />
        <circle cx="610" cy="655" r="30" fill={R} fillOpacity="0.12" filter="url(#bloom)" />
        <circle cx="610" cy="655" r="20" fill="#13070B" stroke={R} strokeWidth="1.25" filter="url(#glowSoft)" />
        <circle cx="610" cy="655" r="26" fill="none" stroke={R} strokeOpacity="0.3" strokeDasharray="2 4" />
        <path d="M603 648 L617 662 M617 648 L603 662" stroke={R} strokeWidth="1.5" strokeLinecap="round" />
        <text x="566" y="651" textAnchor="end" fontFamily={MONO} fontSize={10} letterSpacing={2.4} fill={R}>QUARANTINE</text>
        <text x="566" y="667" textAnchor="end" fontFamily={MONO} fontSize={9} letterSpacing={1} fill={DIM}>held · never executed</text>
      </g>

      {/* STATION 3 — EXECUTE */}
      <g>
        <circle cx="910" cy="405" r="90" fill={C} fillOpacity="0.14" filter="url(#bloom)" />
        {/* static neural pulse rings */}
        <circle cx="910" cy="405" r="100" fill="none" stroke={C} strokeOpacity="0.08" />
        <circle cx="910" cy="405" r="88" fill="none" stroke={C} strokeOpacity="0.16" />
        <circle className="model-core" cx="910" cy="405" r="64" fill="url(#core)" stroke={C} strokeWidth="1.25" filter="url(#glowSoft)" />
        <g className="energy-arcs" opacity="0" fill="none" stroke={C} strokeWidth="2" filter="url(#glowSoft)">
          <path d={arc(910, 405, 48, 0, 85)} />
          <path d={arc(910, 405, 48, 180, 265)} />
          <path d={arc(910, 405, 35, 85, 160)} stroke="#E0F5FF" />
        </g>
        {/* neural lattice */}
        <g stroke="#E0F5FF" strokeOpacity="0.35" strokeWidth="0.75">
          {[[-30, -22], [24, -34], [36, 10], [8, 34], [-34, 18], [-6, -4]].map(([x, y], i, arr) =>
            arr.slice(i + 1).map(([x2, y2], j) => <line key={`${i}-${j}`} x1={910 + x} y1={405 + y} x2={910 + x2} y2={405 + y2} />),
          )}
        </g>
        {[[-30, -22], [24, -34], [36, 10], [8, 34], [-34, 18]].map(([x, y], i) => (
          <circle key={i} cx={910 + x} cy={405 + y} r="2.2" fill="#E0F5FF" />
        ))}
        <circle cx="904" cy="401" r="5" fill="#fff" fillOpacity="0.95" filter="url(#glowHard)" />
        <text fontFamily={MONO} fontSize={8.5} letterSpacing={2.2} fill={C} fillOpacity="0.85">
          <textPath href="#coreLabel" startOffset="50%" textAnchor="middle">ANY LLM • MODEL-AGNOSTIC</textPath>
        </text>
        {/* containment brackets */}
        <g fill="#0B1220" stroke={C} strokeWidth="1.25" strokeLinejoin="miter">
          <path className="bracket-left" d="M836 317 H806 V493 H836 V481 H818 V329 H836 Z" />
          <path className="bracket-right" d="M984 317 H1014 V493 H984 V481 H1002 V329 H984 Z" />
        </g>
        <g stroke={C} strokeOpacity="0.5">
          <path className="bracket-left" d="M806 370 L796 380 V430 L806 440" fill="none" />
          <path className="bracket-right" d="M1014 370 L1024 380 V430 L1014 440" fill="none" />
        </g>
        <g fill={C}>
          <rect className="bracket-left" x="809" y="320" width="6" height="2" />
          <rect className="bracket-left" x="809" y="488" width="6" height="2" />
          <rect className="bracket-right" x="1005" y="320" width="6" height="2" />
          <rect className="bracket-right" x="1005" y="488" width="6" height="2" />
        </g>
      </g>
      <StationLabel x={910} n="03" name="EXECUTE" sub="any model, contained" color={C} />

      {/* STATION 4 — AUDIT */}
      <g className="audit-seal">
        <circle cx="1210" cy="405" r="84" fill={E} fillOpacity="0.12" filter="url(#bloom)" />
        <polygon points={hex(1210, 405, 80)} fill="none" stroke={E} strokeOpacity="0.2" strokeDasharray="2 4" />
        <polygon points={hex(1210, 405, 68)} fill="url(#sealGlass)" stroke={E} strokeWidth="1.5" filter="url(#glowSoft)" />
        <polygon points={hex(1210, 405, 54)} fill="none" stroke={E} strokeOpacity="0.35" />
        {Array.from({ length: 6 }, (_, i) => {
          const [x, y] = polar(1210, 405, 68, i * 60);
          return <circle key={i} cx={x} cy={y} r="2" fill={E} />;
        })}
        <path d="M1188 406 L1203 421 L1234 388" fill="none" stroke="#D1FAE5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#glowHard)" />
        <line x1="1166" y1="446" x2="1254" y2="446" stroke={E} strokeOpacity="0.3" />
        <text x="1210" y="458" textAnchor="middle" fontFamily={MONO} fontSize={7.5} letterSpacing={1} fill={E} fillOpacity="0.85">
          sha256 · 7f3a9c…e04b1d
        </text>
        <text x="1300" y="401" fontFamily={MONO} fontSize={9} letterSpacing={2} fill={E} fillOpacity="0.85">VERIFIED</text>
        <text x="1300" y="415" fontFamily={MONO} fontSize={9} letterSpacing={1} fill={DIM}>14:02:37.418Z</text>
      </g>
      <StationLabel x={1210} n="04" name="AUDIT" sub="evidence, sealed" color={E} />
      <g className="rejection-seal" opacity="0">
        <polygon points={hex(1210, 405, 68)} fill="#250B15" stroke={R} strokeWidth="2" filter="url(#glowHard)" />
        <path d="M1194 389l32 32m0-32-32 32" stroke="#FDA4AF" strokeWidth="3" />
        <text x="1210" y="450" textAnchor="middle" fill={R} fontFamily={MONO} fontSize="9" letterSpacing="2">REJECTED</text>
      </g>
      <circle className="quarantine-ripple" cx="610" cy="655" r="20" fill="none" stroke={R} opacity="0" />
      <circle className="stamp-ripple" cx="1210" cy="405" r="68" fill="none" stroke={E} strokeWidth="2" opacity="0" />
      <g className="intent-capsule" opacity="0" filter="url(#glowHard)">
        <polygon points={hex(310, 405, 24)} fill="#092B3D" stroke={C} strokeWidth="2" />
        <polygon points={hex(310, 405, 15)} fill={C} fillOpacity="0.18" stroke="#B7EBFF" strokeWidth="0.75" />
        <path d="M302 405h16M310 397v16" stroke="#E0F5FF" />
      </g>
      <g className="output-packet" opacity="0" filter="url(#glowHard)">
        <polygon points={hex(910, 405, 19)} fill="#07372D" stroke={E} strokeWidth="2" />
        <path d="M902 405l6 6 11-13" fill="none" stroke="#D1FAE5" strokeWidth="2" />
      </g>

      {/* Footer */}
      <g fontFamily={MONO} fontSize={10} letterSpacing={2}>
        <line x1="64" y1="746" x2="1376" y2="746" stroke="#9FB4CC" strokeOpacity="0.08" />
        <text x="64" y="770" fill={DIM}>INTENT IN</text>
        <g>
          <circle cx="560" cy="767" r="3" fill={C} />
          <text x="570" y="770" fill={DIM}>ACTIVE INTENT</text>
          <circle cx="700" cy="767" r="3" fill={A} />
          <text x="710" y="770" fill={DIM}>SCANNING</text>
          <circle cx="812" cy="767" r="3" fill={R} />
          <text x="822" y="770" fill={DIM}>BLOCKED</text>
          <circle cx="918" cy="767" r="3" fill={E} />
          <text x="928" y="770" fill={DIM}>VERIFIED</text>
        </g>
        <text x="1376" y="770" textAnchor="end" fill={DIM}>EVIDENCE OUT</text>
      </g>

      <rect width="1440" height="810" fill="url(#vignette)" pointerEvents="none" />
    </svg>
  );
}

// Scrubber updates must not rerender the SVG or disturb its GSAP transforms.
export default memo(Stage);
