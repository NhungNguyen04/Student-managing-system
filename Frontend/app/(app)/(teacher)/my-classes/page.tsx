'use client'

import { useState, useEffect } from "react"
import { Dropdown } from "@/components/dropdown"
import { DialogView } from "@/components/dialog-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { teacherApi, classApi, gradeApi } from "@/apis"

export default function TeacherClass() {
  const [selectYear, setSelectYear] = useState("")
  const [classValue, setClassValue] = useState<any[]>([])
  const [subject, setSubject] = useState("")
  const [grade10, setGrade10] = useState<any[]>([])
  const [grade11, setGrade11] = useState<any[]>([])
  const [grade12, setGrade12] = useState<any[]>([])
  const [dataGrade, setDataGrade] = useState<any[]>([])

  const id = typeof window !== 'undefined' ? localStorage.getItem("teacherId") : null
  const subjectId = typeof window !== 'undefined' ? localStorage.getItem("subjectId") : null

  const getAllGradesByYear = async () => {
    if (selectYear) {
      try {
        const res = await gradeApi.getAllGradeByYearService(selectYear)
        setDataGrade(res.DT)
      } catch (error) {
        console.error("Error fetching grades:", error)
      }
    }
  }

  const getSubjectName = async () => {
    if (id) {
      try {
        const res = await teacherApi.getTeacherById(id);
        setSubject(res.DT.subject.subjectname)
      } catch (error) {
        console.error("Error fetching subject name:", error)
      }
    }
  }

  const getClass = async () => {
    if (id) {
      try {
        const res = await classApi.getAllClassesByTeacherId(id);
        setClassValue(res.DT)
      } catch (error) {
        console.error("Error fetching classes:", error)
      }
    }
  }

  useEffect(() => {
    getAllGradesByYear()
  }, [selectYear])

  useEffect(() => {
    if (id) {
      getClass()
      getSubjectName()
    }
  }, [id])

  useEffect(() => {
    if (classValue.length > 0 && dataGrade.length > 0) {
      const grade10Classes: any[] = []
      const grade11Classes: any[] = []
      const grade12Classes: any[] = []

      classValue.forEach(({ id, classname, total, gradeId }) => {
        dataGrade.forEach((grade) => {
          if (grade.id === gradeId) {
            if (grade.gradename === "10") {
              grade10Classes.push({ id, classname, total })
            } else if (grade.gradename === "11") {
              grade11Classes.push({ id, classname, total })
            } else if (grade.gradename === "12") {
              grade12Classes.push({ id, classname, total })
            }
          }
        })
      })

      setGrade10(grade10Classes)
      setGrade11(grade11Classes)
      setGrade12(grade12Classes)
    }
  }, [classValue, dataGrade])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Classes</h1>
        <Dropdown selectYear={selectYear} setSelectYear={setSelectYear} />
      </div>

      {[
        { title: "Grade 10", data: grade10 },
        { title: "Grade 11", data: grade11 },
        { title: "Grade 12", data: grade12 },
      ].map((grade) => (
        <div key={grade.title} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{grade.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grade.data.map(({ id, classname, total }) => (
              <Card key={id}>
                <CardHeader>
                  <CardTitle>{classname}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Total Students: {total}</p>
                  <DialogView
                    classId={id}
                    nameclass={classname}
                    gradename={grade.title.split(" ")[1]}
                    subjectname={subject}
                    subjectId={subjectId || ""}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

