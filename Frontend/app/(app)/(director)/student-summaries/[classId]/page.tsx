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

  const handlePrevious = () => {
    router.push("/classes")
  }

  const fetchAllSummariesByClassId = async () => {
    try {
      const res = await classApi.getAllSummariesByClassId(params.classId)
      if (res.EC === 0) {
        setData(res.DT)
        setClassName(res.DT[0].class.classname)
        toast({
          title: "Success",
          description: "Fetched list successfully!!!",
        })
      } else {
        toast({
          title: "Error",
          description: res.EM,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching summaries:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching data",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAllSummariesByClassId()
  }, [params.classId])

  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: "id",
        header: "No.",
        cell: ({ row }) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: "student.studentname",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={row.original.student.User.image || "/student.png"} alt="Student" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.student.studentname}</div>
              <div className="text-sm text-muted-foreground">{row.original.student.User.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "class.classname",
        header: "Class",
      },
      {
        accessorKey: "concludebehaviorpoint",
        header: "Behavioral Points",
      },
      {
        accessorKey: "concludetitle",
        header: "Title",
      },
      {
        accessorKey: "concludecore",
        header: "GPA",
      },
    ],
    []
  )

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Scores</h1>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <h2 className="text-xl font-semibold">Year: {classname}</h2>
        <h2 className="text-xl font-semibold">Summaries</h2>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <Button variant="ghost" size="sm" onClick={header.column.getToggleSortingHandler()}>
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

