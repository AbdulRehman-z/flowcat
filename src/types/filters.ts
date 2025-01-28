export type FilterState = {
  category: string
  projectLength: string[]
  hoursPerWeek: string[]
  jobDuration: string[]
  experienceLevel: string[]
  jobType: {
    hourly: boolean
    hourlyRate: {
      min: number
      max: number
    }
    fixedPrice: string[]
  }
  proposals: string[]
  clientInfo: string[]
  clientHistory: string[]
  locations: string[]
  timeZones: string[]
}

export type FilterAction = {
  type: string
  payload: any
}
