import { AppSidebarWrapper } from "@/components/app-sidebar-wrapper";
import { DashboardLayoutContent } from "@/components/dashboard-content";
import QueryClientProvider from "@/components/query-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import JobsStatusContextProvider from "@/contexts/jobs-status-context";
import { Toaster } from "sonner";


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
          <JobsStatusContextProvider>
            <DashboardLayoutContent sidebar={<AppSidebarWrapper />}>
              {children}
              <Toaster richColors theme="system" />
            </DashboardLayoutContent>
          </JobsStatusContextProvider>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
