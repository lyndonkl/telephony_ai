import { useEffect, useRef, useState } from 'react';
import { VolumeX, Volume2 } from "lucide-react";

interface AudioSynthesizerProps {
  heartRate: number;
  isEnabled: boolean;
}

export function AudioSynthesizer({ heartRate, isEnabled }: AudioSynthesizerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    return () => {
      // Cleanup
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isEnabled || isMuted || !audioContextRef.current || heartRate === 0) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      return;
    }

    // Create and configure oscillator
    if (!oscillatorRef.current) {
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.connect(gainNodeRef.current!);
      oscillatorRef.current.start();
    }

    // Update frequency based on heart rate
    const baseFrequency = 440; // A4 note
    const frequency = baseFrequency + (heartRate - 60) * 2;
    oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);

    // Set volume based on heart rate
    const volume = Math.min(0.1 + (heartRate - 60) * 0.001, 0.3);
    gainNodeRef.current!.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
  }, [heartRate, isEnabled, isMuted]);

  return (
    <div className="flex items-center gap-4">
      <button
        className={`btn ${isMuted ? 'btn-outline' : 'btn-primary'}`}
        onClick={() => setIsMuted(!isMuted)}
        disabled={!isEnabled}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        {isMuted ? 'Unmute' : 'Mute'} Audio
      </button>
      <p className="text-sm opacity-70">
        {isEnabled 
          ? isMuted 
            ? "Audio feedback is muted" 
            : "Audio pitch and volume change with heart rate"
          : "Connect to a device to enable audio feedback"}
      </p>
    </div>
  );
} 