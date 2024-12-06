'use client'

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { summaryApi } from "@/apis"
import { toast } from "react-toastify"
import { SubjectSummary } from "./subject-summary"
import { Overall } from "./overall"

interface ScoreViewProps {
  isOpen: boolean
  onClose: () => void
  id: string
  gradename: string
  subjectname: string
}

export function ScoreView({ isOpen, onClose, id, gradename, subjectname }: ScoreViewProps) {
  const [data, setData] = useState<any[]>([])
  const [dataTerm1, setDataTerm1] = useState<any>(null)
  const [dataTerm2, setDataTerm2] = useState<any>(null)
  const [birthDay, setBirthDay] = useState("")
  const [startDay, setStartDay] = useState("")

  const convertDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`
  }

  const fetchAllOverallByGrade = async () => {
    try {
      const res = await summaryApi.getSummariesById(id, gradename)
      if (res.EC !== 1) {
        const filteredSubjects = res.DT.subjects.filter(
          (subject: any) => subject.subjectname.toLowerCase() === subjectname.toLowerCase()
        )
        setData(filteredSubjects)
      } else {
        toast.error(res.EM)
      }
    } catch (error) {
      console.error("Error fetching overall data:", error)
      toast.error("Failed to fetch overall data")
    }
  }

  const fetchAllSummariesByTerm = async (term: number) => {
    try {
      const res = await summaryApi.getSummariesByIdAndGrade(id, gradename, term)
      if (res.EC !== 1) {
        const filteredData = res.DT.map((student: any) => ({
          ...student,
          summaries: student.summaries.map((summary: any) => ({
            ...summary,
            subjectresults: summary.subjectresults.filter(
              (subjectResult: any) => subjectResult.subject.subjectname.toLowerCase() === subjectname.toLowerCase()
            )
          }))
        }))
        if (term === 1) {
          setDataTerm1(filteredData)
          setBirthDay(convertDate(res.DT[0]?.student.birthDate))
          setStartDay(convertDate(res.DT[0]?.student.startDate))
        } else {
          setDataTerm2(filteredData)
        }
      } else {
        toast.error(res.EM)
      }
    } catch (error) {
      console.error(`Error fetching term ${term} data:`, error)
      toast.error(`Failed to fetch term ${term} data`)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAllSummariesByTerm(1)
      fetchAllSummariesByTerm(2)
      fetchAllOverallByGrade()
    }
  }, [isOpen, id, gradename, subjectname])

  const renderSummaryData = (data: any, term: string) => {
    return data ? (
      <SubjectSummary
        data={[data[0]]}
        listSubjectResult={data[0].summaries[0].subjectresults}
        term={term}
      />
    ) : null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Scores</DialogTitle>
        </DialogHeader>
        {dataTerm1 && (
          <Card className="mb-6">
            <CardContent className="flex items-center space-x-4 p-4">
              <Avatar className="h-24 w-24">
                <img
                  src={dataTerm1[0]?.student.User.image || "/student.png"}
                  alt={dataTerm1[0]?.student.studentname}
                />
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{dataTerm1[0]?.student.studentname}</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Email:</strong> {dataTerm1[0]?.student.User.email}</p>
                    <p><strong>Class:</strong> {dataTerm1[0]?.class.classname}</p>
                    <p><strong>Grade:</strong> {gradename}</p>
                    <p><strong>Year:</strong> {dataTerm1[0]?.class.grade.year}</p>
                  </div>
                  <div>
                    <p><strong>Address:</strong> {dataTerm1[0]?.student.address}</p>
                    <p><strong>Gender:</strong> {dataTerm1[0]?.student.gender === 1 ? "Male" : "Female"}</p>
                    <p><strong>Date of birth:</strong> {birthDay}</p>
                    <p><strong>Start date:</strong> {startDay}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <Tabs defaultValue="term1">
          <TabsList>
            <TabsTrigger value="term1">Term I</TabsTrigger>
            <TabsTrigger value="term2">Term II</TabsTrigger>
            <TabsTrigger value="overall">All year</TabsTrigger>
          </TabsList>
          <TabsContent value="term1">
            {renderSummaryData(dataTerm1, "I")}
          </TabsContent>
          <TabsContent value="term2">
            {renderSummaryData(dataTerm2, "II")}
          </TabsContent>
          <TabsContent value="overall">
            {data && <Overall listSubjectResult={data} />}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

