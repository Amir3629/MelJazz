"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

const tracks = [
  {
    id: 1,
    title: "Vocal Jazz",
    description: "Studio Session",
    youtubeId: "hFdMHvB6-Jk"
  },
  {
    id: 2,
    title: "Jazz Ensemble",
    description: "Live Performance",
    youtubeId: "ZvWZr6TNh9Y"
  },
  {
    id: 3,
    title: "Jazz Collection",
    description: "Selected Performances",
    youtubeId: "r58-5DBfMpY"
  },
  {
    id: 4,
    title: "Jazz Highlights",
    description: "Best Moments",
    youtubeId: "0zARqh3xwnw"
  },
  {
    id: 5,
    title: "Vocal Workshop",
    description: "Complete Vocal Technique",
    youtubeId: "AWsarzdZ1u8"
  },
  {
    id: 6,
    title: "Jazz Standards",
    description: "Live Performance Collection",
    youtubeId: "GidIMbCmtyk"
  },
  {
    id: 7,
    title: "Special Performance",
    description: "Live Jazz Session",
    youtubeId: "QgZKO_f5FlM"
  }
];

declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicPlayerShowcase() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const playerRef = useRef<any>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsAPIReady(true);
      };
    } else {
      setIsAPIReady(true);
    }

    // Rotation animation
    let animationFrame: number;
    const animate = () => {
      if (isPlaying) {
        setRotation(prev => (prev + 0.5) % 360);
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animate();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isAPIReady && !playerRef.current) {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: tracks[currentTrack].youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          }
        }
      });
    }
  }, [isAPIReady, currentTrack]);

  const handlePrevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    if (playerRef.current) {
      playerRef.current.loadVideoById(tracks[(currentTrack - 1 + tracks.length) % tracks.length].youtubeId);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    if (playerRef.current) {
      playerRef.current.loadVideoById(tracks[(currentTrack + 1) % tracks.length].youtubeId);
    }
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="min-h-screen bg-black py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-serif text-white text-center mb-20">
          Meine Musik
          <div className="w-24 h-0.5 bg-[#C8A97E] mx-auto mt-4"></div>
        </h1>

        <div id="youtube-player" className="hidden"></div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Disc Display */}
          <div className="relative aspect-square w-full max-w-xl mx-auto mb-12">
            <motion.div
              className="absolute inset-0"
              style={{ rotate: `${rotation}deg` }}
            >
              <div className="relative w-full h-full">
                {/* Vinyl Record Design */}
                <div className="absolute inset-0 rounded-full bg-[#1a1a1a] border-4 border-[#C8A97E]/20">
                  <div className="absolute inset-[15%] rounded-full border border-[#C8A97E]/10"
                    style={{
                      background: "repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(200,169,126,0.1) 3px, transparent 4px)"
                    }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[20%] rounded-full bg-[#C8A97E]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/images/youtube-icon.png"
                        alt="YouTube"
                        width={40}
                        height={40}
                        className="opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Control Buttons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevTrack}
                className="p-3 rounded-full bg-[#C8A97E] text-black"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="p-4 rounded-full bg-[#C8A97E] text-black"
              >
                {isPlaying ? (
                  <div className="w-6 h-6 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-8 bg-black rounded-full" />
                      <div className="w-2 h-8 bg-black rounded-full ml-3" />
                    </div>
                  </div>
                ) : (
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-black ml-1" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextTrack}
                className="p-3 rounded-full bg-[#C8A97E] text-black"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className="p-3 rounded-full bg-[#C8A97E] text-black"
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Track Title */}
          <motion.div
            key={tracks[currentTrack].title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-serif text-[#C8A97E] mb-2">{tracks[currentTrack].title}</h2>
            <p className="text-gray-400">{tracks[currentTrack].description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
