'use client'

import { useState } from "react"
import SubjectModal from "@/components/subject-modal"

interface SubjectCardProps {
  subjectName: string
  id: string
  setCheckReLoading: (value: boolean) => void
  checkReLoading: boolean
}

export default function SubjectCard({
  subjectName,
  id,
  setCheckReLoading,
  checkReLoading,
}: SubjectCardProps) {
  const [isOpenSubjectModal, setIsOpenSubjectModal] = useState(false)

  const closeSubjectModal = () => {
    setIsOpenSubjectModal(false)
  }

  const openSubjectModal = () => {
    setIsOpenSubjectModal(true)
  }

  return (
    <div>
      <div
        onClick={openSubjectModal}
        className="my-class group relative mr-4 mt-5 flex h-[120px] w-[240px] animate-fade-down cursor-pointer items-center justify-center rounded-2xl bg-primary text-primary-foreground after:absolute after:top-2 after:scale-0 after:border-8 after:border-solid after:border-white after:opacity-30 after:transition-all after:content-[''] hover:after:scale-95"
      >
        <p className="text-2xl font-bold group-hover:animate-jump">
          {subjectName}
        </p>
      </div>
      {isOpenSubjectModal && (
        <SubjectModal
          setCheckReLoading={setCheckReLoading}
          checkReLoading={checkReLoading}
          isOpenSubjectModal={isOpenSubjectModal}
          closeSubjectModal={closeSubjectModal}
          id={id}
        />
      )}
    </div>
  )
}

