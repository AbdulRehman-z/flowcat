"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { timeZones } from "@/data/locations"

interface TimezoneSelectProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function TimezoneSelect({ value, onChange }: TimezoneSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
          {value.length > 0
            ? `${value.length} timezone${value.length > 1 ? "s" : ""} selected`
            : "Select client time zones"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search time zones..." className="h-9" />
          <CommandList>
            <CommandEmpty>No time zone found.</CommandEmpty>
            <ScrollArea className="h-[300px]">
              <CommandGroup>
                {timeZones.map((timezone) => (
                  <CommandItem
                    key={timezone.value}
                    value={timezone.value}
                    onSelect={() => {
                      onChange(
                        value.includes(timezone.value)
                          ? value.filter((v) => v !== timezone.value)
                          : [...value, timezone.value],
                      )
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value.includes(timezone.value) ? "opacity-100" : "opacity-0")}
                    />
                    {timezone.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

