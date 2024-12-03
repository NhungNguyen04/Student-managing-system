'use client'

import { useEffect, useState } from "react"
import { AssignmentTable } from "@/components/assignment-table"
import { UnassignedTable } from "@/components/unassigned-table"
import { assignmentApi, gradeApi, subjectApi, classApi } from "@/apis"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UnassignedItem {
  id: string
  class: { classname: string }
  subject: { subjectname: string }
  subjectId: string
  classId: string
  teacherId: number | null
}

export default function Assignment() {
  const [data, setData] = useState([])
  const [unassignedData, setUnassignedData] = useState<UnassignedItem[]>([])
  const [checkReLoading, setCheckReLoading] = useState(false)
  const [selectYear, setSelectYear] = useState("")
  const [years, setYears] = useState<number[]>([])

  const fetchAllYear = async () => {
    const yearData = await gradeApi.getAllYear()
    if (yearData.DT) {
      const maxYear = Math.max(...yearData.DT.map((y: { year: number }) => y.year))
      setYears(yearData.DT.map((y: { year: number }) => y.year))
      setSelectYear(maxYear.toString())
    }
  }

  useEffect(() => {
    fetchAllYear()
  }, [])

  const fetchAllAssignment = async () => {
    if (selectYear) {
      const res = await assignmentApi.getAllAssignmentByYear(selectYear)
      console.log(res);
      if (res.EC !== 1) {
        setData(res.DT)
      }
    }
  }

  const fetchUnassignedData = async () => {
    if (selectYear) {
      const [subjectsRes, classesRes, assignmentsRes] = await Promise.all([
        subjectApi.getAllSubject(),
        classApi.getAllClassByGradeAndYear("gradeName", selectYear),
        assignmentApi.getAllAssignmentByYear(selectYear)
      ])

      if (subjectsRes.EC !== 1 && classesRes.EC !== 1 && assignmentsRes.EC !== 1) {
        const subjects = subjectsRes.DT
        const classes = classesRes.DT
        const assignments = assignmentsRes.DT

        const unassigned: UnassignedItem[] = []

        classes.forEach((classItem: any) => {
          subjects.forEach((subject: any) => {
            const isAssigned = assignments.some((assignment: any) =>
              assignment.classId === classItem.id && assignment.subjectId === subject.id
            )
            if (!isAssigned) {
              unassigned.push({
                id: `${classItem.id}-${subject.id}`,
                class: classItem,
                subject: subject,
                subjectId: subject.id,
                classId: classItem.id,
                teacherId: null
              })
            }
          })
        })

        setUnassignedData(unassigned)
      }
    }
  }

  useEffect(() => {
    if (selectYear) {
      fetchAllAssignment()
      fetchUnassignedData()
    }
  }, [selectYear, checkReLoading])

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assignment</h1>
        <Select value={selectYear} onValueChange={(value) => setSelectYear(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <AssignmentTable
        data={data}
        checkReLoading={checkReLoading}
        setCheckReLoading={setCheckReLoading}
      />
      <UnassignedTable
        data={unassignedData}
        checkReLoading={checkReLoading}
        setCheckReLoading={setCheckReLoading}
      />
    </div>
  )
}
