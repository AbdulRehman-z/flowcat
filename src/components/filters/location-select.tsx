"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { locations } from "@/data/locations"

interface LocationSelectProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function LocationSelect({ value, onChange }: LocationSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
          {value.length > 0
            ? `${value.length} location${value.length > 1 ? "s" : ""} selected`
            : "Select client locations"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search locations..." className="h-9" />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <ScrollArea className="h-[300px]">
              {locations.regions.map((region) => (
                <React.Fragment key={region.name}>
                  <CommandGroup heading={region.name}>
                    <CommandItem
                      value={region.name}
                      onSelect={() => {
                        onChange(
                          value.includes(region.name)
                            ? value.filter((v) => v !== region.name)
                            : [...value, region.name],
                        )
                      }}
                      className="font-medium"
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", value.includes(region.name) ? "opacity-100" : "opacity-0")}
                      />
                      {region.name}
                    </CommandItem>
                    {region.subregions.map((subregion) => (
                      <React.Fragment key={subregion.name}>
                        <CommandItem
                          value={subregion.name}
                          onSelect={() => {
                            onChange(
                              value.includes(subregion.name)
                                ? value.filter((v) => v !== subregion.name)
                                : [...value, subregion.name],
                            )
                          }}
                          className="pl-6"
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", value.includes(subregion.name) ? "opacity-100" : "opacity-0")}
                          />
                          {subregion.name}
                        </CommandItem>
                        {subregion.countries.map((country) => (
                          <CommandItem
                            key={country}
                            value={country}
                            onSelect={() => {
                              onChange(
                                value.includes(country) ? value.filter((v) => v !== country) : [...value, country],
                              )
                            }}
                            className="pl-10"
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", value.includes(country) ? "opacity-100" : "opacity-0")}
                            />
                            {country}
                          </CommandItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </React.Fragment>
              ))}
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

