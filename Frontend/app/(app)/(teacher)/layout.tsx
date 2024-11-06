import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TeacherSidebar } from "@/components/teacher-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TeacherSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
