"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicPlayerProps {
  musicUrl: string;
  /** Warna aksen tombol (default: emerald) */
  accentColor?: string;
  /** Teks dark mode untuk kontras */
  dark?: boolean;
}

/**
 * MusicPlayer — floating mini player pojok kanan bawah.
 * Mendukung:
 * - Direct mp3 / ogg URL
 * - YouTube embed URL (akan ditampilkan dalam hidden iframe autoplay)
 * Browser policy: autoplay baru jalan setelah interaksi pertama user.
 */
export default function MusicPlayer({ musicUrl, accentColor = "#10b981", dark = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const isYoutube = /youtube\.com|youtu\.be/.test(musicUrl);
  const isDirectAudio = /\.(mp3|ogg|wav|aac|flac|m4a)(\?|$)/i.test(musicUrl);

  // Extract YouTube video ID from any youtube URL form
  const ytId = (() => {
    if (!isYoutube) return null;
    const m =
      musicUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
      musicUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
      musicUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/) ||
      musicUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    return m?.[1] ?? null;
  })();
  const ytEmbedSrc = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3`
    : null;

  // Init audio for direct URL
  useEffect(() => {
    if (!isYoutube && musicUrl) {
      const audio = new Audio(musicUrl);
      audio.loop = true;
      audio.volume = volume;
      audioRef.current = audio;

      audio.addEventListener("canplaythrough", () => setReady(true));
      audio.addEventListener("timeupdate", () => {
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
      });

      return () => {
        audio.pause();
        audio.src = "";
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicUrl]);

  // Autoplay on first user gesture (browser policy workaround)
  useEffect(() => {
    if (!musicUrl || playing) return;
    const trigger = () => {
      if (isYoutube) {
        setPlaying(true);
      } else if (audioRef.current) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", trigger);
      window.removeEventListener("keydown", trigger);
      window.removeEventListener("touchstart", trigger);
      window.removeEventListener("scroll", trigger);
    };
    window.addEventListener("pointerdown", trigger, { once: true });
    window.addEventListener("keydown", trigger, { once: true });
    window.addEventListener("touchstart", trigger, { once: true });
    window.addEventListener("scroll", trigger, { once: true });
    return cleanup;
  }, [musicUrl, isYoutube, playing]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current && !isYoutube) return;
    if (isYoutube) {
      setPlaying((p) => !p);
      return;
    }
    const audio = audioRef.current!;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, isYoutube]);

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  // Seek (direct audio)
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseFloat(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
    }
    setProgress(pct);
  };

  if (!musicUrl) return null;

  const bg = dark ? "bg-slate-800/90 text-white border-white/10" : "bg-white/90 text-slate-900 border-slate-200";
  const iconColor = accentColor;

  return (
    <>
      {/* Hidden YouTube iframe — only mounted when playing (forces re-fetch w/ autoplay) */}
      {isYoutube && playing && ytEmbedSrc && (
        <iframe
          key={`yt-${playing}`}
          title="bg-music"
          className="fixed bottom-0 right-0 pointer-events-none"
          style={{ width: 1, height: 1, opacity: 0 }}
          src={ytEmbedSrc}
          allow="autoplay; encrypted-media"
        />
      )}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="music-player"
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 rounded-2xl border shadow-2xl backdrop-blur-md p-4 w-56 ${bg}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Animated music note */}
                <motion.span
                  animate={playing ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="material-symbols-outlined text-xl"
                  style={{ color: iconColor }}
                >
                  music_note
                </motion.span>
                <span className="text-xs font-bold truncate max-w-[100px]">
                  {isYoutube ? "🎵 Musik Latar" : isDirectAudio ? "🎵 Musik Latar" : "🎵 Musik"}
                </span>
              </div>
              <button
                onClick={() => setVisible(false)}
                className="text-xs opacity-50 hover:opacity-100 transition leading-none"
              >
                <span className="material-symbols-outlined text-base leading-none">close</span>
              </button>
            </div>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              disabled={!isYoutube && !ready}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
              style={{ backgroundColor: iconColor }}
            >
              <span className="material-symbols-outlined text-lg leading-none">
                {playing ? "pause" : "play_arrow"}
              </span>
              {playing ? "Pause" : (!isYoutube && !ready ? "Memuat..." : "Putar")}
            </button>

            {/* Progress bar (direct audio only) */}
            {!isYoutube && ready && (
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={handleSeek}
                className="w-full accent-current h-1 cursor-pointer"
                style={{ accentColor: iconColor }}
              />
            )}

            {/* Volume */}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm opacity-50" style={{ color: iconColor }}>
                {volume === 0 ? "volume_mute" : volume < 0.5 ? "volume_down" : "volume_up"}
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={handleVolume}
                className="flex-1 h-1 cursor-pointer"
                style={{ accentColor: iconColor }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restore button ketika di-close */}
      {!visible && (
        <motion.button
          key="restore-btn"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setVisible(true)}
          className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full shadow-xl text-white"
          style={{ backgroundColor: iconColor }}
        >
          <span className="material-symbols-outlined">music_note</span>
        </motion.button>
      )}
    </>
  );
}
