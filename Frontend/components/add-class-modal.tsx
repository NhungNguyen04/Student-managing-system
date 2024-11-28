'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { gradeApi, classApi } from "@/apis"

interface AddClassModalProps {
  isOpenAddClassModal: boolean
  closeAddClassModal: () => void
  year: number
  gradename: string
  setCheckReRender: React.Dispatch<React.SetStateAction<boolean>>
  checkReRender: boolean
}

export function AddClassModal({
  isOpenAddClassModal,
  closeAddClassModal,
  year,
  gradename,
  setCheckReRender,
  checkReRender,
}: AddClassModalProps) {
  const [gradeId, setGradeId] = useState<string>("")
  const [classname, setClassname] = useState<string>("")

  const fetchAllGradeByYear = async () => {
    try {
      const res = await gradeApi.getAllGradeByYearService(year)
    const findGradeId: { id: string; gradename: string } | undefined = res.DT.find((grade: { id: number; gradename: string }) => grade.gradename === gradename)
      if (findGradeId) {
        setGradeId(findGradeId.id)
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Không thể lấy id khối",
      })
    }
  }

  useEffect(() => {
    fetchAllGradeByYear()
  }, [year, gradename])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = { classname, gradeId }
      const res = await classApi.createClass(data)
      if (res.EC !== 1) {
        toast({
          title: "Success",
          description: "Tạo lớp thành công!!!",
        })
        setCheckReRender(!checkReRender)
        setClassname("")
        closeAddClassModal()
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.EM,
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    }
  }

  return (
    <Dialog open={isOpenAddClassModal} onOpenChange={closeAddClassModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="classname" className="text-right">
                Tên lớp
              </Label>
              <Input
                id="classname"
                value={classname}
                onChange={(e) => setClassname(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Năm</Label>
              <Input value={year} disabled className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Khối</Label>
              <Input value={gradename} disabled className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Thêm</Button>
            <Button type="button" variant="outline" onClick={closeAddClassModal}>
              Hủy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

