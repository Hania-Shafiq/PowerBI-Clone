"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface Visualization {
  id: string
  type: string
  data: any
  config: any
}

interface VisualizationContextType {
  visualizations: Visualization[]
  setVisualizations: (visualizations: Visualization[]) => void
  addVisualization: (visualization: Visualization) => void
  removeVisualization: (id: string) => void
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined)

export const VisualizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visualizations, setVisualizations] = useState<Visualization[]>([])

  const addVisualization = (visualization: Visualization) => {
    setVisualizations((prev) => [...prev, visualization])
  }

  const removeVisualization = (id: string) => {
    setVisualizations((prev) => prev.filter((viz) => viz.id !== id))
  }

  return (
    <VisualizationContext.Provider
      value={{
        visualizations,
        setVisualizations,
        addVisualization,
        removeVisualization,
      }}
    >
      {children}
    </VisualizationContext.Provider>
  )
}

export const useVisualization = () => {
  const context = useContext(VisualizationContext)
  if (context === undefined) {
    throw new Error("useVisualization must be used within a VisualizationProvider")
  }
  return context
}
