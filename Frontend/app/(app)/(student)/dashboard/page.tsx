'use client'
import { StudentSummariesTable } from "@/components/student-summaries-table";
import dashboardApi from "@/apis/dashboard";
import React, { useEffect,useState } from "react";
import gradeApi from "@/apis/grade";
import BarchartCompareGpaStudent from "@/components/compare-gpa-student-chart";
import { BarchartCompareGpaClass } from "@/components/compare-gpa-class-chart";
import { Dropdown } from "@/components/dropdown";

import { Bar } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const terms = [
  {
    id: 1,
    name: "1",
  },
  {
    id: 2,
    name: "2",
  },
]

export default function StudentDashboard() {
  
  const [compare3year, setCompare3Year] = useState("")
  const [compareClass, setCompareClass] = useState()
  const [selectYear, setSelectYear] = useState<number | null>(null)
  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [term, setTerm] = useState("1")
  const studentId = localStorage.getItem("studentId")
  
  function maxGradeYear(year:any) {
    
    let maxYear = year[0].year
    for (let i = 0; i < year.length; i++) {
      if (year[i].year > maxYear) maxYear = year[i].year
    }
    return maxYear
  }
  const changeTerm = (gradename:any) => {
    setTerm(gradename)
  }
  const fetchECompare3Year = async () => {
    let getData = await dashboardApi.getGpaOfOneStudent(studentId)
    if (getData.EC != 1) {
      setCompare3Year(getData.DT)
    }
  }
  const fetchCompareGpaOfClass = async () => {
    let getData = await dashboardApi.getCompareGpaOfClass(studentId, term, selectYear)
    if (getData.EC != 1) {
      setCompareClass(getData.DT)
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
    if (selectYear != null) {
      fetchECompare3Year()
      fetchCompareGpaOfClass()
    }
  }, [selectYear, term])

    return (
      <div className ="w-screen flex flex-col" >
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
          <p>Welcome to your student dashboard. Here you can view your courses and grades.</p>
        </div>
        <div className="flex flex-col">
          <div className="w-4/5 m-3 border-[1px] border-black rounded-sm">
            <StudentSummariesTable id={studentId?studentId:'0'}>
              
            </StudentSummariesTable>
          </div>


          <div className="m-3 flex items-center">
            <Select value={term} onValueChange={changeTerm}>
              <SelectTrigger className="w-[5vw] bg-white mr-3">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {terms.map((option) => (
                  <SelectItem key={option.id} value={option.name}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dropdown selectYear={selectYear} setSelectYear={(year) => setSelectYear(year)}  type={null} />
            
          </div>
          <div className="flex flex-row w-4/5  ml-3 mb-10">
            <div className=" w-1/3 mr-4 border-[1px] border-black rounded-sm">
              <BarchartCompareGpaStudent compare3year={compare3year}/>
            </div>

            <div className="w-2/3 border-[1px] border-black rounded-sm">
              <BarchartCompareGpaClass compareClass={compareClass}/>
            </div>
          </div>
         </div>

         
      </div>
    )
  }