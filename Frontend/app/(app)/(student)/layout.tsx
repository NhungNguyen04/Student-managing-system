import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/student-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <StudentSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
