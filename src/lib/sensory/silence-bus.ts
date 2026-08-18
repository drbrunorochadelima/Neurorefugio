/**
 * Barramento simples para o botão "Preciso de calma": qualquer reprodutor de
 * som/vídeo da plataforma pode assinar este evento para parar imediatamente,
 * sem precisar de acoplamento direto com o SensoryProvider.
 */
export type SilenceListener = () => void;

const listeners = new Set<SilenceListener>();

export function onSilenceRequest(listener: SilenceListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function requestSilence(): void {
  listeners.forEach((listener) => listener());
}
