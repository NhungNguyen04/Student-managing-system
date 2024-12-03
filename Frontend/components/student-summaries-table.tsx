"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from 'lucide-react'
import { SummariesStudent } from "./summaries-student"
import { Overall } from "./overall"

const grades = [
  { id: 1, name: "10" },
  { id: 2, name: "11" },
  { id: 3, name: "12" },
]

export function StudentSummariesTable({ id }: { id: string }) {
  const [data, setData] = useState([])
  const [grade, setGrade] = useState("10")
  const [dataTerm1, setDataTerm1] = useState<any[]>([])
  const [dataTerm2, setDataTerm2] = useState<any[]>([])
  const [birthDay, setBirthDay] = useState("")
  const [startDay, setStartDay] = useState("")

  const router = useRouter()

  function convertDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB")
  }

  const fetchAllOverallByGrade = async () => {
    try {
      const res = await fetch(`/api/summaries/${id}?grade=${grade}`)
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
      } else {
        setData(data.subjects)
      }
    } catch (error) {
      toast.error("An error occurred while fetching data")
    }
  }

  const fetchAllSummariesByTerm = async (term: number) => {
    try {
      const res = await fetch(`/api/summaries/${id}?grade=${grade}&term=${term}`)
      const data = await res.json()
      if (data.error) {
        toast.error(data.error)
      } else {
        if (term === 1) {
          setDataTerm1(data)
          setBirthDay(convertDate(data[0]?.student.birthDate))
          setStartDay(convertDate(data[0]?.student.startDate))
        } else {
          setDataTerm2(data)
        }
      }
    } catch (error) {
      toast.error("An error occurred while fetching data")
    }
  }

  useEffect(() => {
    fetchAllOverallByGrade()
    fetchAllSummariesByTerm(1)
    fetchAllSummariesByTerm(2)
  }, [grade, id])

  return (
    <div className="mb-0 ml-14 flex h-screen flex-col overflow-y-auto pr-14">
      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">Điểm số</h2>
        </div>
        <Select value={grade} onValueChange={setGrade}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((option) => (
              <SelectItem key={option.id} value={option.name}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {dataTerm1 && dataTerm1[0] && (
        <Card className="mt-10">
          <CardContent className="flex items-center p-6">
            {dataTerm1[0].student.User.image ? (
              <img
                className="mr-10 h-40 w-40 rounded-full object-cover"
                src={dataTerm1[0].student.User.image}
                alt="Student"
              />
            ) : (
              <Avatar className="mr-10 h-40 w-40" />
            )}
            <div className="flex flex-1 flex-col">
              <h3 className="text-4xl font-bold">{dataTerm1[0].student.studentname}</h3>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-2">
                  <p><strong>Email:</strong> {dataTerm1[0].student.User.email}</p>
                  <p><strong>Lớp:</strong> {dataTerm1[0].class.classname}</p>
                  <p><strong>Khối:</strong> {grade}</p>
                  <p><strong>Năm:</strong> {dataTerm1[0].class.grade.year}</p>
                </div>
                <div className="rounded-lg border p-2">
                  <p><strong>Địa chỉ:</strong> {dataTerm1[0].student.address}</p>
                  <p><strong>Giới tính:</strong> {dataTerm1[0].student.gender === 1 ? "Nam" : "Nữ"}</p>
                  <p><strong>Ngày sinh:</strong> {birthDay}</p>
                  <p><strong>Ngày nhập học:</strong> {startDay}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="term1" className="mt-10">
        <TabsList>
          <TabsTrigger value="term1">HKI</TabsTrigger>
          <TabsTrigger value="term2">HKII</TabsTrigger>
          <TabsTrigger value="overall">Cả năm</TabsTrigger>
        </TabsList>
        <TabsContent value="term1">
          {dataTerm1 && dataTerm1.map((item, index) => (
            <SummariesStudent
              key={index}
              data={[item]}
              listSubjectResult={item.summaries[0].subjectresults}
            />
          ))}
        </TabsContent>
        <TabsContent value="term2">
          {dataTerm2 && dataTerm2.map((item, index) => (
            <SummariesStudent
              key={index}
              data={[item]}
              listSubjectResult={item.summaries[0].subjectresults}
            />
          ))}
        </TabsContent>
        <TabsContent value="overall">
          {data && <Overall listSubjectResult={data} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

