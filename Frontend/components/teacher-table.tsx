import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, Pencil, Trash2, MoreHorizontal, ArrowUpDown } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { TeacherDelete } from "./teacher-delete"
import { TeacherView } from "./teacher-view"
import { TeacherEdit } from "./teacher-edit"

interface Teacher {
  id: string
  teachername: string
  birthDate: string
  startDate: string
  gender: string
  subject: { subjectname: string }
  User: { email: string; image: string | null }
}

interface TeacherTableProps {
  data: Teacher[]
  setCheckReLoading: (value: boolean) => void
}

export function TeacherTable({ data, setCheckReLoading }: TeacherTableProps) {
  const [sorting, setSorting] = useState<any[]>([])
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [isOpenTeacherDelete, setIsOpenTeacherDelete] = useState<boolean>(false)
  const [isOpenTeacherView, setIsOpenTeacherView] = useState<boolean>(false)
  const [isOpenTeacherEdit, setIsOpenTeacherEdit] = useState<boolean>(false)
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "teachername",
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Giáo viên
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }: { row: any }) => {
        const teacher = row.original
        return (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={teacher.User.image || "/teacher.png"} alt={teacher.teachername} />
              <AvatarFallback>{teacher.teachername.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{teacher.teachername}</div>
              <div className="text-sm text-muted-foreground">{teacher.User.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "birthDate",
      header: "Ngày sinh",
      cell: ({ row }: { row: any }) => {
        return new Date(row.getValue("birthDate")).toLocaleDateString("vi-VN")
      },
    },
    {
      accessorKey: "startDate",
      header: "Ngày bắt đầu",
      cell: ({ row }: { row: any }) => {
        return new Date(row.getValue("startDate")).toLocaleDateString("vi-VN")
      },
    },
    {
      accessorKey: "gender",
      header: "Giới tính",
      cell: ({ row }: { row: any }) => {
        const gender = row.getValue("gender")
        return gender === "1" ? "Nam" : gender === "0" ? "Nữ" : "Khác"
      },
    },
    {
      accessorKey: "subject.subjectname",
      header: "Môn học",
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const teacher = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(teacher.id)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(teacher.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(teacher.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleView = (id: string) => {
    setSelectedTeacherId(id)
    setIsOpenTeacherView(true)
  }

  const handleEdit = (id: string) => {
    setSelectedTeacherId(id)
    setIsOpenTeacherEdit(true)
  }

  const handleDelete = (id: string) => {
    setSelectedTeacherId(id)
    setIsOpenTeacherDelete(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter teachers..."
          value={(table.getColumn("teachername")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("teachername")?.setFilterValue(event.target.value)
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
      {selectedTeacherId && (
        <>
          <TeacherView
            isOpenTeacherView={isOpenTeacherView}
            closeTeacherView={() => setIsOpenTeacherView(false)}
            id={selectedTeacherId}
          />
          <TeacherEdit
            isOpenTeacherEdit={isOpenTeacherEdit}
            closeTeacherEdit={() => setIsOpenTeacherEdit(false)}
            id={selectedTeacherId}
            checkReLoading={false}
            setCheckReLoading={setCheckReLoading}
          />
          <TeacherDelete
            isOpenTeacherDelete={isOpenTeacherDelete}
            closeTeacherDelete={() => setIsOpenTeacherDelete(false)}
            id={selectedTeacherId}
            checkReLoading={false}
            setCheckReLoading={setCheckReLoading}
          />
        </>
      )}
    </div>
  )
}

