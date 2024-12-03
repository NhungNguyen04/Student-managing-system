"use client"
import React, { useEffect, useState } from "react"
import { teacherApi } from "@/apis"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { TeacherTable } from "@/components/teacher-table"
import { OnlyAddTeacherModal } from "@/components/only-add-teacher-modal"
import { toast } from "@/hooks/use-toast"

interface Teacher {
  id: string
  teachername: string
  birthDate: string
  startDate: string
  gender: string
  subject: { subjectname: string }
  User: { email: string; image: string | null }
}

export default function Teacher() {
  const [data, setData] = useState<Teacher[]>([])
  const [checkReLoading, setCheckReLoading] = useState(false)
  const [isOpenOnlyAddTeacherModal, setIsOpenOnlyAddTeacherModal] = useState(false)

  const fetchAllTeacher = async () => {
    try {
      const res = await teacherApi.getAllTeacher()
      if (res.EC !== 1) {
        setData(res.DT)
        toast({
          title: "Success",
          description: "Lấy danh sách thành công!!!",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.EM,
        })
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch teachers",
      })
    }
  }

  useEffect(() => {
    fetchAllTeacher()
  }, [checkReLoading])

  const openOnlyAddTeacherModal = () => {
    setIsOpenOnlyAddTeacherModal(true)
  }

  const closeOnlyAddTeacherModal = () => {
    setIsOpenOnlyAddTeacherModal(false)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <Button onClick={openOnlyAddTeacherModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Teacher
        </Button>
      </div>
      <TeacherTable data={data} setCheckReLoading={setCheckReLoading} />
      <OnlyAddTeacherModal
        isOpen={isOpenOnlyAddTeacherModal}
        onClose={closeOnlyAddTeacherModal}
        setCheckReLoading={setCheckReLoading}
      />
    </div>
  )
}
