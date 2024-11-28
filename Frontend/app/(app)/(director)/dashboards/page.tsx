'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { dashboardApi, gradeApi } from "@/apis"

export default function Dashboard() {
  const [data, setData] = useState<any>([])
  const [compare3year, setCompare3Year] = useState<any>([])
  const [selectYear, setSelectYear] = useState<number | "">("")
  const [numberByTitle, setNumberByTitle] = useState<any>([])
  const [excellentStudents, setExcellentStudents] = useState<any>([])
  const [years, setYears] = useState<number[]>([])

  useEffect(() => {
    fetchAllYear()
  }, [])

  useEffect(() => {
    if (selectYear !== "") {
      fetchExcellentStudent()
      fetchECompare3Year()
      fetchTop10Students()
      fetchNumberOfStudentByTitle()
    }
  }, [selectYear])

  const fetchAllYear = async () => {
    let year = await gradeApi.getAllYear()
    if (year.DT) {
      const allYears = year.DT.map((y: { year: number }) => y.year)
      setYears(allYears)
      const maxYear = Math.max(...allYears)
      setSelectYear(maxYear)
    }
  }

  const fetchExcellentStudent = async () => {
    let getData = await dashboardApi.getExcellentStudent(selectYear)
    if (getData.EC !== 1) {
      setExcellentStudents(getData.DT)
    }
  }

  const fetchTop10Students = async () => {
    let getData = await dashboardApi.getTop10Students(selectYear)
    if (getData.EC !== 1) {
      setData(getData.DT)
    }
  }

  const fetchNumberOfStudentByTitle = async () => {
    let getData = await dashboardApi.getNumberOfStudentsWithType(selectYear)
    if (getData.EC !== 1) {
      setNumberByTitle(getData.DT)
    }
  }

  const fetchECompare3Year = async () => {
    let getData = await dashboardApi.getCompare3year(selectYear)
    if (getData.EC !== 1) {
      setCompare3Year(getData.DT)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="mb-6">
        <Select value={selectYear.toString()} onValueChange={(value) => setSelectYear(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Excellent Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{excellentStudents.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students by Title</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={numberByTitle}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3 Year Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={compare3year}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="excellent" fill="#8884d8" />
                <Bar dataKey="good" fill="#82ca9d" />
                <Bar dataKey="average" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((student: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

