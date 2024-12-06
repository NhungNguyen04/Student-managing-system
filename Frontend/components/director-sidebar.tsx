import { School, ChartNoAxesCombined, PersonStanding, UserPen, IndentDecrease, ListChecks , BookUser} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SidebarUserFooter } from "./ui/sidebar-footer"

// Menu items.
const items = [
  {
    title: "Dashboards",
    url: "dashboards",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Classes",
    url: "classes",
    icon: School,
  },
  {
    title: "Students",
    url: "students",
    icon: PersonStanding,
  },
  {
    title: "Teachers",
    url: "teachers",
    icon: UserPen,
  },
  {
    title: "Assignments",
    url: "assignments",
    icon: IndentDecrease,
  },
  {
    title: "Subjects",
    url: "subjects",
    icon: BookUser,
  },
]

export function DirectorSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Student management system</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarUserFooter/>
    </Sidebar>
  )
}
