'use client'

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { classApi } from "@/apis"
import { StudentSummariesTable } from "@/components/student-summaries-table"

interface Student {
  id: string
  student: {
    studentname: string
    User: {
      email: string
      image: string | null
    }
  }
  class: {
    classname: string
  }
  concludebehaviorpoint: number
  concludetitle: string
  concludecore: number
}

export default function Summaries({ params }: { params: { classId: string } }) {
  const [data, setData] = useState<Student[]>([])
  const [classname, setClassName] = useState("")
  const router = useRouter()
  const studentId = params.classId;

  const handlePrevious = () => {
    router.push("/classes")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Scores</h1>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <h2 className="text-xl font-semibold">Summaries</h2>
      </div>
      <div className="rounded-md border">
        <StudentSummariesTable id={studentId}/>
      </div>
    </div>
  )
}

