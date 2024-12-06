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

interface OverallProps {
  listSubjectResult: any[]
}

export function Overall({ listSubjectResult }: OverallProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "No.",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      accessorKey: "subjectname",
      header: "Subject",
    },
    {
      header: "Average scores",
      columns: [
        { accessorKey: "term1AverageScore", header: "Term I" },
        { accessorKey: "term2AverageScore", header: "Term II" },
        { accessorKey: "annualAverageScore", header: "All year" },
      ],
    },
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

  return (
    <div className="relative mb-10 mt-10 flex flex-col overflow-hidden bg-white p-0">
      <div className="mt-10 flex items-center">
        <p className="animate-fade-up text-2xl font-semibold animate-delay-[500ms]">All year results</p>
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
    </div>
  )
}

