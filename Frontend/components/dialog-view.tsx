'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TeacherStudentTable } from "./teacher-student-table"
import { classApi } from "@/apis"

interface DialogViewProps {
  nameclass: string
  classId: string
  gradename: string
  subjectname: string
  subjectId: string
}

export function DialogView({ nameclass, classId, gradename, subjectname, subjectId }: DialogViewProps) {
  const [data, setData] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  const fetchAllStudentByClassId = async () => {
    try {
      const getData = await classApi.getAllStudentByClassId(classId)
      setData(getData.DT)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  useEffect(() => {
    if (open) {
      fetchAllStudentByClassId()
    }
  }, [open, classId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Class</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Class {nameclass}</DialogTitle>
        </DialogHeader>
        <div className="h-[500px] overflow-y-auto">
          <TeacherStudentTable
            data={data}
            gradename={gradename}
            subjectname={subjectname}
            subjectId={subjectId}
            classId={classId}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

