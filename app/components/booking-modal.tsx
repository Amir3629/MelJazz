"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, addMonths, subMonths, isSameDay, isBefore, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, isEqual } from "date-fns"
import { de } from "date-fns/locale"
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react"
import { z } from "zod"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TimeSlot {
  time: string
  available: boolean
}

interface Service {
  id: string;
  title: string;
  duration: string;
  description: string;
}

const services: Service[] = [
  {
    id: "einzelunterricht",
    title: "Einzelunterricht",
    duration: "60 min",
    description: "Individueller Gesangsunterricht"
  },
  {
    id: "gruppenunterricht",
    title: "Gruppenunterricht",
    duration: "90 min",
    description: "Lernen Sie in der Gruppe"
  },
  {
    id: "workshop",
    title: "Workshop",
    duration: "3 Stunden",
    description: "Intensives Gruppentraining"
  }
];

const skillLevels = [
  { id: "beginner", label: "Anfänger" },
  { id: "intermediate", label: "Fortgeschritten" },
  { id: "advanced", label: "Profi" }
]

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", 
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
]

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
    message: "",
    acceptTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentStep(2); // Automatically progress to next step
  };

  const validateEmail = (email: string) => {
    return z.string().email().safeParse(email).success
  }

  const handleNext = () => {
    if (currentStep === 1 && !selectedService) {
      setErrors({ service: "Bitte wählen Sie einen Service aus" })
      return
    }
    if (currentStep === 2 && !selectedDate) {
      setErrors({ date: "Bitte wählen Sie ein Datum aus" })
      return
    }
    if (currentStep === 3 && !selectedTime) {
      setErrors({ time: "Bitte wählen Sie eine Uhrzeit aus" })
      return
    }
    if (currentStep === 4) {
      const newErrors: Record<string, string> = {}
      if (!formData.name) newErrors.name = "Name ist erforderlich"
      if (!formData.email) newErrors.email = "Email ist erforderlich"
      if (!validateEmail(formData.email)) newErrors.email = "Ungültige Email-Adresse"
      if (!formData.level) newErrors.level = "Bitte wählen Sie Ihr Level aus"
      if (!formData.acceptTerms) newErrors.terms = "Bitte akzeptieren Sie die Bedingungen"
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
    }
    setErrors({})
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic here
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0A0A0A] rounded-xl shadow-xl overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Progress Bar */}
              <div className="relative h-1.5 bg-[#1A1A1A]">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-[#C8A97E]"
                  animate={{
                    width: `${(currentStep / 4) * 100}%`
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white text-center mb-6">
                      Wählen Sie Ihren Service
                    </h2>
                    <div className="grid gap-4">
                      {services.map((service) => (
                        <motion.button
                          key={service.id}
                          onClick={() => handleServiceSelect(service.id)}
                          className={`w-full p-4 rounded-lg border transition-all ${
                            selectedService === service.id
                              ? "border-[#C8A97E] bg-[#C8A97E]/10"
                              : "border-white/10 hover:border-[#C8A97E]/50"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-left">
                            <h3 className="text-white font-medium">{service.title}</h3>
                            <p className="text-sm text-gray-400">{service.duration} • {service.description}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white text-center mb-6">
                      Wählen Sie ein Datum
                    </h2>
                    <div className="bg-[#1A1A1A] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={prevMonth}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-[#C8A97E]" />
                        </button>
                        <h3 className="text-white font-medium">
                          {format(currentDate, "MMMM yyyy", { locale: de })}
                        </h3>
                        <button
                          onClick={nextMonth}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-[#C8A97E]" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                          <div key={day} className="text-center text-sm text-gray-400">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, idx) => {
                          const isToday = isSameDay(day, new Date());
                          const isSelected = selectedDate && isSameDay(day, selectedDate);
                          const isPast = isBefore(day, startOfToday());

                          return (
                            <button
                              key={idx}
                              onClick={() => handleDateSelect(day)}
                              disabled={isPast}
                              className={`
                                aspect-square rounded-lg flex items-center justify-center text-sm
                                ${isSelected ? "bg-[#C8A97E] text-black" : ""}
                                ${isToday ? "border border-[#C8A97E]" : ""}
                                ${isPast ? "text-gray-600" : "text-white hover:bg-white/5"}
                              `}
                            >
                              {format(day, "d")}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white text-center mb-6">
                      Wählen Sie eine Uhrzeit
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedTime === time
                              ? "border-[#C8A97E] bg-[#C8A97E]/10 text-white"
                              : "border-white/10 hover:border-[#C8A97E]/50 text-gray-400 hover:text-white"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                      Ihre Informationen
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#C8A97E]"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#C8A97E]"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Telefon (optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#C8A97E]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Level
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({ ...formData, level: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#C8A97E]"
                      >
                        <option value="">Bitte wählen</option>
                        {skillLevels.map((level) => (
                          <option key={level.id} value={level.id}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                      {errors.level && (
                        <p className="text-red-500 text-sm mt-1">{errors.level}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nachricht (optional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#C8A97E]"
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.acceptTerms}
                        onChange={(e) =>
                          setFormData({ ...formData, acceptTerms: e.target.checked })
                        }
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-300">
                        Ich akzeptiere die{" "}
                        <a
                          href="/legal/agb"
                          target="_blank"
                          className="text-[#C8A97E] hover:underline"
                        >
                          AGB
                        </a>{" "}
                        und{" "}
                        <a
                          href="/legal/datenschutz"
                          target="_blank"
                          className="text-[#C8A97E] hover:underline"
                        >
                          Datenschutzerklärung
                        </a>
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-red-500 text-sm">{errors.terms}</p>
                    )}
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#C8A97E]/20 mx-auto flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-[#C8A97E]" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      Buchung erfolgreich!
                    </h2>
                    <p className="text-gray-400">
                      Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details.
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      className="px-6 py-2 text-white hover:text-[#C8A97E] transition-colors"
                    >
                      Zurück
                    </button>
                  )}
                  <div className="flex-1" />
                  {currentStep < 4 ? (
                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-[#C8A97E] hover:bg-[#B69A6E] text-black rounded-lg transition-colors"
                    >
                      Weiter
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-[#C8A97E] hover:bg-[#B69A6E] text-black rounded-lg transition-colors"
                    >
                      Buchung abschließen
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
} 