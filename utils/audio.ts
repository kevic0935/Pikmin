
export type AlertType = 'warning60' | 'warning30' | 'warning10';

export const playSound = (type: AlertType) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioCtx = new AudioContextClass();
    
    const playNote = (freq: number, duration: number, startTime = 0, volume = 0.4) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'triangle'; 
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
      
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime + startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime + startTime);
      oscillator.stop(audioCtx.currentTime + startTime + duration);
    };

    if (type === 'warning60') {
      // Gentle long chime for 1 minute
      playNote(440, 0.8); // A4
    } else if (type === 'warning30') {
      // Double pleasant chime for 30 seconds
      playNote(523.25, 0.4); // C5
      playNote(659.25, 0.4, 0.2); // E5
    } else if (type === 'warning10') {
      // Triple urgent high beeps for 10 seconds
      playNote(880, 0.1, 0, 0.5); // A5
      playNote(880, 0.1, 0.15, 0.5);
      playNote(880, 0.1, 0.3, 0.5);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};
