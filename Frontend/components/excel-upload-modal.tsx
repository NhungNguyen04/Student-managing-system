'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { studentApi } from "@/apis"
import * as XLSX from 'xlsx'
import { Progress } from "@/components/ui/progress"

interface ExcelUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

export function ExcelUploadModal({ isOpen, onClose, onUploadSuccess }: ExcelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const parseExcelDate = (excelDate: number | string): Date => {
    if (typeof excelDate === 'number') {
      return new Date((excelDate - 25569) * 86400 * 1000)
    }
    return new Date(excelDate)
  }

  const processExcelData = async (data: any[]) => {
    let successCount = 0
    const totalStudents = data.length

    for (let i = 0; i < data.length; i++) {
      const student = data[i]
      const formData = new FormData()

      // Parse the birthDate correctly
      let birthDate
      if (typeof student.birthDate === 'number') {
        // Excel stores dates as numbers, so we need to convert it
        birthDate = new Date((student.birthDate - 25569) * 86400 * 1000)
      } else {
        birthDate = new Date(student.birthDate)
      }

      if (isNaN(birthDate.getTime())) {
        console.error(`Invalid birth date for student: ${student.name}`)
        continue
      }

      formData.append("studentname", student.name)
      formData.append("birthDate", birthDate.toISOString())
      formData.append("startDate", new Date().toISOString())
      formData.append("gender", student.gender === "Male" ? "1" : "2")
      formData.append("email", student.email)
      formData.append("address", student.address)
      
      try {
        const res = await studentApi.createStudent(formData)
        if (res.EC === 0) {
          successCount++
        } else {
          console.error(`Failed to create student: ${student.name}`, res.EM)
        }
      } catch (error) {
        console.error(`Error creating student: ${student.name}`, error)
      }

      setProgress(Math.round(((i + 1) / totalStudents) * 100))
    }

    return successCount
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload",
      })
      return
    }

    setIsUploading(true)
    setProgress(0)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Parse dates before processing
      const parsedData = jsonData.map((student: any) => ({
        ...student,
        birthDate: parseExcelDate(student.birthDate)
      }))

      const successCount = await processExcelData(parsedData)

      toast({
        title: "Success",
        description: `${successCount} out of ${jsonData.length} students added successfully`,
      })
      onUploadSuccess()
      onClose()
    } catch (error) {
      console.error("Error processing Excel file:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process Excel file",
      })
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Excel File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="excel-file"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && (
            <Progress value={progress} className="w-full" />
          )}
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

