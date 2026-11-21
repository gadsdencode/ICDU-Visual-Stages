# ICDU — AI Guided by Intent

Create a lightweight, frontend-only Vite + React + TypeScript + Tailwind CSS application (NO backend, NO database, NO shadcn/ui, NO dashboard layout).

- Objective: A full-bleed (100vw x 100vh, overflow: hidden), 60fps cinematic motion-graphics animation explaining ICDU (Intent-Conscious Data Unit — "AI Guided by Intent").
- Aesthetic: Deep obsidian `#05070B` background, subtle center radial spotlight, ultra-faint 40px technical grid, crisp keynote typography, and SVG `<filter>` glows.
- Palette: Cyan `#38BDF8` (Active Intent & Guardrails), Emerald `#10B981` (Verified & Audit Seal), Amber `#F59E0B` (Scanning), Crimson `#F43F5E` (Blocked).
- Fixed Responsive SVG Stage (`viewBox="0 0 1440 810"`, centered along `y=405`):
  - Top-Left (`x=64, y=64`): Subtle eyebrow `ICDU · INTENT-CONSCIOUS DATA UNIT` and dynamic Act headline.
  - Input Stream (`x=60` to `210`): Scattered raw prompt particles.
  - Station 1 — DEFINE (`cx=310, cy=405`): Focusing lens ring (`r=68`) with 3 concentric micro-arcs (`GOAL`, `RULES`, `CRITERIA`).
  - Station 2 — GATE (`cx=610, cy=405`): Vertical optical aperture (`height=180`) with laser scanline and top/bottom mechanical iris shutters, plus a dotted crimson deflection path curving down to a Quarantine node (`cx=610, cy=655`).
  - Station 3 — EXECUTE (`cx=910, cy=405`): Pulsing neural core (`r=64`, micro-label `ANY LLM • MODEL-AGNOSTIC`) flanked by heavy left/right geometric containment brackets.
  - Station 4 — AUDIT (`cx=1210, cy=405`): Hexagonal Evidence Seal receiver (`r=68`) with checkmark and micro-hash line.
  - Overhead Lineage Arc: Thin Bezier curve arcing above the pipeline from DEFINE (`310, 315`) and GATE (`610, 315`) directly into AUDIT (`1210, 315`).

## First pass

Build ONLY the static, full-bleed dark-mode SVG stage with all 4 stations, the Quarantine node, the Overhead Lineage Arc, and SVG glow filters. Do NOT add animations or bottom controls yet—focus 100% on visual craft, spacing, lighting, and keynote typography.

## Compliant (Pass) flow — second pass

The static-only restriction above applied to the first pass. Auto-play a smooth, continuously looping 14-second GSAP master timeline:

1. DEFINE (0–3.5s): 16 chaotic raw-prompt particles converge into a glowing cyan hexagonal Intent Capsule; GOAL, RULES, and CRITERIA rings snap into place.
2. GATE (3.5–7s): Capsule pauses for an amber vertical laser sweep; beam turns emerald, iris shutters open, and capsule accelerates forward.
3. EXECUTE (7–10.5s): Capsule enters the model core, cyan brackets clamp inward, core pulses, and internal energy arcs circulate.
4. AUDIT (10.5–14s): Output and synchronized pulses along both lineage arcs converge at AUDIT, forging an emerald seal with a stamp ripple.

Cross-fade the top-left Act headline at every phase. Remain frontend-only with no bottom controls.
