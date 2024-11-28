'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { studentApi, accountApi } from "@/apis"
import { format } from "date-fns"

interface StudentProfileViewProps {
  isOpen: boolean
  onClose: () => void
  id: string
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

export function StudentProfileView({ isOpen, onClose, id }: StudentProfileViewProps) {
  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const res = await studentApi.getStudentById(id)
        setStudent(res.DT)
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

  if (!student) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Thông tin học sinh</DialogTitle>
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
      </DialogContent>
    </Dialog>
  )
}

