"use client"

import { useReducer, useEffect, useState } from "react"
import { generateUrl, getFilterTags } from "@/lib/utils"
import type { FilterState, FilterAction } from "@/types/filters"
import { FilterSidebar } from "@/components/filters/filter-sidebar"
import { FilterTags } from "@/components/filters/filter-tags"
import { UrlCard } from "@/components/filters/url-card"

const initialState: FilterState = {
  category: "",
  projectLength: [],
  hoursPerWeek: [],
  jobDuration: [],
  experienceLevel: [],
  jobType: {
    hourly: false,
    hourlyRate: {
      min: 0,
      max: 0,
    },
    fixedPrice: [],
  },
  proposals: [],
  clientInfo: [],
  clientHistory: [],
  locations: [],
  timeZones: [],
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "UPDATE_FILTERS":
      return { ...state, ...action.payload }
    case "RESET_FILTERS":
      return initialState
    default:
      return state
  }
}

export default function JobFilters() {
  const [filters, dispatch] = useReducer(filterReducer, initialState)
  const [url, setUrl] = useState(generateUrl(filters))
  const [filterTags, setFilterTags] = useState<string[]>([])

  useEffect(() => {
    setUrl(generateUrl(filters))
    setFilterTags(getFilterTags(filters))
  }, [filters])

  const handleFiltersChange = (newFilters: FilterState) => {
    dispatch({ type: "UPDATE_FILTERS", payload: newFilters })
  }

  const handleRemoveFilterTag = (tag: string) => {
    // Remove corresponding filter based on tag
    const newFilters = { ...filters }
    // Logic to remove specific filter based on tag
    dispatch({ type: "UPDATE_FILTERS", payload: newFilters })
  }

  const handleClearFilterTags = () => {
    dispatch({ type: "RESET_FILTERS", payload: initialState })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <FilterSidebar filters={filters} onChange={handleFiltersChange} />
      <div className="flex-1">
        <FilterTags tags={filterTags} onRemove={handleRemoveFilterTag} onClear={handleClearFilterTags} />
        <div className="p-6">
          <UrlCard url={url} />
        </div>
      </div>
    </div>
  )
}
