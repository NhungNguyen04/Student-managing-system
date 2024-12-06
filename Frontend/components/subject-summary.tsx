'use client'

import React, { useMemo } from "react"
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SubjectResult {
  id: string
  subject: {
    subjectname: string
  }
  fifteenMinExam_1: number
  fifteenMinExam_2: number
  fifteenMinExam_3: number
  fifteenMinExam_4: number
  fortyFiveMinExam_1: number
  fortyFiveMinExam_2: number
  finalTest: number
  averageScore: number
  result: string
}

interface SubjectSummaryProps {
  data: any[]
  listSubjectResult: SubjectResult[]
  term: string
}

export function SubjectSummary({ data, listSubjectResult, term }: SubjectSummaryProps) {
  const columns = useMemo<ColumnDef<SubjectResult>[]>(
    () => [
      {
        accessorKey: "id",
        header: "No.",
        cell: (info) => info.row.index + 1,
      },
      {
        accessorKey: "subject.subjectname",
        header: "Subject",
      },
      {
        header: "Regular",
        columns: [
          { accessorKey: "fifteenMinExam_1", header: "M1" },
          { accessorKey: "fifteenMinExam_2", header: "M2" },
          { accessorKey: "fifteenMinExam_3", header: "M3" },
          { accessorKey: "fifteenMinExam_4", header: "M4" },
        ],
      },
      {
        header: "Mid",
        columns: [
          { accessorKey: "fortyFiveMinExam_1", header: "V1" },
          { accessorKey: "fortyFiveMinExam_2", header: "V2" },
        ],
      },
      {
        accessorKey: "finalTest",
        header: "End",
      },
      {
        accessorKey: "averageScore",
        header: "Avg",
      },
      {
        accessorKey: "result",
        header: "Result",
      },
    ],
    []
  )

  const table = useReactTable({
    columns,
    data: listSubjectResult,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Card className="mb-10 mt-10">
      <CardHeader>
        <CardTitle>Term {term}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
      </CardContent>
    </Card>
  )
}

