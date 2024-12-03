'use client'

import React, { useMemo, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown, Info } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StudentProfileView } from "./student-profile-view"

interface Student {
  id: string
  studentname: string
  email: string
  gender: string
  image: string | null
}

interface AddStudentTableProps {
  data: Student[]
  handleSetCheckValue: (checked: boolean, id: string) => void
}

export function AddStudentTable({ data, handleSetCheckValue }: AddStudentTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false)
  const [columnFilters, setColumnFilters] = useState<any[]>([])

  const columns: ColumnDef<Student>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => {
              row.toggleSelected(!!checked)
              handleSetCheckValue(!!checked, row.original.id)
            }}
            aria-label="Select row"
            value={row.original.id}
          />
        ),
      },
      {
        accessorKey: "id",
        header: "Id",
      },
      {
        accessorKey: "studentname",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Họ và Tên
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const student = row.original
          return (
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={student.image || "/student.png"} alt={student.studentname} />
                <AvatarFallback>{student.studentname.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>{student.studentname}</span>
                <span className="text-xs text-muted-foreground">{student.email}</span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "gender",
        header: "Giới tính",
        cell: ({ row }) => (
          <div>{row.original.gender === "1" ? "Nam" : "Nữ"}</div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedId(row.original.id)
              setIsProfileViewOpen(true)
            }}
          >
            <Info className="h-4 w-4" />
          </Button>
        ),
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

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search students..."
        value={(table.getColumn("studentname")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("studentname")?.setFilterValue(event.target.value)
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
      {isProfileViewOpen && selectedId && (
        <StudentProfileView
          isOpen={isProfileViewOpen}
          onClose={() => setIsProfileViewOpen(false)}
          id={selectedId}
        />
      )}
    </div>
  )
}

