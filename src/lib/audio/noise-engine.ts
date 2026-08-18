export type NoiseType = "chuva" | "ondas" | "ventilador" | "ruido_marrom";

function createNoiseBuffer(ctx: AudioContext, seconds: number, colored: "white" | "brown"): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (colored === "white") {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  } else {
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
  }
  return buffer;
}

/**
 * Sons contínuos sintetizados no navegador (sem arquivos de áudio externos):
 * chuva, ondas, ventilador e ruído marrom. Sempre iniciados por ação
 * explícita do usuário — nunca em autoplay — e interrompidos imediatamente
 * pelo barramento de silêncio (botão "Preciso de calma").
 */
export class NoiseEngine {
  private ctx: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;
  private masterGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  isPlaying(): boolean {
    return this.source !== null;
  }

  start(type: NoiseType, volume: number): void {
    this.stop();
    const ctx = this.getContext();
    if (ctx.state === "suspended") ctx.resume();

    const buffer = createNoiseBuffer(ctx, 4, type === "ruido_marrom" || type === "ondas" ? "brown" : "white");
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;

    let node: AudioNode = source;

    if (type === "chuva") {
      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 900;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 6500;
      node.connect(highpass);
      highpass.connect(lowpass);
      node = lowpass;
    } else if (type === "ventilador") {
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 300;
      bandpass.Q.value = 0.7;
      node.connect(bandpass);
      node = bandpass;
    } else if (type === "ondas") {
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 700;
      node.connect(lowpass);
      node = lowpass;

      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.7;
      node.connect(waveGain);
      node = waveGain;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.3;
      lfo.connect(lfoGain);
      lfoGain.connect(waveGain.gain);
      lfo.start();
      this.lfo = lfo;
    } else {
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 2200;
      node.connect(lowpass);
      node = lowpass;
    }

    node.connect(masterGain);
    masterGain.connect(ctx.destination);
    source.start();

    this.source = source;
    this.masterGain = masterGain;
  }

  setVolume(volume: number): void {
    if (this.masterGain) this.masterGain.gain.value = volume;
  }

  stop(): void {
    if (this.source) {
      try {
        this.source.stop();
      } catch {
        // já parado
      }
      this.source.disconnect();
      this.source = null;
    }
    if (this.lfo) {
      try {
        this.lfo.stop();
      } catch {
        // já parado
      }
      this.lfo.disconnect();
      this.lfo = null;
    }
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
  }
}
