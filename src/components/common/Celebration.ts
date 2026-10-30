import confetti from 'canvas-confetti';

export function fireConfetti(): void {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
    });
  } catch {
    // Graceful fallback if canvas-confetti fails
  }
}
