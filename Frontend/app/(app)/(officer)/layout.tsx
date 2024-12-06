import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { OfficerSidebar } from "@/components/officer-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <OfficerSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
