'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clipboard, UserPlus, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { classApi } from "@/apis"
import { AddStudentModal } from './add-student-modal'
import { StudentTable } from './student-table'

interface DialogViewProps {
  isOpen: boolean
  closeModal: () => void
  nameclass: string
  classId: string
  openModal: () => void
  role: string
}

export function DialogView({ isOpen, closeModal, nameclass, classId, openModal, role }: DialogViewProps) {
  const [isOpenAddStudent, setIsOpenAddStudent] = useState(false)
  const [checkReloading, setCheckReloading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const router = useRouter()

  const closeAddStudentModal = () => {
    setIsOpenAddStudent(false)
    openModal()
  }

  const openAddStudentModal = () => {
    setIsOpenAddStudent(true)
  }

  const fetchAllStudentByClassId = async () => {
    try {
      const getData = await classApi.getAllStudentByClassId(classId)
      setData(getData.DT)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  useEffect(() => {
    fetchAllStudentByClassId()
  }, [isOpenAddStudent, checkReloading, classId])

  const handleSummariesClick = () => {
    router.push(`/list-summaries/${classId}`)
  }

  const handleExportClick = () => {
    const formattedData = data.map(student => ({
      id: student.id,
      studentId: student.student.id,
      studentName: student.student.studentname,
      birthDate: student.student.birthDate,
      gender: student.student.gender === "1" ? "Male" : "Female",
      email: student.student.User.email,
      address: student.student.address,
      className: student.class.classname,
      concludeCore: student.concludecore,
      concludeTitle: student.concludetitle,
      concludeBehaviorPoint: student.concludebehaviorpoint,
      createdAt: student.createdAt,
    }))
    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students")
    XLSX.writeFile(workbook, `class_${classId}_students.xlsx`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Class: {nameclass} (ClassId: {classId})</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center mb-4">
          {role === "admin" && (
            <>
              <Button onClick={handleSummariesClick} className="mr-2">
                <Clipboard className="mr-2 h-4 w-4" />
                Scores
              </Button>
              <Button onClick={openAddStudentModal} className="mr-2">
                <UserPlus className="mr-2 h-4 w-4" />
                Add student
              </Button>
              <Button onClick={handleExportClick}>
                <Download className="mr-2 h-4 w-4" />
                Export as Excel
              </Button>
            </>
          )}
        </div>
        <ScrollArea className="h-[500px]">
          <StudentTable
            checkReloading={checkReloading}
            setCheckReloading={setCheckReloading}
            role={role}
            data={data}
          />
        </ScrollArea>
        <DialogFooter>
          <Button onClick={closeModal}>Close</Button>
        </DialogFooter>
      </DialogContent>
      {isOpenAddStudent && (
        <AddStudentModal
          isOpenAddStudent={isOpenAddStudent}
          closeAddStudentModal={closeAddStudentModal}
          classId={classId}
        />
      )}
    </Dialog>
  )
}

