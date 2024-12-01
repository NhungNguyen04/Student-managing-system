'use client'

import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Search } from 'lucide-react'

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
import AddAssignmentModal from "./add-assignment-modal"

interface Assignment {
  id: string
  class: { classname: string }
  subject: { subjectname: string }
  teacher?: { teacherName: string }
  subjectId: string
  classId: string
  teacherId: string | null
}

interface AssignmentTableProps {
  data: Assignment[]
  checkReLoading: boolean
  setCheckReLoading: (value: boolean) => void
}

export function AssignmentTable({ data, checkReLoading, setCheckReLoading }: AssignmentTableProps) {
  const [columnFilters, setColumnFilters] = useState<{ id: string; value: any }[]>([])
  const [checkId, setCheckId] = useState<string | null>(null)
  const [isOpenAddTuitionModal, setIsOpenAddTuitionModal] = useState(false)

  const closeAddTuitionModal = () => setIsOpenAddTuitionModal(false)
  const openAddTuitionModal = (id: string) => {
    setCheckId(id)
    setIsOpenAddTuitionModal(true)
  }

  const columns: ColumnDef<Assignment>[] = [
    {
      accessorKey: "id",
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: "class.classname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Lớp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "subject.subjectname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Môn học
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "teacher.teacherName",
      header: "Giáo viên",
      cell: ({ row }) => (
        <div>
          {row.original.teacher ? row.original.teacher.teacherName : "Null"}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button onClick={() => openAddTuitionModal(row.original.id)}>
          Add / Edit
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search classes..."
          value={(table.getColumn("class.classname")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("class.classname")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
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
      {checkId && (
        <AddAssignmentModal
          isOpen={isOpenAddTuitionModal}
          onClose={closeAddTuitionModal}
          checkReLoading={checkReLoading}
          setCheckReLoading={setCheckReLoading}
          assignment={data.find((item) => item.id === checkId)!}
        />
      )}
    </div>
  )
}

