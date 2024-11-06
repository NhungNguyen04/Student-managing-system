import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DirectorSidebar } from "@/components/director-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DirectorSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
