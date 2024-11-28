'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { CalendarIcon, Upload } from 'lucide-react'
import { cn } from "@/lib/utils"
import { studentApi } from "@/apis"

interface OnlyAddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  year: number
}

export function OnlyAddStudentModal({ isOpen, onClose, year }: OnlyAddStudentModalProps) {
  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState<Date>()
  const [gender, setGender] = useState("Nam")
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handlePreviewAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(file)
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveClick = async () => {
    if (!name || !birthDate || !email || !address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields.",
      })
      return
    }

    const formData = new FormData()

    if (avatar) {
      formData.append("image", avatar)
    }

    formData.append("studentname", name)
    formData.append("birthDate", birthDate.toISOString())
    formData.append("startDate", new Date().toISOString())
    formData.append("gender", gender === "Nam" ? "1" : "2")
    formData.append("email", email)
    formData.append("address", address)

    try {
      const res = await studentApi.createStudent(formData)
      if (res.EC === 0) {
        toast({
          title: "Success",
          description: "Thêm học sinh thành công!",
        })
        onClose()
      } else {
        throw new Error(res.EM)
      }
    } catch (error) {
      console.error("Error creating student:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm học sinh</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={preview || "/student.png"} alt="Preview" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium">
                <Upload className="h-4 w-4" />
                Upload Image
              </div>
              <Input id="avatar" type="file" className="sr-only" onChange={handlePreviewAvatar} />
            </Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Họ tên
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birthDate" className="text-right">
              Ngày sinh
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Giới tính
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Địa chỉ
            </Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveClick}>Lưu</Button>
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

