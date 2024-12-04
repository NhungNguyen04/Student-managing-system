'use client'

import React, { useMemo, useState } from "react"
import { useRouter } from 'next/navigation'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Edit, Info, List, Trash2 } from 'lucide-react'
import { Avatar } from "@/components/ui/avatar"
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
import { StudentProfileView } from './student-profile-view'
import { EditStudent } from './edit-student-modal'
import { DeleteStudent } from './delete-student-modal'

interface StudentTableProps {
  data: any[]
  role: string
  checkReloading: boolean
  setCheckReloading: React.Dispatch<React.SetStateAction<boolean>>
}

export function StudentTable({ data, role, checkReloading, setCheckReloading }: StudentTableProps) {
  const router = useRouter()
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [isOpenStudentProfileView, setOpenStudentProfileView] = useState(false)
  const [isOpenEditStudent, setOpenEditStudent] = useState(false)
  const [isOpenDeleteStudent, setOpenDeleteStudent] = useState(false)
  const [selectedId, setSelectedId] = useState<string>('')

  const handleClick = (id: string) => {
    router.push(`/summaries/my-transcript/${id}`)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "STT",
        cell: ({ row }: any) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: "studentId",
        header: "ID",
      },
      {
        accessorKey: "student.studentname",
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
          const student = row.original.student
          return (
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <img
                  src={student.User.image || "/student.png"}
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
        accessorKey: "student.gender",
        header: "Gender",
        cell: ({ row }: any) => (
          <div>{row.original.student.gender === "1" ? "Nam" : "Nữ"}</div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }: any) => {
          const student = row.original
          return (
            <div className="flex space-x-2">
              {(role === "admin" || role === "teacher") && (
                <Button variant="ghost" size="icon" onClick={() => handleClick(student.studentId)}>
                  <List className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => {
                setSelectedId(student.studentId)
                setOpenStudentProfileView(true)
              }}>
                <Info className="h-4 w-4" />
              </Button>
              {(role === "admin" || role === "teacher") && (
                <Button variant="ghost" size="icon" onClick={() => {
                  setSelectedId(student.studentId)
                  setOpenEditStudent(true)
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {role === "admin" && (
                <Button variant="ghost" size="icon" onClick={() => {
                  setSelectedId(student.studentId)
                  setOpenDeleteStudent(true)
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )
        },
      },
    ],
    [role]
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

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter names..."
        value={(table.getColumn("student.studentname")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("student.studentname")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
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
      {isOpenStudentProfileView && (
        <StudentProfileView
          isOpen={isOpenStudentProfileView}
          onClose={() => setOpenStudentProfileView(false)}
          id={selectedId}
        />
      )}
      {isOpenEditStudent && (
        <EditStudent
          isOpen={isOpenEditStudent}
          onClose={() => setOpenEditStudent(false)}
          id={selectedId}
          checkReloading={checkReloading}
          setCheckReloading={setCheckReloading}
        />
      )}
      {isOpenDeleteStudent && (
        <DeleteStudent
          isOpen={isOpenDeleteStudent}
          onClose={() => setOpenDeleteStudent(false)}
          id={selectedId}
          isStudentView={true}
          checkReloading={checkReloading}
          setCheckReloading={setCheckReloading}
        />
      )}
    </div>
  )
}

