import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FilterState } from "@/types/filters"
import { Info } from "lucide-react"
import { CategorySelect } from "./category-select"
import { LocationSelect } from "./location-select"
import { TimezoneSelect } from "./timezone-select"

interface FilterSidebarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  return (
    <div className="w-80 border-r p-6 space-y-6">
      <CategorySelect value={filters.category} onChange={(category) => onChange({ ...filters, category })} />

      <Accordion type="multiple" className="w-full" >
        <AccordionItem value="projectLength">
          <AccordionTrigger className="text-sm font-medium">Project length</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {[
              { id: "less-month", label: "Less than one month" },
              { id: "1-3-months", label: "1 to 3 months" },
              { id: "3-6-months", label: "3 to 6 months" },
              { id: "more-6-months", label: "More than 6 months" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={filters.projectLength.includes(id)}
                  onCheckedChange={(checked) => {
                    const newLength = checked
                      ? [...filters.projectLength, id]
                      : filters.projectLength.filter((l) => l !== id)
                    onChange({ ...filters, projectLength: newLength })
                  }}
                />
                <Label htmlFor={id} className="text-sm flex-1 text-muted-foreground">
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hoursPerWeek">
          <AccordionTrigger className="text-sm font-medium">Hours per week</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {[
              { id: "less-30", label: "Less than 30 hrs/week" },
              { id: "more-30", label: "More than 30 hrs/week" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={filters.hoursPerWeek.includes(id)}
                  onCheckedChange={(checked) => {
                    const newHours = checked
                      ? [...filters.hoursPerWeek, id]
                      : filters.hoursPerWeek.filter((h) => h !== id)
                    onChange({ ...filters, hoursPerWeek: newHours })
                  }}
                />
                <Label htmlFor={id} className="text-sm flex-1 text-muted-foreground">
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="jobDuration">
          <AccordionTrigger className="text-sm font-medium">Job duration</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="contract-hire"
                checked={filters.jobDuration.includes("contract-hire")}
                onCheckedChange={(checked) => {
                  const newDuration = checked
                    ? [...filters.jobDuration, "contract-hire"]
                    : filters.jobDuration.filter((d) => d !== "contract-hire")
                  onChange({ ...filters, jobDuration: newDuration })
                }}
              />
              <Label htmlFor="contract-hire" className="text-sm flex-1 text-muted-foreground">
                Contract-to-hire roles
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experienceLevel">
          <AccordionTrigger className="text-sm font-medium">Experience level</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {[
              { id: "entry", label: "Entry Level" },
              { id: "intermediate", label: "Intermediate" },
              { id: "expert", label: "Expert" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={filters.experienceLevel.includes(id)}
                  onCheckedChange={(checked) => {
                    const newLevel = checked
                      ? [...filters.experienceLevel, id]
                      : filters.experienceLevel.filter((l) => l !== id)
                    onChange({ ...filters, experienceLevel: newLevel })
                  }}
                />
                <Label htmlFor={id} className="text-sm flex-1 text-muted-foreground">
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="jobType">
          <AccordionTrigger className="text-sm font-medium">Job type</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hourly"
                  checked={filters.jobType.hourly}
                  onCheckedChange={(checked) => {
                    onChange({
                      ...filters,
                      jobType: {
                        ...filters.jobType,
                        hourly: checked as boolean,
                      },
                    })
                  }}
                />
                <Label htmlFor="hourly" className="text-sm">
                  Hourly
                </Label>
              </div>
              {filters.jobType.hourly && (
                <div className="pl-6 flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="w-20 h-8"
                    value={filters.jobType.hourlyRate.min || ""}
                    onChange={(e) => {
                      onChange({
                        ...filters,
                        jobType: {
                          ...filters.jobType,
                          hourlyRate: {
                            ...filters.jobType.hourlyRate,
                            min: Number(e.target.value),
                          },
                        },
                      })
                    }}
                  />
                  <span className="text-sm">/hr</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="w-20 h-8"
                    value={filters.jobType.hourlyRate.max || ""}
                    onChange={(e) => {
                      onChange({
                        ...filters,
                        jobType: {
                          ...filters.jobType,
                          hourlyRate: {
                            ...filters.jobType.hourlyRate,
                            max: Number(e.target.value),
                          },
                        },
                      })
                    }}
                  />
                  <span className="text-sm">/hr</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {[
                { id: "fixed-price", label: "Fixed-Price" },
                { id: "less-100", label: "Less than $100" },
                { id: "100-500", label: "$100 to $500" },
                { id: "500-1k", label: "$500 - $1K" },
                { id: "1k-5k", label: "$1K - $5K" },
                { id: "5k-plus", label: "$5K+" },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={filters.jobType.fixedPrice.includes(id)}
                    onCheckedChange={(checked) => {
                      const newFixedPrice = checked
                        ? [...filters.jobType.fixedPrice, id]
                        : filters.jobType.fixedPrice.filter((p) => p !== id)
                      onChange({
                        ...filters,
                        jobType: {
                          ...filters.jobType,
                          fixedPrice: newFixedPrice,
                        },
                      })
                    }}
                  />
                  <Label htmlFor={id} className="text-sm flex-1 text-muted-foreground">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="proposals">
          <AccordionTrigger className="text-sm font-medium">Number of proposals</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {[
              { id: "less-5", label: "Less than 5" },
              { id: "5-10", label: "5 to 10" },
              { id: "10-15", label: "10 to 15" },
              { id: "15-20", label: "15 to 20" },
              { id: "20-50", label: "20 to 50" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={filters.proposals.includes(id)}
                  onCheckedChange={(checked) => {
                    const newProposals = checked
                      ? [...filters.proposals, id]
                      : filters.proposals.filter((p) => p !== id)
                    onChange({ ...filters, proposals: newProposals })
                  }}
                />
                <Label htmlFor={id} className="text-sm flex-1 text-muted-foreground">
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="clientInfo">
          <AccordionTrigger className="text-sm font-medium">Client info</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {[
              { id: "my-previous", label: "My previous clients" },
              { id: "payment-verified", label: "Payment verified" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={filters.clientInfo.includes(id)}
                  onCheckedChange={(checked) => {
                    const newInfo = checked ? [...filters.clientInfo, id] : filters.clientInfo.filter((i) => i !== id)
                    onChange({ ...filters, clientInfo: newInfo })
                  }}
                />
                <Label htmlFor={id} className="text-sm flex-1 text-muted-foreground">
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="clientHistory">
          <AccordionTrigger className="text-sm font-medium">Client history</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {[
              { id: "no-hires", label: "No hires" },
              { id: "1-9-hires", label: "1 to 9 hires" },
              { id: "10-plus-hires", label: "10+ hires" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={filters.clientHistory.includes(id)}
                  onCheckedChange={(checked) => {
                    const newHistory = checked
                      ? [...filters.clientHistory, id]
                      : filters.clientHistory.filter((h) => h !== id)
                    onChange({ ...filters, clientHistory: newHistory })
                  }}
                />
                <Label htmlFor={id} className="text-sm flex-1 text-muted-foreground">
                  {label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger className="text-sm font-medium">
            Client location
            <Info className="ml-2 h-4 w-4 text-muted-foreground" />
          </AccordionTrigger>
          <AccordionContent>
            <LocationSelect value={filters.locations} onChange={(locations) => onChange({ ...filters, locations })} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="timezone">
          <AccordionTrigger className="text-sm font-medium">
            Client time zones
            <Info className="ml-2 h-4 w-4 text-muted-foreground" />
          </AccordionTrigger>
          <AccordionContent>
            <TimezoneSelect value={filters.timeZones} onChange={(timeZones) => onChange({ ...filters, timeZones })} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
