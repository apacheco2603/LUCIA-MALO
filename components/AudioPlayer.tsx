"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AudioPlayerProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function AudioPlayer({ isPlaying, togglePlay }: AudioPlayerProps) {
  const { t } = useLanguage();
  const playerRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const videoId = "bpZLiq0VwR0";

  useEffect(() => {
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        playerRef.current = new window.YT.Player("youtube-audio-player", {
          height: "0",
          width: "0",
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: videoId,
            controls: 0,
            showinfo: 0,
            autohide: 1,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              setIsApiReady(true);
              // Set volume to medium-low (30%)
              event.target.setVolume(30);
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              // If video ends, loop continuously
              if (event.data === window.YT?.PlayerState?.ENDED) {
                event.target.playVideo();
              }
            },
          },
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Handle play / pause / volume when isPlaying prop changes
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === "function") {
      if (isPlaying) {
        playerRef.current.setVolume(30);
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, isApiReady]);

  // First user interaction auto-start audio if browser blocked initial autoplay
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (playerRef.current && typeof playerRef.current.playVideo === "function") {
          playerRef.current.setVolume(30);
          if (isPlaying) {
            playerRef.current.playVideo();
          }
        }
      }
    };

    window.addEventListener("click", handleFirstUserInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstUserInteraction, { once: true });
    window.addEventListener("scroll", handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
      window.removeEventListener("scroll", handleFirstUserInteraction);
    };
  }, [hasInteracted, isPlaying]);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Hidden YouTube iframe container */}
      <div className="hidden" aria-hidden="true">
        <div id="youtube-audio-player" />
      </div>

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
            <Volume2 className="w-5 h-5" />
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
