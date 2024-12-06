import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, Upload } from 'lucide-react'
import { httpClient } from "@/services"
import { teacherApi } from "@/apis"

interface TeacherEditProps {
  isOpenTeacherEdit: boolean
  closeTeacherEdit: () => void
  id: string
  checkReLoading: boolean
  setCheckReLoading: (value: boolean) => void
}

export function TeacherEdit({
  isOpenTeacherEdit,
  closeTeacherEdit,
  id,
  checkReLoading,
  setCheckReLoading,
}: TeacherEditProps) {
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [gender, setGender] = useState("")
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [email, setEmail] = useState("")
  const [teacher, setTeacher] = useState<any>({})
  const [user, setUser] = useState<any>({})
  const [subjectObject, setSubjectObject] = useState<any>({})

  useEffect(() => {
    if (id) {
      getTeacher()
    }
  }, [id])

  async function getTeacher() {
    try {
      const res = await httpClient.get(`/teacher/${id}`)
      setTeacher(res.DT)
      setUser(res.DT.User)
      setSubjectObject(res.DT.subject)
      setValues(res.DT)
    } catch (error) {
      console.error("Failed to fetch teacher data:", error)
    }
  }

  function setValues(teacherData: any) {
    setName(teacherData.teachername)
    setGender(teacherData.gender === "1" ? "Male" : "Female")
    setBirthDate(new Date(teacherData.birthDate))
    setEmail(teacherData.User.email)
    setPreview(teacherData.User.image)
  }

  const handlePreviewAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveClick = async () => {
    const formData = new FormData()

    if (avatar) {
      formData.append("image", avatar)
    }

    formData.append("teachername", name)
    formData.append("birthDate", birthDate?.toISOString() || "")
    formData.append("gender", gender === "Male" ? "1" : "2")
    formData.append("email", email)

    try {
      const res = await teacherApi.updateTeacher(id, formData)
      if (res.EC === 0) {
        alert("Information updated successfully!!");
        setCheckReLoading(!checkReLoading)
        closeTeacherEdit()
      } else {
        alert("Can't update information!");
      }
    } catch (error) {
      console.error("Failed to update teacher:", error)
      alert("Can't update information!");
    }
  }

  return (
    <Dialog open={isOpenTeacherEdit} onOpenChange={closeTeacherEdit}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit teacher information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={preview || "/teacher.png"} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center justify-center">
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload Image</span>
              </div>
            </Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePreviewAvatar}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveClick}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

