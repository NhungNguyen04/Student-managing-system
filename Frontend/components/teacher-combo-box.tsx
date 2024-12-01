'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { teacherApi } from "@/apis"
import { toast } from "react-toastify"

interface Teacher {
  id: string
  teachername: string
}

interface TeacherComboBoxProps {
  handleChange: (name: string, value: string) => void
  subjectId: string
  teacher?: { teacherName: string }
  teacherId?: string
}

export function TeacherComboBox({ handleChange, subjectId, teacher, teacherId }: TeacherComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(teacherId || "")
  const [teachers, setTeachers] = React.useState<Teacher[]>([])

  const fetchAllTeacher = React.useCallback(async () => {
    try {
      const res = await teacherApi.getAllTeacherBySubjectId(subjectId)
      if (res.EC === 1) {
        toast.error(res.EM)
      } else {
        setTeachers(res.DT)
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Failed to fetch teachers")
    }
  }, [subjectId])

  React.useEffect(() => {
    fetchAllTeacher()
  }, [fetchAllTeacher])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? teachers.find((teacher) => teacher.id === value)?.teachername
            : "Select teacher..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search teacher..." />
          <CommandEmpty>No teacher found.</CommandEmpty>
          <CommandGroup>
            {teachers.map((teacher) => (
              <CommandItem
                key={teacher.id}
                value={teacher.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  handleChange("teacherId", currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === teacher.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {teacher.teachername}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

