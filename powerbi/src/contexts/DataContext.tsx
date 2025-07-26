"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface DataContextType {
  data: any[]
  setData: (data: any[]) => void
  selectedDataSource: string | null
  setSelectedDataSource: (source: string | null) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any[]>([])
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null)

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        selectedDataSource,
        setSelectedDataSource,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
