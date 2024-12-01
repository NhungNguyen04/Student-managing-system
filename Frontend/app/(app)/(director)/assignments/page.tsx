'use client'

import { useEffect, useState } from "react"
import { AssignmentTable } from "@/components/assignment-table"
import { assignmentApi, gradeApi } from "@/apis"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Assignment() {
  const [data, setData] = useState([])
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
      if (res.EC !== 1) {
        setData(res.DT)
      }
    }
  }

  useEffect(() => {
    if (selectYear) {
      fetchAllAssignment()
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
    </div>
  )
}

