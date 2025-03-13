﻿"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface ServiceCardProps {
  title: string
  subtitle: string
  description: string
  features: string[]
  details?: {
    duration?: string
    location?: string
    includes?: string[]
    suitable?: string[]
  }
  image?: string
  icon?: React.ReactNode
  delay?: number
  link?: string
}

export default function ServiceCard({
  title,
  subtitle,
  description,
  features,
  details,
  image,
  icon,
  delay = 0,
  link
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={`group relative w-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden 
        ${isHovered ? 'min-h-[520px]' : 'min-h-[320px]'} 
        transition-all duration-700 ease-[cubic-bezier(0.34\,1.56\,0.64\,1)]
        ${link ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ height: isHovered ? 'auto' : '320px' }}
    >
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover opacity-40 transition-all duration-700
              ${isHovered ? 'opacity-60 scale-105' : 'scale-100'}`}
            priority={delay === 0}
            loading={delay === 0 ? "eager" : "lazy"}
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        </div>
      )}

      <div className="relative p-6 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-4">
          {icon && (
            <motion.div
              className="text-[#C8A97E]"
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0
              }}
              transition={{ 
                duration: 1.2,
                scale: { type: 'spring', stiffness: 100 },
                rotate: { duration: 1.5, ease: 'easeInOut' }
              }}
            >
              {icon}
            </motion.div>
          )}
          <div>
            <h3 className="text-xl font-medium text-white">{title}</h3>
            <p className="text-sm text-[#C8A97E]/90 mt-1">{subtitle}</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-6">{description}</p>

        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + index * 0.1 }}
              className="flex items-center gap-2 text-white/90"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
              <span className="text-sm">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {details && (
          <motion.div 
            className="mt-auto space-y-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 'auto' : 0
            }}
            transition={{ 
              duration: 0.5,
              ease: 'easeInOut'
            }}
          >
            {details.includes && (
              <div>
                <h4 className="text-[#C8A97E] text-sm font-medium mb-2">
                  <span className="inline-flex items-center justify-center w-4 h-4 mr-1">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  {" "}Enthält
                </h4>
                <ul className="grid grid-cols-2 gap-2">
                  {details.includes.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="text-white/70 text-sm"
                    >
                      • {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            
            {details.suitable && (
              <div>
                <h4 className="text-[#C8A97E] text-sm font-medium mb-2">
                  <span className="inline-block">
                    👥
                  </span>
                  {" "}Geeignet für
                </h4>
                <ul className="grid grid-cols-2 gap-2">
                  {details.suitable.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="text-white/70 text-sm"
                    >
                      • {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              {details.duration && (
                <div>
                  <p className="text-[#C8A97E] text-xs mb-1">
                    <span className="inline-block">
                      ⏱️
                    </span>
                    {" "}Dauer
                  </p>
                  <p className="text-white/90 text-sm">{details.duration}</p>
                </div>
              )}
              {details.location && (
                <div>
                  <p className="text-[#C8A97E] text-xs mb-1">
                    <span className="inline-block">
                      📍
                    </span>
                    {" "}Ort
                  </p>
                  <p className="text-white/90 text-sm">{details.location}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
} 

