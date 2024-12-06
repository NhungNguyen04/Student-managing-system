'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { studentApi } from "@/apis"
import { format } from "date-fns"

interface DeleteStudentProps {
  isOpen: boolean
  onClose: () => void
  id: string
  isStudentView: boolean
  setCheckReloading: React.Dispatch<React.SetStateAction<boolean>>
  checkReloading: boolean
}

interface Student {
  id: string
  studentname: string
  birthDate: string
  gender: string
  startDate: string
  address: string
  User: {
    image: string | null
    username: string
    email: string
  }
}

export function DeleteStudent({
  isOpen,
  onClose,
  id,
  isStudentView,
  setCheckReloading,
  checkReloading
}: DeleteStudentProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [classId, setClassId] = useState<string>("")

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const res = await studentApi.getStudentById(id)
        setStudent(res.DT)
        const classData = await studentApi.getAllClassByStudentId(id)
        setClassId(classData.DT[0].class.id)
      } catch (error) {
        console.error("Error fetching student data:", error)
      }
    }

    if (isOpen && id) {
      fetchStudentData()
    }
  }, [isOpen, id])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const handleDeleteClick = async () => {
    try {
      let res
      if (isStudentView) {
        res = await studentApi.deleteStudent(student!.id)
      } else {
        res = await studentApi.deleteStudentFromClass(student!.id, classId)
      }
      if (res.EC !== 1) {
        toast({
          title: "Success",
          description: "Xóa thành công",
        })
        setCheckReloading(!checkReloading)
        onClose()
      } else {
        throw new Error(res.EM || "Unknown error")
      }
    } catch (error) {
      console.error("Error deleting student:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Xóa thất bại",
      })
    }
  }

  if (!student) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Xóa học sinh</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.User.image || "/student.png"} alt={student.studentname} />
              <AvatarFallback>{student.studentname.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-2xl font-semibold">{student.studentname}</h4>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Ngày sinh</p>
              <p className="text-base">{formatDate(student.birthDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Giới tính</p>
              <p className="text-base">{student.gender === "1" ? "Nam" : "Nữ"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày nhập học</p>
              <p className="text-base">{formatDate(student.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User name</p>
              <p className="text-base">{student.User.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-base">{student.User.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Địa chỉ</p>
              <p className="text-base">{student.address}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDeleteClick}>Xóa</Button>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

