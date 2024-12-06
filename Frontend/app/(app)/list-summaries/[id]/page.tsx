'use client'

import React, { useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronLeft } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { classApi } from "@/apis"

interface Student {
  studentname: string
  User: {
    email: string
    image: string | null
  }
}

interface Summary {
  id: string
  student: Student
  class: {
    classname: string
  }
  concludebehaviorpoint: number
  concludetitle: string
  concludecore: number
}

export default function Summaries() {
  const [data, setData] = useState<Summary[]>([])
  const [classname, setClassName] = useState("")
  const router = useRouter()
  const { id: classId } = useParams()

  const handlePrevious = () => {
    router.push("/classes")
  }

  const fetchAllSummariesByClassId = async () => {
    try {
      const res = await classApi.getAllSummariesByClassId(classId as string)
      console.log("Response:", res)
      if (res.EM !== "success") {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.EM,
        })
      } else if (res.EM === "success") {
        toast({
          title: "Success",
          description: "Lấy danh sách thành công!!!",
        })
        setData(res.DT)
        if (res.DT.length > 0) {
          setClassName(res.DT[0].class.classname)
        }
        console.log("Data:", res.DT)
        console.log("Classname:", res.DT[0].class.classname)
      }
    } catch (error) {
      console.error("Error fetching summaries:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch summaries",
      })
    }
  }

  useEffect(() => {
    fetchAllSummariesByClassId()
  }, [classId])

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "STT",
        cell: ({ row }: { row: any }) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: "student.studentname",
        header: ({ column }: { column: any }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }: { row: any }) => {
          const student = row.original.student
          return (
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <img
                  src={student.User.image || "student.png"}
                  alt={student.studentname}
                  className="rounded-full object-cover"
                />
              </Avatar>
              <div className="flex flex-col">
                <span>{student.studentname}</span>
                <span className="text-xs text-muted-foreground">{student.User.email}</span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "class.classname",
        header: "Class",
      },
      {
        accessorKey: "concludebehaviorpoint",
        header: "Behavior Point",
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={handlePrevious} className="mr-4">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Grades</h1>
      </div>
      <div className="flex items-center mb-6">
        <h2 className="text-xl font-semibold mr-4">Class: {classname}</h2>
        <h2 className="text-xl font-semibold">Summaries</h2>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

