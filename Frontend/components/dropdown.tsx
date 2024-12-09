'use client'

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { gradeApi } from "@/apis"


interface DropdownProps {

  selectYear: number | null

  setSelectYear: (year: number | null) => void

  type?: string | null

}
export function Dropdown({ selectYear, setSelectYear, type }: DropdownProps) {
  const [data, setData] = useState<any[]>([])
  const [yearArr, setYearArr] = useState<string[]>([])

  const fetchAllYear = async () => {
    try {
      const year = await gradeApi.getAllYear()
      setData(year.DT)
    } catch (error) {
      console.error("Error fetching years:", error)
    }
  }

  useEffect(() => {
    fetchAllYear()
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      const arr = data.map((grade) => grade.year.toString())
      const reductArr = type !== null ? ["All", ...new Set(arr)] : [...new Set(arr)]
      setYearArr(reductArr)
      
      // Set default year to the latest year
      const latestYear = arr.sort((a, b) => parseInt(b) - parseInt(a))[0]
      if (!selectYear) {
        setSelectYear(latestYear)
      }
    }
  }, [data, type, selectYear, setSelectYear])

  return (
    <div className="w-[180px]">
      <Select value={selectYear ? selectYear.toString() : undefined} onValueChange={(value) => setSelectYear(value ? parseInt(value) : null)}>
        <SelectTrigger>
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {yearArr.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
