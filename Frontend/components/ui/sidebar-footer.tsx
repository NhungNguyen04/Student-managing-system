'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { accountApi } from '@/apis'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function SidebarUserFooter() {
  const router = useRouter()
  const { logOut, userId } = useAuth()
  const [role,setRole] = useState("");
  const [image,setImage] = useState("");
  useEffect( () => {
      const fetch =async()=>
      {
      const RoleTake = localStorage.getItem('role')
      const id = localStorage.getItem('userId')
      const response = await accountApi.getAccountById(id);
      setImage(response.image)
      setRole(RoleTake?RoleTake:"");
      }
      fetch();
    }
  )
  

  const handleProfileClick = async() =>
  {
    switch (role)
    {
      case '1':
        router.push('/directorprofile')  // This will navigate to (director)/dashboard
        break
      case '4':
        router.push('/studentprofile')  // This will navigate to (student)/dashboard
        break
      case '3':
        router.push('/officerprofile')    // This will navigate to (officer)/reports
        break
      case '2':
        router.push('/teacherprofile')    // This will navigate to (teacher)/classes
        break
      default:
    }


  }

  const handleLogout = async () => {
    await logOut()
    router.push('/')
  }

  const getimgsource = (role:string) =>
  {
    if(image) return image;
    else
    switch(role)
    {
      case '1':
        return "images/director.png"
      case '4':
        return "images/student.png"  // This will navigate to (student)/dashboard
      case '3':
        return "images/officer.png"   // This will navigate to (officer)/reports
      case '2':
        return "images/teacher.png"    // This will navigate to (teacher)/classes
      default: 
    }
  }
  const imgsource = role ? getimgsource(role) : "";
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full justify-start">
                <Avatar className="h-6 w-6 mr-2 rounded-full border-[0.5px] border-[#02060bd9]">
                  <AvatarImage src={imgsource} alt="User avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>User Profile</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}