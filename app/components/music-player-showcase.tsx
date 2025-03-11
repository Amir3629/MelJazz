"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Play, Pause } from "lucide-react";
import Image from "next/image";

const defaultTracks = [
  {
    id: 1,
    title: "Jazz Performance",
    description: "Live at B-Flat Jazz Club Berlin",
    coverImage: "/images/performances/jazz-performance.jpg"
  },
  {
    id: 2,
    title: "Vocal Workshop",
    description: "Complete Vocal Technique Demonstration",
    coverImage: "/images/performances/vocal-workshop.jpg"
  },
  {
    id: 3,
    title: "Jazz Standards",
    description: "Live Performance Highlights",
    coverImage: "/images/performances/jazz-standards.jpg"
  },
  {
    id: 4,
    title: "Vocal Jazz",
    description: "Studio Session",
    coverImage: "/images/performances/vocal-jazz.jpg"
  }
];

export default function MusicPlayerShowcase() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="music" className="min-h-screen bg-[#040202] py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif text-white text-center mb-20">
          Meine Musik
          <div className="w-24 h-0.5 bg-[#C8A97E] mx-auto mt-4"></div>
        </h1>

        {/* Main Player */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 backdrop-blur-sm border border-white/10">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-2xl font-medium mb-2">{defaultTracks[currentTrackIndex].title}</h2>
              <p className="text-[#C8A97E] text-sm mb-8">{defaultTracks[currentTrackIndex].description}</p>
              
              {/* Circular Play Button with Rotating Border */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#C8A97E]/30"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="relative w-16 h-16 rounded-full bg-[#C8A97E] flex items-center justify-center text-black hover:bg-[#B69A6E] transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </button>
              </div>

              {/* Volume Control */}
              <button className="absolute bottom-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Volume2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Track Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {defaultTracks.map((track, index) => (
            <motion.button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`relative aspect-video rounded-xl overflow-hidden group ${
                currentTrackIndex === index ? "ring-2 ring-[#C8A97E]" : ""
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src={track.coverImage}
                alt={track.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="text-white font-medium mb-1">{track.title}</h3>
                <p className="text-gray-300 text-sm">{track.description}</p>
              </div>
              {currentTrackIndex === index && isPlaying && (
                <div className="absolute top-4 right-4 flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-3 bg-[#C8A97E] rounded-full"
                      animate={{
                        height: [12, 16, 12],
                        transition: {
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
