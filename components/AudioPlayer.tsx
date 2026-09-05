"use client";

import { useRef, useEffect } from "react";
import { Music, Volume2, VolumeX, Pause, Play } from "lucide-react";

interface AudioPlayerProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

export default function AudioPlayer({ isPlaying, togglePlay }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Royalty-free acoustic wedding ambient music URL
  const audioSrc = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-113589.mp3";

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay blocked by browser policy until user interaction");
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />

      <button
        onClick={togglePlay}
        className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 border ${
          isPlaying
            ? "bg-gold-500 text-white border-gold-400 shadow-gold-500/40 animate-pulse"
            : "glass-panel-dark text-white border-gold-500/30 hover:bg-gold-500"
        }`}
        title={isPlaying ? "Silenciar Música" : "Reproducir Música de Fondo"}
      >
        <div className="relative">
          {isPlaying ? (
            <Volume2 className="w-5 h-5 animate-spin" />
          ) : (
            <VolumeX className="w-5 h-5 opacity-70" />
          )}
        </div>
        <span className="text-xs font-semibold tracking-wider uppercase pr-1">
          {isPlaying ? "Música Sonando" : "Música Ambiente"}
        </span>
      </button>
    </div>
  );
}
