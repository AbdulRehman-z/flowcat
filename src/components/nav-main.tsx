"use client"

import { cn } from "@/lib/utils"
import { Collapsible } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function NavMain({
  routes,
}: {
  routes: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <SidebarGroup className="transition-all duration-300 ">
      <SidebarMenu className="space-y-1.5">
        {routes.map((item) => {
          const isActive = pathname === item.url // More precise match

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className="relative py-1 flex flex-col items-center">
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  className={cn(
                    "group/button h-10 rounded-lg px-3.5 transition-all",
                    "hover:bg-accent/70 hover:pl-4",
                    "data-[active=true]:bg-primary/10",
                    "focus-visible:ring-2 focus-visible:ring-accent/50",
                    mounted && "animate-in fade-in slide-in-from-left-4"
                  )}
                  asChild
                >
                  <Link href={item.url}>
                    <div className="flex items-center gap-x-3 w-full">
                      {item.icon && (
                        <item.icon className={cn(
                          "size-[1.2rem] shrink-0 transition-transform",
                          "text-muted-foreground group-hover/button:text-foreground",
                          isActive ? "text-foreground " : "group-hover/button:scale-110"
                        )} />
                      )}
                      <span className={cn(
                        "text-base font-medium truncate transition-colors",
                        "text-muted-foreground group-hover/button:text-foreground",
                        isActive && "text-foreground font-semibold"
                      )}>
                        {item.title}
                      </span>
                    </div>

                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
