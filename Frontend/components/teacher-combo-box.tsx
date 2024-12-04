'use client'

import * as React from "react"
import { teacherApi } from "@/apis"
import { toast } from "react-toastify"

interface Teacher {
  id: number
  teachername: string
}

interface TeacherComboBoxProps {
  handleChange: (name: string, value: string) => void
  subjectId: string
  teacher?: { teacherName: string }
  teacherId?: number
}

export function TeacherComboBox({ handleChange, subjectId, teacherId }: TeacherComboBoxProps) {
  const [value, setValue] = React.useState(teacherId || "")
  const [teachers, setTeachers] = React.useState<Teacher[]>([])

  const fetchAllTeacher = React.useCallback(async () => {
    try {
      const res = await teacherApi.getAllTeacherBySubjectId(subjectId)
      if (res.EC === 1) {
        toast.error(res.EM)
      } else {
        setTeachers(res.DT || [])
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Failed to fetch teachers")
    }
  }, [subjectId])

  React.useEffect(() => {
    fetchAllTeacher()
  }, [fetchAllTeacher])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value
    setValue(selectedValue)
    handleChange("teacherId", selectedValue)
  }

  return (
    <div>
      <select
        value={value}
        onChange={handleSelectChange}
        className="w-[300px] p-2 border rounded"
      >
        <option value="" disabled>Select teacher...</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.teachername}
          </option>
        ))}
      </select>
    </div>
  )
}

