'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import httpClient from "@/lib/httpClient"
import { ScoreView } from './score-view'
import { summaryApi } from '@/apis'

interface ScoreInsertProps {
  isOpen: boolean
  onClose: () => void
  id: string
  subjectId: string
  classId: string
  subjectname: string
  gradename: string
}

export function ScoreInsert({ isOpen, onClose, id, subjectId, classId, subjectname, gradename }: ScoreInsertProps) {
  const [fifteen1, setFifteen1] = useState('0')
  const [fifteen2, setFifteen2] = useState('0')
  const [fifteen3, setFifteen3] = useState('0')
  const [fifteen4, setFifteen4] = useState('0')
  const [fortyFive1, setFortyFive1] = useState('0')
  const [fortyFive2, setFortyFive2] = useState('0')
  const [finalExam, setFinalExam] = useState('0')
  const [isScoreViewOpen, setIsScoreViewOpen] = useState(false)

  

  useEffect(() => {
    if (isOpen) {
    }
  }, [isOpen, id, subjectId, classId])

  const handleSave = async () => {
    const data = {
      classId,
      studentId: id,
      fifteen_1: Number(fifteen1),
      fifteen_2: Number(fifteen2),
      fifteen_3: Number(fifteen3),
      fifteen_4: Number(fifteen4),
      fourtyFive_1: Number(fortyFive1),
      fourtyFive_2: Number(fortyFive2),
      finalExam: Number(finalExam),
      subjectId
    }

    try {
      const res = await httpClient.post("/subject-result/input-subject-result", data)
      if (res.EC === 0) {
        toast.success("Score updated successfully")
      } else {
        toast.error("Can't update socre")
      }
    } catch (error) {
      console.error('Error occurred:', error)
      toast.error("An error happened. Please try again!")
    }
  }

  const handleOpenScoreView = () => {
    setIsScoreViewOpen(true)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert score - ID: {id}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fifteen1" className="text-right">Fifteen 1</Label>
              <Input
                id="fifteen1"
                value={fifteen1}
                onChange={(e) => setFifteen1(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fifteen2" className="text-right">Fifteen 2</Label>
              <Input
                id="fifteen2"
                value={fifteen2}
                onChange={(e) => setFifteen2(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fifteen3" className="text-right">Fifteen 3</Label>
              <Input
                id="fifteen3"
                value={fifteen3}
                onChange={(e) => setFifteen3(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fifteen4" className="text-right">Fifteen 4</Label>
              <Input
                id="fifteen4"
                value={fifteen4}
                onChange={(e) => setFifteen4(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fortyFive1" className="text-right">Forty-Five 1</Label>
              <Input
                id="fortyFive1"
                value={fortyFive1}
                onChange={(e) => setFortyFive1(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fortyFive2" className="text-right">Forty-Five 2</Label>
              <Input
                id="fortyFive2"
                value={fortyFive2}
                onChange={(e) => setFortyFive2(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="finalExam" className="text-right">Final Exam</Label>
              <Input
                id="finalExam"
                value={finalExam}
                onChange={(e) => setFinalExam(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={handleOpenScoreView}>View</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {isScoreViewOpen && (
        <ScoreView
          isOpen={isScoreViewOpen}
          onClose={() => setIsScoreViewOpen(false)}
          id={id}
          gradename={gradename}
          subjectname={subjectname}
        />
      )}
    </>
  )
}

