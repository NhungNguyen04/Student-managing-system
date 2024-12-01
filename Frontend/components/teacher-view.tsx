import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { httpClient } from "@/services"

interface TeacherViewProps {
  isOpenTeacherView: boolean
  closeTeacherView: () => void
  id: string
}

export function TeacherView({ isOpenTeacherView, closeTeacherView, id }: TeacherViewProps) {
  const [teacher, setTeacher] = useState<any>({})
  const [user, setUser] = useState<any>({})
  const [subject, setSubject] = useState<any>({})

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
      setSubject(res.DT.subject)
    } catch (error) {
      console.error("Failed to fetch teacher data:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  return (
    <Dialog open={isOpenTeacherView} onOpenChange={closeTeacherView}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thông tin giáo viên</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || "/teacher.png"} alt={teacher.teachername} />
              <AvatarFallback>{teacher.teachername?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-xl font-semibold">{teacher.teachername}</h4>
              <p className="text-sm text-muted-foreground">{user.username}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Ngày bắt đầu:</p>
              <p className="text-sm">{formatDate(teacher.startDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Giới tính:</p>
              <p className="text-sm">{teacher.gender === "1" ? "Nam" : "Nữ"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Môn học phụ trách:</p>
              <p className="text-sm">{subject.subjectname}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Trạng thái trong năm:</p>
              <p className="text-sm">{teacher.statusinyear === 0 ? "Chưa hoàn thành" : "Đã hoàn thành"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

