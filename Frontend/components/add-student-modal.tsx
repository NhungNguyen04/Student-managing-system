'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { studentApi, summaryApi } from "@/apis"
import { AddStudentTable } from '@/components/add-student-table'

interface AddStudentModalProps {
  isOpenAddStudent: boolean
  closeAddStudentModal: () => void
  classId: string
}

export function AddStudentModal({ isOpenAddStudent, closeAddStudentModal, classId }: AddStudentModalProps) {
  const [data, setData] = useState<any[]>([])
  const [checkValue, setCheckValue] = useState<string[]>([])

  const handleSetCheckValue = (checked: boolean, id: string) => {
    if (checked) {
      setCheckValue((prev) => [...prev, id])
    } else {
      setCheckValue((prev) => prev.filter((value) => value !== id))
    }
  }

  const handleCreateList = async () => {
    try {
      const listStudent = { data: checkValue }
      const res = await summaryApi.createSummaries(classId, listStudent)
      if (res.EC === 1) {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.EM,
        })
      } else {
        toast({
          title: "Success",
          description: "Thêm thành công!",
        })
      }
      setCheckValue([])
      closeAddStudentModal()
    } catch (error) {
      console.error("Error creating summaries:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    }
  }

  const fetchAllStudentNotInClass = async () => {
    try {
      console.log('classId', classId); 
      const res = await studentApi.getAllStudentNotInClass(classId)
      console.log("student not in class", res);
      setData(res.DT)
    } catch (error) {
      console.error("Error fetching students:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch students",
      })
    }
  }

  useEffect(() => {
    fetchAllStudentNotInClass()
  }, [classId])

  return (
    <Dialog open={isOpenAddStudent} onOpenChange={closeAddStudentModal}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Students to Class</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] overflow-y-auto">
          <AddStudentTable handleSetCheckValue={handleSetCheckValue} data={data} />
        </div>
        <DialogFooter>
          <Button onClick={handleCreateList}>Thêm</Button>
          <Button variant="outline" onClick={closeAddStudentModal}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

