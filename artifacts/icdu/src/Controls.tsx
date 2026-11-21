import type { Scenario } from './passTimeline';

type Props = {
  playing: boolean;
  time: number;
  scenario: Scenario;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onScenario: (scenario: Scenario) => void;
  onHide: () => void;
};

export default function Controls({ playing, time, scenario, onPlayPause, onSeek, onScenario, onHide }: Props) {
  const chapter = Math.min(3, Math.floor(time / 3.5));
  return (
    <section className="playback-pill backdrop-blur-md" aria-label="Animation controls">
      <button className="playback-button" onClick={onPlayPause} aria-label={playing ? 'Pause animation' : 'Play animation'} title={playing ? 'Pause' : 'Play'}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M4 3h3v10H4zm5 0h3v10H9z" /> : <path d="M4 2l10 6-10 6z" />}
        </svg>
      </button>
      <div className="chapter-control">
        <div className="chapter-labels">
          {['Define', 'Gate', 'Execute', 'Audit'].map((label, i) => (
            <button key={label} onClick={() => onSeek(i * 3.5)} aria-current={chapter === i ? 'step' : undefined}>
              <span>0{i + 1}</span> {label}
            </button>
          ))}
        </div>
        <input
          className="chapter-scrubber"
          type="range" min="0" max="14" step="0.01" value={time}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Timeline position"
          aria-valuetext={`${time.toFixed(1)} seconds, ${['Define', 'Gate', 'Execute', 'Audit'][chapter]}${scenario === 'block' && chapter === 2 ? ', execution skipped' : ''}`}
          style={{ background: `linear-gradient(to right, ${scenario === 'block' ? '#F43F5E' : '#38BDF8'} ${time / 14 * 100}%, #ffffff20 ${time / 14 * 100}%)` }}
        />
      </div>
      <div className="scenario-control" role="group" aria-label="Scenario">
        <button aria-pressed={scenario === 'pass'} onClick={() => onScenario('pass')}>Compliant (Pass)</button>
        <button aria-pressed={scenario === 'block'} onClick={() => onScenario('block')}>Violation (Block)</button>
      </div>
      <button className="hide-ui-button" onClick={onHide} aria-keyshortcuts="H" title="Hide controls for recording. Press H again to restore.">Hide UI <span>(H)</span></button>
    </section>
  );
}
