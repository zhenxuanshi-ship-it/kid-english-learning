let cachedVoices: SpeechSynthesisVoice[] = [];

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (cachedVoices.length > 0) {
      resolve(cachedVoices);
      return;
    }
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const onVoicesChanged = () => {
      cachedVoices = window.speechSynthesis!.getVoices();
      window.speechSynthesis!.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    // Some browsers fire voiceschanged synchronously on first call
    const initial = window.speechSynthesis.getVoices();
    if (initial.length > 0) {
      cachedVoices = initial;
      resolve(cachedVoices);
    }
  });
}

// Voice quality tiers — higher index = more natural-sounding
// macOS: Alex (natural) > Samantha > Karen > default
// Windows: David > Zira > default
// Prefer voices with explicit quality signals in the name
const VOICE_PREFERENCE = [
  'Alex',
  'Samantha',
  'Karen',
  'Moira',
  'Tessa',
  'Fiona',
  'Serena',
  'Daniel',
  'Google UK English Female',
  'Google UK English Male',
  'Google US English',
  'Microsoft Zira',
  'Microsoft David',
];

export function speakWord(text: string, enabled = true, rate = 0.95): void {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const voice = pickBestVoice(cachedVoices);
  if (voice) {
    utterance.voice = voice;
  } else {
    // No voices cached yet — load async and retry immediately with cached
    loadVoices().then((voices) => {
      const best = pickBestVoice(voices);
      if (best) {
        utterance.voice = best;
      }
      synth.speak(utterance);
    });
    return;
  }

  synth.speak(utterance);
}

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;

  // 1. Exact match on preferred names
  for (const name of VOICE_PREFERENCE) {
    const match = voices.find((v) => v.name === name || v.localService);
    if (match) return match;
  }

  // 2. Partial match (preferred name contains)
  for (const name of VOICE_PREFERENCE) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }

  // 3. Prefer local (offline) voices over remote
  const local = voices.find((v) => v.localService);
  if (local) return local;

  // 4. Any English voice
  return voices.find((v) => v.lang.toLowerCase().startsWith('en')) ?? voices[0];
}

export function playSuccessTone(enabled = true): void {
  if (!enabled || typeof window === 'undefined') return;
  const AudioContextRef =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
  const AudioContextRef =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
