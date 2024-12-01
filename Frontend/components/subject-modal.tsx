'use client'

import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { subjectApi } from "@/apis"

interface SubjectModalProps {
  isOpenSubjectModal: boolean
  closeSubjectModal: () => void
  id: string
  checkReLoading: boolean
  setCheckReLoading: (value: boolean) => void
}

export default function SubjectModal({
  isOpenSubjectModal,
  closeSubjectModal,
  id,
  checkReLoading,
  setCheckReLoading,
}: SubjectModalProps) {
  const [subjectInfo, setSubjectInfo] = useState<any>(null)

  const getSubjectById = async () => {
    try {
      const res = await subjectApi.getSubjectById(id)
      if (res.EC !== 1) {
        setSubjectInfo(res.DT)
      }
    } catch (error) {
      console.error("Error fetching subject:", error)
      toast.error("Failed to fetch subject details")
    }
  }

  useEffect(() => {
    if (isOpenSubjectModal) {
      getSubjectById()
    }
  }, [isOpenSubjectModal, id])

  const handleChange = (name: string, value: string) => {
    setSubjectInfo((prevSubjectInfo: any) => ({
      ...prevSubjectInfo,
      [name]: value,
    }))
  }

  const handleDelete = async () => {
    try {
      const res = await subjectApi.deleteSubject(id)
      if (res.EC !== 1) {
        toast.success("Subject deleted successfully")
        setCheckReLoading(!checkReLoading)
        closeSubjectModal()
      } else {
        toast.error(res.EM)
      }
    } catch (error) {
      console.error("Error deleting subject:", error)
      toast.error("Failed to delete subject")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        subjectName: subjectInfo.subjectname,
        fifteenMinFactor: parseFloat(subjectInfo.fifteenMinFactor),
        fourtyFiveMinFactor: parseFloat(subjectInfo.fourtyFiveMinFactor),
        finalFactor: parseFloat(subjectInfo.finalFactor),
        factor: parseFloat(subjectInfo.factor),
        minPassScore: parseFloat(subjectInfo.minPassScore),
      }
      const res = await subjectApi.updateSubject(id, data)
      if (res.EC !== 1) {
        toast.success("Subject updated successfully!")
        setCheckReLoading(!checkReLoading)
        closeSubjectModal()
      } else {
        toast.error(res.EM)
      }
    } catch (error) {
      console.error("Error updating subject:", error)
      toast.error("Failed to update subject")
    }
  }

  if (!subjectInfo) {
    return null
  }

  return (
    <Transition appear show={isOpenSubjectModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeSubjectModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Subject Information
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <Input
                    required
                    id="subjectName"
                    name="subjectName"
                    placeholder="Subject Name"
                    value={subjectInfo.subjectname}
                    onChange={(e) => handleChange("subjectname", e.target.value)}
                  />
                  <Input
                    required
                    id="fifteenMinFactor"
                    name="fifteenMinFactor"
                    placeholder="15 Min Factor"
                    type="number"
                    step="0.01"
                    value={subjectInfo.fifteenMinFactor}
                    onChange={(e) => handleChange("fifteenMinFactor", e.target.value)}
                  />
                  <Input
                    required
                    id="fourtyFiveMinFactor"
                    name="fourtyFiveMinFactor"
                    placeholder="45 Min Factor"
                    type="number"
                    step="0.01"
                    value={subjectInfo.fourtyFiveMinFactor}
                    onChange={(e) => handleChange("fourtyFiveMinFactor", e.target.value)}
                  />
                  <Input
                    required
                    id="finalFactor"
                    name="finalFactor"
                    placeholder="Final Factor"
                    type="number"
                    step="0.01"
                    value={subjectInfo.finalFactor}
                    onChange={(e) => handleChange("finalFactor", e.target.value)}
                  />
                  <Input
                    required
                    id="factor"
                    name="factor"
                    placeholder="Subject Factor"
                    type="number"
                    step="0.01"
                    value={subjectInfo.factor}
                    onChange={(e) => handleChange("factor", e.target.value)}
                  />
                  <Input
                    required
                    id="minPassScore"
                    name="minPassScore"
                    placeholder="Minimum Pass Score"
                    type="number"
                    step="0.01"
                    value={subjectInfo.minPassScore}
                    onChange={(e) => handleChange("minPassScore", e.target.value)}
                  />
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button type="submit">Save</Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeSubjectModal}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

