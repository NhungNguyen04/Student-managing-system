'use client'

import React, { useMemo, useState } from "react"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table"
import { CSVLink } from "react-csv"
import { FaFileImport } from "react-icons/fa6"
import { toast } from "react-toastify"
import { subjectApi } from "@/apis"
import { StudentProfileView } from "./student-profile-view"
import { ScoreView } from "./score-view"
import { ScoreInsert } from "./score-insert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { List, Info, Pencil, FileSpreadsheet } from 'lucide-react'

interface Student {
  id: string
  studentId: string
  student: {
    studentname: string
    gender: string
    User: {
      email: string
      image: string
    }
  }
}

interface StudentTableProps {
  data: Student[]
  gradename: string
  subjectname: string
  subjectId: string
  classId: string
}

export function TeacherStudentTable({ data, gradename, subjectname, subjectId, classId }: StudentTableProps) {
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [isOpenStudentProfileView, setOpenStudentProfileView] = useState(false)
  const [isOpenScoreView, setOpenScoreView] = useState(false)
  const [isOpenScoreEdit, setOpenScoreEdit] = useState(false)

  const searchInput = columnFilters.find((f) => f.id === "studentname")?.value || ""

  const onFilterChange = (id: string, value: any) =>
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({
        id,
        value,
      })
    )

  const importScoreByExcelFile = async (data: any) => {
    try {
      await subjectApi.createScoreByExcel(data)
      toast.success("Scores imported successfully")
    } catch (error) {
      toast.error("Failed to import scores")
    }
  }

  const getExportData = () => {
    const headers = [
      "studentId",
      "Student Name",
      "subjectId",
      "subjectname",
      "classId",
      "fifteen_1",
      "fifteen_2",
      "fifteen_3",
      "fifteen_4",
      "fourtyFive_1",
      "fourtyFive_2",
      "finalExam",
      "teacherComment",
    ]

    const csvData = data.map((item) => [
      item.studentId,
      item.student.studentname,
      subjectId,
      subjectname,
      classId,
      "", "", "", "", "", "", "", ""
    ])

    return [headers, ...csvData]
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file extension instead of type
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (fileExtension !== 'csv') {
      toast.error("Only CSV files are accepted!")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const rows = content.split('\n').map(row => row.split(',').map(cell => cell.trim()))
      
      if (rows.length < 2) {
        toast.error("No data found in the file!")
        return
      }

      const headers = rows[0]
      const expectedHeaders = [
        "studentId", "Student Name", "subjectId", "subjectname", "classId",
        "fifteen_1", "fifteen_2", "fifteen_3", "fifteen_4",
        "fourtyFive_1", "fourtyFive_2", "finalExam", "teacherComment"
      ]

      if (!expectedHeaders.every((header, index) => header === headers[index])) {
        toast.error("Wrong file format!")
        return
      }

      const result = rows.slice(1).map(row => ({
        studentId: row[0],
        classId: row[4],
        subjectId: row[2],
        fifteen_1: row[5],
        fifteen_2: row[6],
        fifteen_3: row[7],
        fifteen_4: row[8],
        fourtyFive_1: row[9],
        fourtyFive_2: row[10],
        finalExam: row[11],
        teacherComment: row[12],
      }))

      importScoreByExcelFile({ data: result })
    }
    reader.readAsText(file)
  }

  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: "id",
        header: "No.",
        cell: (info) => <span>{info.row.index + 1}</span>,
      },
      {
        accessorKey: "studentId",
        header: "Id",
      },
      {
        accessorKey: "student.studentname",
        header: "Name",
        cell: (info) => (
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={info.row.original.student.User.image || "/student.png"} alt={info.getValue() as string} />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div>
              <div>{info.getValue() as string}</div>
              <div className="text-sm text-muted-foreground">{info.row.original.student.User.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "student.gender",
        header: "Gender",
        cell: (info) => (info.getValue() === "1" ? "Male" : "Female"),
      },
      {
        id: "actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => {
              setSelectedStudentId(info.row.original.studentId)
              setOpenScoreView(true)
            }}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              setSelectedStudentId(info.row.original.studentId)
              setOpenStudentProfileView(true)
            }}>
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              setSelectedStudentId(info.row.original.studentId)
              setOpenScoreEdit(true)
            }}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        ),
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
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search students..."
          value={searchInput}
          onChange={(e) => onFilterChange("studentname", e.target.value)}
          className="max-w-sm"
        />
        <div className="space-x-2">
          <CSVLink
            data={getExportData()}
            filename={`${subjectname}_${gradename}_scores.csv`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <FileSpreadsheet className="mr-2" />
            Export
          </CSVLink>
          <label
            htmlFor="importcsv"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 cursor-pointer"
          >
            <FaFileImport className="mr-2" />
            Import
          </label>
          <input
            type="file"
            id="importcsv"
            hidden
            onChange={handleImport}
            accept=".csv"
          />
        </div>
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

      {selectedStudentId && (
        <>
          <StudentProfileView
            isOpen={isOpenStudentProfileView}
            onClose={() => setOpenStudentProfileView(false)}
            id={selectedStudentId}
          />
          <ScoreView
            isOpen={isOpenScoreView}
            onClose={() => setOpenScoreView(false)}
            id={selectedStudentId}
            gradename={gradename}
            subjectname={subjectname}
          />
          <ScoreInsert
            isOpen={isOpenScoreEdit}
            onClose={() => setOpenScoreEdit(false)}
            id={selectedStudentId}
            gradename={gradename}
            subjectId={subjectId}
            classId={classId}
            subjectname={subjectname}
          />
        </>
      )}
    </div>
  )
}

