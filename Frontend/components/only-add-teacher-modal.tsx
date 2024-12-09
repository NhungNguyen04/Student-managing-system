import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { CalendarIcon, Upload } from 'lucide-react'
import { subjectApi, teacherApi } from "@/apis"
import { toast } from "react-toastify"
import SubjectComboBox from "./subject-combo-box"

interface OnlyAddTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  setCheckReLoading: (value: boolean) => void
}

export function OnlyAddTeacherModal({ isOpen, onClose, setCheckReLoading }: OnlyAddTeacherModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("Male")
  const [birthDate, setBirthDate] = useState<Date>()
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [subjectId, setSubjectId] = useState<string | undefined>(undefined)
  const [subjects, setSubjects] = useState<{ id: string, subjectname: string }[]>([])

  useEffect(() => {
    async function getAllSubject() {
      let res = await subjectApi.getAllSubject()
      setSubjects(res.DT)
      setSubjectId(res.DT[0].id)
    }
    getAllSubject()
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubjectChange = (value: string) => {
    setSubjectId(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    if (avatar) {
      formData.append("image", avatar)
    }
    formData.append("teachername", name)
    formData.append("birthDate", birthDate?.toISOString() || "")
    formData.append("startDate", "2024-06-06")
    formData.append("gender", gender === "Male" ? "1" : "2")
    formData.append("email", email)
    formData.append("subjectId", subjectId || "")

    const res1 = await teacherApi.createTeacher(formData)
    if (res1.EC === 0) {
      toast.success("Teacher added successfully!")
      setAvatar(null)
      setBirthDate(undefined)
      setEmail("")
      setGender("Male")
      setName("")
      setPreview(null)
      onClose()
      setCheckReLoading(true)
    } else {
      toast.error(res1.EM)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New teacher</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={preview || "/teacher.png"} alt="Preview" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
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
              onChange={handleAvatarChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <SubjectComboBox
              setSubjectId={setSubjectId}
              subjectId={subjectId}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue>{gender}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Birth date</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate ? format(birthDate, "yyyy-MM-dd") : ""}
              onChange={(e) => setBirthDate(e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

