"use client"

import { type ReactNode } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface ServiceCardProps {
  title: string
  description: string
  icon: ReactNode
  price: string
  features: string[]
  details: {
    includes: string[]
    suitable: string[]
    duration: string
    location: string
  }
  image: string
  delay?: number
}

export default function ServiceCard({ title, description, icon, price, features, details, image, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative h-[400px] perspective-1000"
    >
      <div
        className="relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer hover:rotate-y-180"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-black/40 backdrop-blur-md border border-white/5 hover:border-[#C8A97E]/20 transition-all duration-500"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-all duration-700 scale-110 blur-[2px] group-hover:blur-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
          </div>
          <div className="relative p-6 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-[#C8A97E]/20 backdrop-blur-md">
                {icon}
              </div>
              <span className="text-lg font-semibold text-[#C8A97E]">{price}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-gray-300 mb-4">{description}</p>
            <ul className="space-y-2 flex-grow">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-300">
                  <span className="mr-2 text-[#C8A97E]">•</span>
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[#C8A97E] mt-4">Hover für mehr Details</p>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-[#0A0A0A] border border-[#C8A97E]/20 p-6 flex flex-col rotate-y-180"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <h3 className="text-xl font-bold text-[#C8A97E] mb-4">{title}</h3>
          <div className="space-y-6 flex-grow">
            <div>
              <h4 className="text-[#C8A97E] font-medium mb-2">Enthält:</h4>
              <ul className="space-y-2">
                {details.includes.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="mr-2 text-[#C8A97E]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#C8A97E] font-medium mb-2">Geeignet für:</h4>
              <ul className="space-y-2">
                {details.suitable.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="mr-2 text-[#C8A97E]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="text-[#C8A97E]">Dauer:</span> {details.duration}
              </p>
              <p className="text-gray-300">
                <span className="text-[#C8A97E]">Ort:</span> {details.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 