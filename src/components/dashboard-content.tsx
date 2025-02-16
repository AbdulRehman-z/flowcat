import { ModeToggle } from "@/components/toggle-theme"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function DashboardLayoutContent({
  children,
  sidebar
}: {
  children: React.ReactNode
  sidebar: React.ReactNode
}) {

  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset>
        <header className="flex shrink-0 py-7  justify-between  px-10 items-center gap-2 border-b">
          <h1 className="text-4xl font-bold tracking-tight">
            <span
              className="bg-gradient-to-r from-primary to-primary/45 bg-clip-text text-transparent"
            >
              Good morning, Abdul!
            </span>
          </h1>
          <ModeToggle />
        </header>
        {/* <Separator /> */}
        <main className="flex flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
