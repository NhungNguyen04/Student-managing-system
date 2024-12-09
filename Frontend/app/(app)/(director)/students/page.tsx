'use client'

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from 'next/navigation'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Edit, Info, List, Search, Trash2, UserPlus, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { studentApi, gradeApi } from "@/apis"
import { OnlyAddStudentModal } from '@/components/only-add-student-modal'
import { StudentProfileView } from '@/components/student-profile-view'
import { EditStudent } from '@/components/edit-student-modal'
import { DeleteStudent } from '@/components/delete-student-modal'
import { ExcelUploadModal } from '@/components/excel-upload-modal'
import { Dropdown } from "@/components/dropdown"

export default function StudentManagement() {
  const router = useRouter()
  const [classCount, setClassCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)
  const [data, setData] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [checkReload, setCheckReload] = useState(false)
  const [isOpenAddStudent, setIsOpenAddStudent] = useState(false)
  const [isOpenProfileView, setIsOpenProfileView] = useState(false)
  const [isOpenEditStudent, setIsOpenEditStudent] = useState(false)
  const [isOpenDeleteStudent, setIsOpenDeleteStudent] = useState(false)
  const [selectYear, setSelectYear] = useState<number | null>(null)
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [isOpenExcelUpload, setIsOpenExcelUpload] = useState(false)

  const fetchAllStudent = async () => {
    try {
      const res = await studentApi.getAllStudent()
      if (res.EC === 1) {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.EM,
        })
      } else {
        const uniqueStudents = new Set()
        const uniqueClasses = new Set()
        res.DT.forEach((student: any) => {
          if (selectYear === undefined || student.year === selectYear) {
            uniqueStudents.add(student.studentname)
            uniqueClasses.add(student.classname)
          }
        })
        setClassCount(uniqueClasses.size)
        setStudentCount(uniqueStudents.size)
        setData(res.DT)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch student data",
      })
    }
  }

  useEffect(() => {
    fetchAllStudent()
  }, [checkReload, selectYear, isOpenAddStudent, isOpenEditStudent])

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "studentname",
        header: ({ column }: any) => {
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
        cell: ({ row }: any) => {
          const student = row.original
          return (
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={student.User.image || "student.png"} alt={student.studentname} />
                <AvatarFallback>{student.studentname.charAt(0)}</AvatarFallback>
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
        accessorKey: "gradename",
        header: "Grade",
      },
      {
        accessorKey: "classname",
        header: "Class",
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }: any) => (
          <div>{row.original.gender === "1" ? "Male" : "Female"}</div>
        ),
      },
      {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }: any) => (
          <div>
            {row.original.year === "null" 
              ? new Date(row.original.startDate).getFullYear()
              : row.original.year
            }
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }: any) => {
          const student = row.original
          return (
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => handleViewTranscript(student.id, student.studentname)}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleViewProfile(student.id)}>
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleEditStudent(student.id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        },
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
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  })

  const handleViewTranscript = (id: string, name: string) => {
    router.push(`/student-summaries/${id}?name=${encodeURIComponent(name)}`)
  }

  const handleViewProfile = (id: string) => {
    setSelectedId(id)
    setIsOpenProfileView(true)
  }

  const handleEditStudent = (id: string) => {
    setSelectedId(id)
    setIsOpenEditStudent(true)
  }

  const handleDeleteStudent = (id: string) => {
    setSelectedId(id)
    setIsOpenDeleteStudent(true)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {[10, 11, 12].map((grade) => (
            <Button
              key={grade}
              variant={columnFilters.some(f => f.id === 'gradename' && f.value?.includes(grade)) ? "default" : "outline"}
              onClick={() => {
                setColumnFilters((prev) => {
                  const gradeFilter = prev.find((f) => f.id === 'gradename')
                  if (!gradeFilter) {
                    return [...prev, { id: 'gradename', value: [grade] }]
                  }
                  const newValue = gradeFilter.value?.includes(grade)
                    ? gradeFilter.value.filter((v: number) => v !== grade)
                    : [...gradeFilter.value, grade]
                  return prev.map((f) => f.id === 'gradename' ? { ...f, value: newValue } : f)
                })
              }}
            >
              Grade {grade}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Search students..."
          value={(table.getColumn("studentname")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("studentname")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <Card>
            <CardContent className="flex items-center justify-center h-20">
              <p className="text-xl font-medium">Students count: {studentCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-center h-20">
              <p className="text-xl font-medium">Classes count : {classCount}</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center space-x-4">
        <Dropdown selectYear={selectYear} setSelectYear={setSelectYear} type="filterAll"/>
          <Button onClick={() => setIsOpenExcelUpload(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Excel
          </Button>
          <Button onClick={() => setIsOpenAddStudent(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add student
          </Button>
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
      {isOpenAddStudent && (
        <OnlyAddStudentModal
          isOpen={isOpenAddStudent}
          onClose={() => setIsOpenAddStudent(false)}
          year={selectYear ?? 0}
        />
      )}
      {isOpenProfileView && (
        <StudentProfileView
          isOpen={isOpenProfileView}
          onClose={() => setIsOpenProfileView(false)}
          id={selectedId}
        />
      )}
      {isOpenEditStudent && (
        <EditStudent
          isOpen={isOpenEditStudent}
          onClose={() => setIsOpenEditStudent(false)}
          id={selectedId}
          checkReloading={checkReload}
          setCheckReloading={setCheckReload}
        />
      )}
      {isOpenDeleteStudent && (
        <DeleteStudent
          isOpen={isOpenDeleteStudent}
          onClose={() => setIsOpenDeleteStudent(false)}
          id={selectedId}
          isStudentView={true}
          setCheckReloading={setCheckReload}
          checkReloading={checkReload}
        />
      )}
      {isOpenExcelUpload && (
        <ExcelUploadModal
          isOpen={isOpenExcelUpload}
          onClose={() => setIsOpenExcelUpload(false)}
          onUploadSuccess={() => {
            setCheckReload(!checkReload)
          }}
        />
      )}
    </div>
  )
}

