"use client"

import React from 'react'
import { LanguageProvider } from './language-switcher'
import '../../lib/i18n'

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
} 