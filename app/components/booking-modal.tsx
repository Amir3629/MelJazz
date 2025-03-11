"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, addMonths, subMonths, isSameDay, isBefore, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, isEqual } from "date-fns"
import { de } from "date-fns/locale"
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react"
import { z } from "zod"
import { Dialog } from "@/app/components/ui/dialog"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { cn } from "@/lib/utils"
import SuccessMessage from "./success-message"
import LegalDocumentModal from "./legal-document-modal"
import LegalContent from "./legal-content"
import CustomAlert from "./custom-alert"
import { Calendar } from "./ui/calendar"

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
  types?: ServiceType[];
}

interface ServiceType {
  id: string;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    id: "singen",
    title: "Singen",
    duration: "60 min",
    description: "Professioneller Gesangsunterricht",
    types: [
      {
        id: "private",
        title: "Einzelunterricht",
        description: "Individuelles Training"
      },
      {
        id: "online",
        title: "Online Coaching",
        description: "Flexibel von zu Hause"
      },
      {
        id: "group",
        title: "Gruppenunterricht",
        description: "Lernen in der Gruppe"
      }
    ]
  },
  {
    id: "vocal-coaching",
    title: "Vocal Coaching",
    duration: "60 min",
    description: "CVT-basiertes Stimmtraining",
    types: [
      {
        id: "private",
        title: "Einzelunterricht",
        description: "Individuelles Training"
      },
      {
        id: "online",
        title: "Online Coaching",
        description: "Flexibel von zu Hause"
      },
      {
        id: "group",
    title: "Gruppenunterricht",
        description: "Lernen in der Gruppe"
      }
    ]
  },
  {
    id: "workshop",
    title: "Workshop",
    duration: "3 Stunden",
    description: "Intensives Gruppentraining"
  }
];

const skillLevels = [
  { id: "beginner", title: "Anfänger", description: "Erste Schritte in der Musik" },
  { id: "intermediate", title: "Fortgeschritten", description: "Grundlagen sind vorhanden" },
  { id: "advanced", title: "Profi", description: "Fortgeschrittene Techniken" }
];

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", 
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
]

type Step = "1" | "2" | "3" | "4"

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  termsAccepted: boolean;
}

const ServiceOption = ({ service, isSelected, onSelect }: { 
  service: Service, 
  isSelected: boolean, 
  onSelect: () => void 
}) => (
  <motion.div
    onClick={onSelect}
    className={`relative w-full p-6 rounded-lg border-2 transition-all overflow-hidden cursor-pointer ${
      isSelected 
        ? 'border-[#C8A97E] bg-[#C8A97E]/10 shadow-[0_0_15px_rgba(200,169,126,0.15)]' 
        : 'border-white/10 hover:border-[#C8A97E]/50 hover:bg-white/5 hover:shadow-[0_0_10px_rgba(200,169,126,0.1)]'
    }`}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <h3 className="text-xl font-medium text-white mb-2">{service.title}</h3>
    <p className="text-base text-[#C8A97E] mb-2">{service.duration}</p>
    <p className="text-sm text-gray-300">{service.description}</p>
    {isSelected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#C8A97E] flex items-center justify-center"
      >
        <Check className="w-4 h-4 text-black" />
      </motion.div>
    )}
  </motion.div>
)

