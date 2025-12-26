
export type AlertType = 'warning20' | 'warning10';

export const playSound = (type: AlertType) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioCtx = new AudioContextClass();
    
    const playNote = (freq: number, duration: number, startTime = 0) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      // Pikmin style sounds usually have a clean, triangle or sine wave feel
      oscillator.type = 'triangle'; 
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
      
      const maxVolume = 0.4;
      gainNode.gain.setValueAtTime(maxVolume, audioCtx.currentTime + startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime + startTime);
      oscillator.stop(audioCtx.currentTime + startTime + duration);
    };

    if (type === 'warning20') {
      // Single medium pitch tone
      playNote(523.25, 0.6); // C5
    } else if (type === 'warning10') {
      // Double high pitch beep
      playNote(987.77, 0.15); // B5
      playNote(987.77, 0.15, 0.25);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};
