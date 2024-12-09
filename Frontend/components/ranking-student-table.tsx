'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListBulletIcon, InfoCircledIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { StudentProfileView } from "./student-profile-view"

interface Student {
  id: number;
  studentname: string;
  email: string;
  image?: string;
  concludecore: number;
  classname: string;
}

interface RankingStudentTableProps {
  data: Student[];
}

export default function RankingStudentTable({ data }: RankingStudentTableProps) {
  const [isOpenStudentProfileView, setOpenStudentProfileView] = useState(false)
  const [id, setId] = useState(0)

  function openStudentProfileView() {
    setOpenStudentProfileView(true)
  }

  function closeStudentProfileView() {
    setOpenStudentProfileView(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Students</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>GPA</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="mr-2">
                      <AvatarImage src={student.image || "/student.png"} />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{student.studentname}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{student.concludecore}</TableCell>
                <TableCell>{student.classname}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/student-summaries/${student.id}`}>
                      <ListBulletIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setId(student.id)
                      openStudentProfileView()
                    }}
                  >
                    <InfoCircledIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {isOpenStudentProfileView && (
        <StudentProfileView
          isOpen={isOpenStudentProfileView}
          onClose={closeStudentProfileView}
          id={`${id}`}
        />
      )}
    </Card>
  )
}

