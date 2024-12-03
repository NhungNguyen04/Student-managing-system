"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SummariesStudentProps {
  data: any[]
  listSubjectResult: any[]
}

export function SummariesStudent({ data, listSubjectResult }: SummariesStudentProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "STT",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorFn: (row) => `${row.subject.subjectname}`,
      id: "subjectname",
      header: "Môn",
    },
    {
      header: "ĐĐGtx",
      columns: [
        { accessorKey: "fifteenMinExam_1", header: "M1" },
        { accessorKey: "fifteenMinExam_2", header: "M2" },
        { accessorKey: "fifteenMinExam_3", header: "M3" },
        { accessorKey: "fifteenMinExam_4", header: "M4" },
      ],
    },
    {
      header: "ĐĐGgk",
      columns: [
        { accessorKey: "fortyFiveMinExam_1", header: "V1" },
        { accessorKey: "fortyFiveMinExam_2", header: "V2" },
      ],
    },
    { accessorKey: "finalTest", header: "ĐĐGck" },
    { accessorKey: "averageScore", header: "ĐTBM" },
    { accessorKey: "result", header: "Result" },
  ]

  const summaryColumns: ColumnDef<any>[] = [
    { accessorFn: (row) => `${row.summaries[0].gpa}`, header: "ĐTB" },
    { accessorFn: (row) => `${row.summaries[0].title}`, header: "Danh hiệu" },
    { accessorFn: (row) => `${row.summaries[0].behaviorpoint}`, header: "ĐĐG" },
  ]

  const table = useReactTable({
    data: listSubjectResult,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const summaryTable = useReactTable({
    data,
    columns: summaryColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="relative mb-10 mt-10 flex flex-col overflow-hidden bg-white p-0 shadow-xl">
      <div className="mt-10 flex items-center">
        <p className="ml-6 animate-fade-up text-2xl font-semibold animate-delay-[500ms]">
          Lớp: {data[0].class.classname}
        </p>
        <p className="ml-6 animate-fade-up text-2xl font-semibold animate-delay-[500ms]">Học bạ</p>
      </div>
      <div className="mt-3 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
      <div className="mt-10 overflow-auto">
        <Table>
          <TableHeader>
            {summaryTable.getHeaderGroups().map((headerGroup) => (
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
            {summaryTable.getRowModel().rows?.length ? (
              summaryTable.getRowModel().rows.map((row) => (
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
                <TableCell colSpan={summaryColumns.length} className="h-24 text-center">
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

