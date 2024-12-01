'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { assignmentApi } from "@/apis"
import { toast } from "react-toastify"
import { TeacherComboBox } from "@/components/teacher-combo-box"

interface AddAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  checkReLoading: boolean
  setCheckReLoading: (value: boolean) => void
  assignment: {
    subjectId: string
    classId: string
    teacherId: string | null
    subject: { subjectname: string }
    class: { classname: string }
    teacher?: { teacherName: string }
  }
}

export default function AddAssignmentModal({
  isOpen,
  onClose,
  checkReLoading,
  setCheckReLoading,
  assignment,
}: AddAssignmentModalProps) {
  const [assignmentInfo, setAssignmentInfo] = useState({
    subjectId: assignment.subjectId,
    classId: assignment.classId,
    teacherId: assignment.teacherId || "",
  })

  const handleChange = (name: string, value: string) => {
    setAssignmentInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await assignmentApi.createAssignment(assignmentInfo)
      if (res.EC !== 1) {
        toast.success("Phân công thành công")
        setCheckReLoading(!checkReLoading)
      } else {
        toast.error(res.EM)
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred")
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phân công giảng dạy</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label>
              Lớp
              <Input
                id="className"
                value={assignment.class.classname}
                disabled
              />
            </label>
            <label>
              Môn học
              <Input
                id="subjectName"
                value={assignment.subject.subjectname}
                disabled
              />
            </label>
          </div>
          <TeacherComboBox
            handleChange={handleChange}
            teacher={assignment.teacher}
            teacherId={assignment.teacherId ?? undefined}
            subjectId={assignment.subjectId}
          />
          <div className="flex justify-end space-x-2">
            <Button type="submit">Thêm</Button>
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

