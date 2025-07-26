"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface UIContextType {
  activeView: string
  setActiveView: (view: string) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<string>("home")

  return <UIContext.Provider value={{ activeView, setActiveView }}>{children}</UIContext.Provider>
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider")
  }
  return context
}
