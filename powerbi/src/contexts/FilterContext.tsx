"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface Filter {
  id: string
  field: string
  operator: string
  value: any
}

interface FilterContextType {
  filters: Filter[]
  setFilters: (filters: Filter[]) => void
  addFilter: (filter: Filter) => void
  removeFilter: (id: string) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Filter[]>([])

  const addFilter = (filter: Filter) => {
    setFilters((prev) => [...prev, filter])
  }

  const removeFilter = (id: string) => {
    setFilters((prev) => prev.filter((filter) => filter.id !== id))
  }

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        addFilter,
        removeFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}
