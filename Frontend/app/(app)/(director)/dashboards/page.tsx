'use client'

import { useEffect, useState } from "react"
import { dashboardApi, gradeApi } from "@/apis"
import BarchartAdmin from "@/components/barchart-admin"
import AreaProgressChart from "@/components/area-progress-chart"
import RankingStudentTable from "@/components/ranking-student-table"
import DashboardCard from "@/components/dashboard-card"
import {Dropdown} from "@/components/dropdown"

interface Compare3YearData {
  Year: string;
  NumberHSG: number;
  NumberHSK: number;
  NumberHSTB: number;
  NumberHSY: number;
}

interface NumberByTitle {
  title: string;
  count: number;
  concludetitle: string;
  NumberHS: number;
}

export default function Dashboard() {
  const [data, setData] = useState<Student[]>([])
  const [compare3year, setCompare3Year] = useState<Compare3YearData[]>([])
  const [selectYear, setSelectYear] = useState<number | null>(null)
  const [numberByTitle, setNumberByTitle] = useState<NumberByTitle[]>([])
  const [excellentStudents, setExcellentStudents] = useState([])

  interface Year {
    year: number;
  }

  function maxGradeYear(year: Year[]): number {
    let maxYear = year[0].year;
    for (let i = 0; i < year.length; i++) {
      if (year[i].year > maxYear) maxYear = year[i].year;
    }
    return maxYear;
  }

  const fetchExcellentStudent = async () => {
    let getData = await dashboardApi.getExcellentStudent(selectYear)
    if (getData.EC != 1) {
      setExcellentStudents(getData.DT)
    }
  }

  const fetchTop10Students = async () => {
    let getData = await dashboardApi.getTop10Students(selectYear)
    if (getData.EC != 1) {
      setData(getData.DT)
    }
  }

  const fetchNumberOfStudentByTitle = async () => {
    let getData = await dashboardApi.getNumberOfStudentsWithType(selectYear)
    if (getData.EC != 1 && Array.isArray(getData.DT)) {
      setNumberByTitle(getData.DT)
    }
  }

  const fetchECompare3Year = async () => {
    let getData = await dashboardApi.getCompare3year(selectYear)
    if (getData.EC != 1) {
      setCompare3Year(getData.DT)
    }
  }

  const fetchAllYear = async () => {
    let year = await gradeApi.getAllYear()
    if (year.DT) {
      let maxYear = maxGradeYear(year.DT)
      setSelectYear(maxYear)
    }
  }

  useEffect(() => {
    fetchAllYear()
  }, [])

  useEffect(() => {
    if (selectYear !== null) {
      fetchExcellentStudent()
      fetchECompare3Year()
      fetchTop10Students()
      fetchNumberOfStudentByTitle()
    }
  }, [selectYear])

  interface Student {
      id: number;
      studentname: string;
      email: string;
      concludecore: number;
      classname: string;
      NumberHSG: number;
      NumberHSTotal: number;
      grade: string;
  }

  function DashboardCardData(data: Student[]) {
    let Students = data
    return Students.map((item: Student, index) => 
    (
      <DashboardCard
        NumberHSG={item?.NumberHSG}
        NumberHSTotal={item?.NumberHSTotal}
        grade={item?.grade}
        key={index}
      />
    ))
  }

  const result = DashboardCardData(excellentStudents)
  console.log(result)

  return (
    <div className="mb-0 w-full flex h-screen flex-col overflow-y-auto p-0">
      <div className="mt-10 flex items-center justify-between">
        <p className="animate-fade-up text-2xl font-bold">Dashboard</p>
        <Dropdown selectYear={selectYear} setSelectYear={setSelectYear} />
      </div>
      <div className="mt-5 grid w-full grid-cols-3 gap-4">{result}</div>
      <div className="mt-5 flex w-full">
        <div className="w-2/3">
          <BarchartAdmin compare3year={compare3year} />
        </div>
        <div className="w-1/3">
          <AreaProgressChart numberByTitle={numberByTitle} />
        </div>
      </div>
      <div className="mt-5">
        <RankingStudentTable data={data} />
      </div>
    </div>
  )
}
