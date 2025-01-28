"use client"

import {
  Collapsible,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { env } from "@/schemas/env-schema"
import { type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

  return (
    <SidebarGroup className="transition-all duration-300">
      <SidebarMenu>
        {routes.map((item) => {
          const isActive = pathname.startsWith(item.url)

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className="py-[3px]">
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  className="relative group/button"
                  asChild
                >
                  <Link href={`http://localhost:3000/${item.url}`}>
                    <div className="flex items-center gap-x-3 w-full ">
                      {item.icon && (
                        <item.icon className="size-5 shrink-0 transition-all" />
                      )}
                      <span className="text-base font-medium truncate transition-opacity duration-300">
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
    </SidebarGroup >
  )
}