const TimeGrid = ({ times, selectedTime, onTimeSelect }: { 
  times: string[], 
  selectedTime: string | null,
  onTimeSelect: (time: string) => void 
}) => (
  <div className="bg-[#0A0A0A] rounded-lg border-2 border-[#C8A97E]/20 p-6">
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {times.map((time) => (
        <motion.button
          key={time}
          onClick={() => onTimeSelect(time)}
          className={`p-3 rounded-lg text-base border-2 transition-all ${
            selectedTime === time
              ? 'border-[#C8A97E] bg-[#C8A97E]/10 text-white shadow-[0_0_15px_rgba(200,169,126,0.15)]'
              : 'border-white/10 text-gray-400 hover:border-[#C8A97E]/50 hover:bg-white/5 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {time}
        </motion.button>
      ))}
    </div>
  </div>
)

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("1")
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedServiceType, setSelectedServiceType] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [showLegalModal, setShowLegalModal] = useState<"agb" | "datenschutz" | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    termsAccepted: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [date, setDate] = useState<Date>()

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    if (service?.types) {
      setCurrentStep("2");
    } else {
      setCurrentStep("3");
    }
  };

  const handleServiceTypeSelect = (typeId: string) => {
    setSelectedServiceType(typeId);
    setCurrentStep("3");
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentStep("3");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep("4");
  };

  const handleLevelSelect = (levelId: string) => {
    setSelectedLevel(levelId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      setErrors({ terms: "Bitte akzeptieren Sie die AGB und Datenschutzerklärung" });
      return;
    }

    try {
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        resetForm();
      }, 3000);
    } catch (error) {
      setErrors({ submit: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." });
    }
  };

  const resetForm = () => {
    setSelectedService("");
    setSelectedServiceType("");
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedLevel("");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        termsAccepted: false
    });
    setCurrentStep("1");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, value } = target;
    
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case "1":
        return selectedService !== "";
      case "2":
        return selectedDate !== null;
      case "3":
        return selectedTime !== "";
      case "4":
        return formData.name && formData.email && formData.phone && formData.termsAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceedToNextStep()) return;
    
    const nextStep = (parseInt(currentStep) + 1).toString() as Step;
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    const prevStep = (parseInt(currentStep) - 1).toString() as Step;
    setCurrentStep(prevStep);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-[#0A0A0A] rounded-xl border-2 border-[#C8A97E]/20 shadow-2xl w-[95%] max-w-3xl max-h-[90vh] overflow-hidden">
          <div className="p-8 border-b border-[#C8A97E]/20">
            <h2 className="text-2xl font-medium text-white">Termin buchen</h2>
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white/70 hover:text-white transition-colors" />
            </button>
          </div>

          <div className="p-8 max-h-[calc(85vh-200px)] overflow-y-auto custom-scrollbar">
            <div className="space-y-8">
              {/* Service Selection */}
              <div className={`space-y-6 ${currentStep === "1" ? "block" : "hidden"}`}>
                <h3 className="text-xl font-medium text-white mb-6">Service auswählen</h3>
                <div className="grid gap-6">
                  {services.map((service) => (
                    <ServiceOption
                      key={service.id}
                      service={service}
                      isSelected={selectedService === service.id}
                      onSelect={() => handleServiceSelect(service.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className={`space-y-6 ${currentStep === "2" ? "block" : "hidden"}`}>
                <h3 className="text-xl font-medium text-white mb-6">Datum auswählen</h3>
                <div className="bg-[#0A0A0A] rounded-lg border-2 border-[#C8A97E]/20 p-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date) => date && handleDateSelect(date)}
                    className="text-white"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-base font-medium text-[#C8A97E]",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-[#C8A97E]/20 rounded-lg transition-colors",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-[#C8A97E] rounded-md w-10 font-normal text-[0.9rem]",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#C8A97E]/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-[#C8A97E]/20 rounded-lg transition-colors",
                      day_selected: "bg-[#C8A97E] text-white hover:bg-[#C8A97E] hover:text-white focus:bg-[#C8A97E] focus:text-white",
                      day_today: "bg-white/5 text-white",
                      day_outside: "text-gray-500 opacity-50",
                      day_disabled: "text-gray-500 opacity-50",
                      day_range_middle: "aria-selected:bg-[#C8A97E]/20 aria-selected:text-white",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className={`space-y-6 ${currentStep === "3" ? "block" : "hidden"}`}>
                <h3 className="text-xl font-medium text-white mb-6">Uhrzeit auswählen</h3>
                <TimeGrid
                  times={timeSlots}
                  selectedTime={selectedTime}
                  onTimeSelect={handleTimeSelect}
                />
              </div>

              {/* Personal Information */}
              <div className={`space-y-6 ${currentStep === "4" ? "block" : "hidden"}`}>
                <h3 className="text-xl font-medium text-white mb-6">Persönliche Daten</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-base text-gray-300 mb-2 block">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A97E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-base text-gray-300 mb-2 block">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A97E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-base text-gray-300 mb-2 block">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A97E] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-base text-gray-300 mb-2 block">Nachricht (optional)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-white/5 border-2 border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C8A97E] transition-colors resize-none"
                    />
                  </div>
                  <div className="flex items-start gap-3 mt-6">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                      className="mt-1.5 h-4 w-4 rounded border-2 border-white/10 text-[#C8A97E] focus:ring-[#C8A97E]"
                      required
                    />
                    <label htmlFor="termsAccepted" className="text-base text-gray-300">
                      Ich akzeptiere die <button type="button" onClick={() => setShowLegalModal("agb")} className="text-[#C8A97E] hover:underline">AGB</button> und die <button type="button" onClick={() => setShowLegalModal("datenschutz")} className="text-[#C8A97E] hover:underline">Datenschutzerklärung</button>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-red-500 text-sm mt-2">{errors.terms}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-[#C8A97E]/20 flex justify-between">
            {currentStep !== "1" && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-2 border-white/10 text-white hover:bg-white/5 px-6 py-2.5 text-base"
              >
                Zurück
              </Button>
            )}
            <div className="ml-auto">
              <Button
                onClick={currentStep === "4" ? handleSubmit : handleNext}
                className="bg-[#C8A97E] hover:bg-[#B69A6E] text-black px-6 py-2.5 text-base font-medium"
                disabled={!canProceedToNextStep()}
              >
                {currentStep === "4" ? "Absenden" : "Weiter"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Document Modal */}
      <LegalDocumentModal
        isOpen={showLegalModal === "agb"}
        onClose={() => setShowLegalModal(null)}
        title="AGB"
      >
        <LegalContent type="agb" />
      </LegalDocumentModal>

      <LegalDocumentModal
        isOpen={showLegalModal === "datenschutz"}
        onClose={() => setShowLegalModal(null)}
        title="Datenschutzerklärung"
      >
        <LegalContent type="datenschutz" />
      </LegalDocumentModal>

      {/* Success Message */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-[#0A0A0A] rounded-xl border-2 border-[#C8A97E]/20 shadow-2xl w-[90%] max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-medium text-[#C8A97E] mb-4">Buchung erfolgreich!</h2>
              <p className="text-white/70">Vielen Dank für Ihre Buchung. Wir werden uns in Kürze bei Ihnen melden.</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute right-4 top-4 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Dialog>
  );
} 