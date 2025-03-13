"use client"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

// Add Google Translate type definitions
declare global {
  interface Window {
    doGTranslate: (lang_pair: string) => void;
  }
}

// Keep the translations for components that don't get translated by Google Translate
const translations = {
  de: {
    nav: {
      home: "Start",
      services: "Unterricht",
      about: "Über mich",
      references: "Referenzen & Kooperationen",
      testimonials: "Erfahrungen",
      contact: "Kontakt",
    },
    hero: {
      title: "Entdecke deine Stimme",
      subtitle: "Professionelles Vocal Coaching in Berlin",
      cta: "Jetzt buchen"
    },
    music: {
      title: "Meine Musik"
    },
    video: {
      title: "Einblicke"
    },
    services: {
      title: "Angebote",
      singing: {
        title: "Gesangsunterricht",
        description: "Individueller Unterricht für alle Level",
        features: [
          "Stimmbildung",
          "Atemtechnik",
          "Interpretation",
          "Bühnenpräsenz"
        ],
        details: {
          includes: [
            "Stimmanalyse",
            "Individueller Trainingsplan",
            "Aufnahmen",
            "Übe-Material"
          ],
          suitable: [
            "Anfänger",
            "Fortgeschrittene",
            "Profis",
            "Alle Genres"
          ],
          duration: "60-90 min",
          location: "Online & Studio Berlin"
        }
      }
    },
    about: {
      title: "Über mich",
      intro: "Professionelle Sängerin & Vocal Coach",
      expanded: "Mit jahrelanger Erfahrung im Gesangsunterricht...",
      projects: {
        title: "Aktuelle Projekte",
        description: "Entdecken Sie meine aktuellen musikalischen Projekte"
      },
      more: "Mehr erfahren",
      less: "Weniger anzeigen"
    },
    references: {
      title: "Referenzen & Kooperationen"
    },
    testimonials: {
      title: "Erfahrungen"
    },
    contact: {
      title: "Kontakt",
      form: {
        name: "Name",
        email: "E-Mail",
        message: "Nachricht",
        send: "Senden"
      }
    }
  },
  en: {
    nav: {
      home: "Home",
      services: "Lessons",
      about: "About",
      references: "References & Collaborations",
      testimonials: "Testimonials",
      contact: "Contact",
    },
    hero: {
      title: "Discover Your Voice",
      subtitle: "Professional Vocal Coaching in Berlin",
      cta: "Book Now"
    },
    music: {
      title: "My Music"
    },
    video: {
      title: "Insights"
    },
    services: {
      title: "Services",
      singing: {
        title: "Singing Lessons",
        description: "Individual lessons for all levels",
        features: [
          "Voice Training",
          "Breathing Technique",
          "Interpretation",
          "Stage Presence"
        ],
        details: {
          includes: [
            "Voice Analysis",
            "Individual Training Plan",
            "Recordings",
            "Practice Material"
          ],
          suitable: [
            "Beginners",
            "Advanced",
            "Professionals",
            "All Genres"
          ],
          duration: "60-90 min",
          location: "Online & Studio Berlin"
        }
      }
    },
    about: {
      title: "About Me",
      intro: "Professional Singer & Vocal Coach",
      expanded: "With years of experience in vocal training...",
      projects: {
        title: "Current Projects",
        description: "Discover my current musical projects"
      },
      more: "Learn More",
      less: "Show Less"
    },
    references: {
      title: "References & Collaborations"
    },
    testimonials: {
      title: "Testimonials"
    },
    contact: {
      title: "Contact",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send"
      }
    }
  }
}

// Helper functions for cookie management
function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const LanguageContext = createContext<{
  currentLang: string
  toggleLanguage: () => void
  t: typeof translations.de | typeof translations.en
}>({
  currentLang: "de",
  toggleLanguage: () => {},
  t: translations.de,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState("de")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const toggleAttempts = useRef(0);
  const lastToggleTime = useRef(0);

  // Initialize language from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for Google Translate cookie first
      const googtrans = getCookie('googtrans');
      if (googtrans && googtrans.endsWith('/en')) {
        setCurrentLang('en');
        localStorage.setItem('preferredLanguage', 'en');
        return;
      }
      
      // Then check localStorage
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && (savedLang === 'de' || savedLang === 'en')) {
        setCurrentLang(savedLang);
        
        // Also set Google Translate to the saved language on initial load
        if (savedLang === 'en' && window.doGTranslate) {
          // Set the cookie directly
          setCookie('googtrans', '/de/en', 1);
          
          // Then try the doGTranslate function
          try {
            window.doGTranslate('de|en');
          } catch (error) {
            console.error('Error setting initial language:', error);
          }
        }
      }
    }
  }, []);

  const toggleLanguage = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition
    
    // Prevent rapid toggling
    const now = Date.now();
    if (now - lastToggleTime.current < 1000) {
      return;
    }
    lastToggleTime.current = now;
    
    setIsTransitioning(true);
    
    // Toggle the language state
    setCurrentLang((prev) => {
      const newLang = prev === "de" ? "en" : "de";
      
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferredLanguage', newLang);
        
        // Use Google Translate for the main content
        try {
          // Set the cookie directly first
          setCookie('googtrans', newLang === 'en' ? '/de/en' : '/de/de', 1);
          
          // Then try the doGTranslate function
          const langPair = newLang === 'en' ? 'de|en' : 'en|de';
          if (window.doGTranslate) {
            window.doGTranslate(langPair);
          }
          
          // Reset toggle attempts on successful toggle
          toggleAttempts.current = 0;
        } catch (error) {
          console.error('Error toggling Google Translate:', error);
          
          // If we've tried a few times and it's not working, force reload
          toggleAttempts.current += 1;
          if (toggleAttempts.current >= 2) {
            toggleAttempts.current = 0;
            window.location.reload();
          }
        }
      }
      
      return newLang;
    });
    
    // Allow transitions to complete before enabling toggle again
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        toggleLanguage,
        t: translations[currentLang as keyof typeof translations],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export default function LanguageSwitcher() {
  const { currentLang, toggleLanguage } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={toggleLanguage}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 hover:border-[#C8A97E]/50 transition-colors"
      aria-label={`Switch to ${currentLang === "de" ? "English" : "German"}`}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isHovered ? 0.8 : 1 }}
        className="text-sm font-medium"
      >
        {currentLang === "de" ? "EN" : "DE"}
      </motion.div>
    </button>
  )
} 