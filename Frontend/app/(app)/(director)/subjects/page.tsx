'use client'

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Search, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AddSubjectModal from "@/components/add-subject-modal"
import SubjectCard from "@/components/subject-card"
import { subjectApi } from "@/apis"

export default function Subject() {
  const [isOpenAddSubjectModal, setIsOpenAddSubjectModal] = useState(false)
  const [checkReLoading, setCheckReLoading] = useState(false)
  const [data, setData] = useState<{ id: number; subjectname: string }[]>([])
  const [query, setQuery] = useState("")
  const [filteredSubjects, setFilteredSubjects] = useState<{ id: number; subjectname: string }[]>([])

  const fetchAllSubjects = async () => {
    try {
      const res = await subjectApi.getAllSubject()
      if (res.EC === 1) {
        toast.error(res.EM)
      } else {
        setData(res.DT)
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
      toast.error("Failed to fetch subjects")
    }
  }

  useEffect(() => {
    fetchAllSubjects()
  }, [checkReLoading])

  useEffect(() => {
    if (data.length > 0) {
      const filteredItems = data.filter((subject) =>
        subject.subjectname
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(query.toLowerCase())
      )
      setFilteredSubjects(filteredItems)
    }
  }, [query, data])

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
    }
  }

  return (
    <div className="mx-14 mb-0 mt-10 flex h-screen flex-col overflow-hidden p-0">
      <div className="animate-fade-left">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-[300px]"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="mt-10 flex">
        <h2 className="mr-4 animate-fade-up text-2xl font-bold">Subject</h2>
        <div className="animate-flip-down">
          <Button
            onClick={() => setIsOpenAddSubjectModal(true)}
            variant="default"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
        <AddSubjectModal
          isOpenAddSubjectModal={isOpenAddSubjectModal}
          closeAddSubjectModal={() => setIsOpenAddSubjectModal(false)}
          checkReLoading={checkReLoading}
          setCheckReLoading={setCheckReLoading}
        />
      </div>
      <div className="flex w-full flex-row flex-wrap">
        {filteredSubjects.map(({ id, subjectname }) => (
          <SubjectCard
            key={id}
            setCheckReLoading={setCheckReLoading}
            checkReLoading={checkReLoading}
            subjectName={subjectname}
            id={id.toString()}
          />
        ))}
      </div>
    </div>
  )
}

