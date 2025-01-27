import { AppSidebarWrapper } from "@/components/app-sidebar-wrapper";
import { DashboardLayoutContent } from "@/components/dashboard-content";
import QueryClientProvider from "@/components/query-client-provider";
import { ThemeProvider } from "@/components/theme-provider";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex">
          <DashboardLayoutContent sidebar={<AppSidebarWrapper />}>
            {children}
          </DashboardLayoutContent>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
