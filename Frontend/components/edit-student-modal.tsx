'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Upload } from 'lucide-react'
import { cn } from "@/lib/utils"
import { studentApi } from "@/apis"

interface EditStudentProps {
  isOpen: boolean
  onClose: () => void
  id: string
  checkReloading: boolean
  setCheckReloading: React.Dispatch<React.SetStateAction<boolean>>
}

export function EditStudent({ isOpen, onClose, id, checkReloading, setCheckReloading }: EditStudentProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [student, setStudent] = useState<any>({})
  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [gender, setGender] = useState("")
  const [avatar, setAvatar] = useState<File | null>(null)
  const [address, setAddress] = useState("")

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

  async function getStudent() {
    try {
      const res = await studentApi.getStudentById(id)
      setStudent(res.DT)
      setName(res.DT.studentname || "")
      setBirthDate(res.DT.birthDate ? new Date(res.DT.birthDate) : undefined)
      setGender(res.DT.gender === "1" ? "Male" : "Female")
      setAddress(res.DT.address || "")
      setPreview(res.DT.User?.image || null)
    } catch (error) {
      console.error("Error fetching student:", error)
      alert("Failed to fetch student data")
    }
  }

  useEffect(() => {
    if (isOpen) {
      getStudent()
    }
  }, [isOpen, id])

  async function handleSaveClick() {
    const formData = new FormData()

    if (avatar) {
      formData.append("image", avatar)
    }

    formData.append("studentname", name)
    formData.append("birthDate", birthDate?.toISOString() || "")
    formData.append("gender", gender === "Male" ? "1" : "2")
    formData.append("address", address)

    try {
      const res = await studentApi.updateStudent(id, formData)
      if (res.EC === 0) {
        alert("Information updated successfully!!");
        setCheckReloading(!checkReloading)
        onClose()
      } else {
        throw new Error(res.EM || "Unknown error")
      }
    } catch (error) {
      console.error("Error updating student:", error)
      alert("Can't update information!");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit student information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={preview || "/student.png"} alt="Student" />
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
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birthDate" className="text-right">
            Date of birth
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate ? format(birthDate, "yyyy-MM-dd") : ""}
              onChange={(e) => setBirthDate(e.target.value ? new Date(e.target.value) : undefined)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveClick}>Save</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

