import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DirectorSidebar } from "@/components/director-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="p-10">
    <SidebarProvider>
      <DirectorSidebar />
        <SidebarTrigger />
        {children}
    </SidebarProvider>
    </main>
  )
}
