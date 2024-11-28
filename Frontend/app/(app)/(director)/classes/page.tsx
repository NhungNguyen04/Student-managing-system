'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { classApi, gradeApi } from "@/apis"
import { DialogView } from "@/components/class-dialog-view"
import { AddClassModal } from "@/components/add-class-modal"

interface ClassData {
  id: string
  classname: string
  total: number
}

export default function Class() {
  const router = useRouter()
  const [checkId, setCheckId] = useState<string | null>(null)
  const [checkGrade, setCheckGrade] = useState<number | null>(null)
  const [checkReRender, setCheckReRender] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenAddClassModal, setOpenAddClassModal] = useState(false)
  const [selectYear, setSelectYear] = useState<number | null>(null)
  const [dataClassGrade10, setDataClassGrade10] = useState<ClassData[]>([])
  const [dataClassGrade11, setDataClassGrade11] = useState<ClassData[]>([])
  const [dataClassGrade12, setDataClassGrade12] = useState<ClassData[]>([])
  const [availableYears, setAvailableYears] = useState<number[]>([])

  const closeAddClassModal = () => setOpenAddClassModal(false)
  const openAddClassModal = (gradename: number) => {
    setOpenAddClassModal(true)
    setCheckGrade(gradename)
  }

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  const fetchAllClassByGradeAndYear = async (grade: number) => {
    if (!selectYear) return
    try {
      const getData = await classApi.getAllClassByGradeAndYear(grade, selectYear)
      switch (grade) {
        case 10:
          setDataClassGrade10(getData.DT)
          break
        case 11:
          setDataClassGrade11(getData.DT)
          break
        case 12:
          setDataClassGrade12(getData.DT)
          break
      }
    } catch (error) {
      console.error(`Error fetching classes for grade ${grade}:`, error)
    }
  }

  const fetchAllYear = async () => {
    try {
      const year = await gradeApi.getAllYear()
      if (year.DT) {
        const years = year.DT.map((y: { year: number }) => y.year)
        setAvailableYears(years)
        const maxYear = Math.max(...years)
        setSelectYear(maxYear)
      }
    } catch (error) {
      console.error("Error fetching years:", error)
    }
  }

  useEffect(() => {
    fetchAllYear()
  }, [])

  useEffect(() => {
    if (selectYear) {
      fetchAllClassByGradeAndYear(10)
      fetchAllClassByGradeAndYear(11)
      fetchAllClassByGradeAndYear(12)
      setLoading(true)
      toast({
        title: "Success",
        description: "Lấy danh sách lớp thành công!!!",
      })
    }
  }, [selectYear, checkReRender])

  const renderGradeSection = (grade: number, data: ClassData[]) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="bg-primary text-primary-foreground rounded-full px-4 py-2 mr-2">
          <p className="font-semibold">Khối {grade}</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => openAddClassModal(grade)}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(({ id, classname, total }) => (
          <Card key={id} className="cursor-pointer" onClick={() => {
            setCheckId(id)
            openModal()
          }}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{classname}</h3>
              <p>Total students: {total}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {checkId && isOpen && (
        <DialogView
          classId={checkId}
          isOpen={isOpen}
          closeModal={closeModal}
          nameclass={data.find(c => c.id === checkId)?.classname || ""}
          openModal={openModal}
          role="admin"
        />
      )}
      {isOpenAddClassModal && checkGrade === grade && (
        <AddClassModal
          isOpenAddClassModal={isOpenAddClassModal}
          closeAddClassModal={closeAddClassModal}
          year={selectYear || 0}
          gradename={String(grade)}
          setCheckReRender={setCheckReRender}
          checkReRender={checkReRender}
        />
      )}
    </div>
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Class Management</h1>
        <Select
          value={selectYear?.toString()}
          onValueChange={(value) => setSelectYear(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {renderGradeSection(10, dataClassGrade10)}
      {renderGradeSection(11, dataClassGrade11)}
      {renderGradeSection(12, dataClassGrade12)}
    </div>
  )
}

