"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import rimg from "../assets/rimg.png"

export default function RecommendedSection() {
  const [show, setShow] = useState(true)

  return (
    <div>
      {/* HEADER WITH TOGGLER ICON */}
      <div className="flex items-center cursor-pointer select-none gap-2 mb-3 pl-2 pt-2" onClick={() => setShow(!show)}>
        <ChevronDown size={18} className={`transition-transform duration-200 ${show ? "rotate-0" : "-rotate-90"}`} />
        <h2 className="font-semibold text-lg">Recommended</h2>
      </div>

      {/* RECOMMENDED CARD */}
      {show && (
        <div className="max-w-md w-full border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer">
          <div className="p-4 space-y-2">
            <div className="text-sm font-medium text-gray-600">Getting started</div>
            <img
              src={rimg || "/placeholder.svg"}
              alt="Intro Power BI"
              className="w-full h-32 object-contain rounded-md pl-2 pt-2"
            />
            <div className="text-sm font-semibold text-blue-700">Intro—What is Power BI?</div>
          </div>
        </div>
      )}
    </div>
  )
}
