export function speakWord(text: string, enabled = true, rate = 0.92): void {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1.1;
  utterance.volume = 0.95;

  const voices = synth.getVoices();
  const preferred = voices.find((voice) => voice.lang.toLowerCase().startsWith('en'));
  if (preferred) utterance.voice = preferred;

  synth.speak(utterance);
}

export function playSuccessTone(enabled = true): void {
  if (!enabled || typeof window === 'undefined') return;
  const AudioContextRef = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextRef) return;

  const ctx = new AudioContextRef();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  const osc1 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(523.25, now);
  osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.18);
  osc1.connect(gain);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(659.25, now + 0.03);
  osc2.frequency.exponentialRampToValueAtTime(987.77, now + 0.28);
  osc2.connect(gain);

  osc1.start(now);
  osc2.start(now + 0.03);
  osc1.stop(now + 0.28);
  osc2.stop(now + 0.35);

  window.setTimeout(() => {
    void ctx.close();
  }, 500);
}

export function playErrorTone(enabled = true): void {
  if (!enabled || typeof window === 'undefined') return;
  const AudioContextRef = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextRef) return;

  const ctx = new AudioContextRef();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(210, now + 0.18);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + 0.2);

  window.setTimeout(() => {
    void ctx.close();
  }, 400);
}
