// Web Audio API Synthesizer for Phone Calls, Messages, and Stories

let audioCtx: AudioContext | null = null;
let ringOsc1: OscillatorNode | null = null;
let ringOsc2: OscillatorNode | null = null;
let ringGain: GainNode | null = null;
let ringInterval: number | null = null;
let ambientStoryNode: { stop: () => void } | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundEngine = {
  // Start outgoing ringtone (440Hz + 480Hz ringing pattern)
  startOutgoingRing() {
    try {
      this.stopRing();
      const ctx = getAudioContext();

      const playRingPulse = () => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(480, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + 1.6);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 1.8);
        osc2.stop(ctx.currentTime + 1.8);
      };

      playRingPulse();
      ringInterval = window.setInterval(playRingPulse, 3200);
    } catch {
      // Audio autoplay policy fallback
    }
  },

  // Stop any active ringing tone
  stopRing() {
    if (ringInterval) {
      clearInterval(ringInterval);
      ringInterval = null;
    }
    if (ringOsc1) {
      try { ringOsc1.stop(); } catch {}
      ringOsc1 = null;
    }
    if (ringOsc2) {
      try { ringOsc2.stop(); } catch {}
      ringOsc2 = null;
    }
    if (ringGain) {
      ringGain.disconnect();
      ringGain = null;
    }
  },

  // Call connected sound
  playCallConnected() {
    this.stopRing();
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } catch {}
  },

  // Call end sound
  playCallEnded() {
    this.stopRing();
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const notes = [440, 415.3, 392]; // descending drop
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.12, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.2);
      });
    } catch {}
  },

  // Message sent sound
  playMessageSent() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.09); // A5
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  },

  // Message received sound
  playMessageReceived() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const notes = [659.25, 880]; // E5 to A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.26);
      });
    } catch {}
  },

  // Reaction sound (pop)
  playReactionPop() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.06);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  },

  // Ambient story music generator (soothing ambient chord pad)
  playStoryAmbient(trackName: string = 'Aura Chill') {
    this.stopStoryAmbient();
    try {
      const ctx = getAudioContext();
      const gainMaster = ctx.createGain();
      gainMaster.gain.setValueAtTime(0.08, ctx.currentTime);
      gainMaster.connect(ctx.destination);

      // Choose chord based on track
      let baseFreqs = [261.63, 329.63, 392.00, 493.88]; // Cmaj7
      if (trackName.toLowerCase().includes('sunset')) {
        baseFreqs = [220.00, 261.63, 329.63, 392.00]; // Am7
      } else if (trackName.toLowerCase().includes('tokyo') || trackName.toLowerCase().includes('midnight')) {
        baseFreqs = [293.66, 349.23, 440.00, 523.25]; // Dm7
      }

      const oscs: OscillatorNode[] = [];
      baseFreqs.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Add subtle detune for warm chorus effect
        osc.detune.setValueAtTime((Math.random() - 0.5) * 12, ctx.currentTime);
        osc.connect(gainMaster);
        osc.start();
        oscs.push(osc);
      });

      ambientStoryNode = {
        stop() {
          gainMaster.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          setTimeout(() => {
            oscs.forEach(o => {
              try { o.stop(); } catch {}
            });
            gainMaster.disconnect();
          }, 600);
        }
      };
    } catch {}
  },

  stopStoryAmbient() {
    if (ambientStoryNode) {
      ambientStoryNode.stop();
      ambientStoryNode = null;
    }
  }
};
