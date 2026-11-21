import Stage from './Stage';
import { useCallback, useRef, useState } from 'react';
import type gsap from 'gsap';
import type { Scenario } from './passTimeline';
import Controls from './Controls';

function App() {
  const [scenario, setScenario] = useState<Scenario>('pass');
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const playingRef = useRef(true);
  const onTime = useCallback((value: number) => setTime(Math.round(value * 20) / 20), []);
  const onReady = useCallback((value: gsap.core.Timeline | null) => {
    timeline.current = value;
    if (value) {
      value.paused(!playingRef.current);
      setTime(0);
    }
  }, []);
  function togglePlayback() {
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
    timeline.current?.paused(!playingRef.current);
  }
  function seek(value: number) {
    // Keep pause/play state and explicitly render timeline callbacks on seeking.
    const next = Math.min(13.999, Math.max(0, value));
    timeline.current?.time(next, false);
    setTime(next);
  }
  return (
    <main className="grain relative flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-[#05070B]">
      <Stage scenario={scenario} onReady={onReady} onTime={onTime} />
      <Controls playing={playing} time={time} scenario={scenario} onPlayPause={togglePlayback} onSeek={seek} onScenario={setScenario} />
    </main>
  );
}

export default App;
