'use client'

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { subjectApi } from "@/apis"

interface AddSubjectModalProps {
  isOpenAddSubjectModal: boolean
  closeAddSubjectModal: () => void
  checkReLoading: boolean
  setCheckReLoading: (value: boolean) => void
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpenAddSubjectModal,
  closeAddSubjectModal,
  checkReLoading,
  setCheckReLoading,
}) => {
  const [subjectInfo, setSubjectInfo] = useState({
    subjectName: "",
    fifteenMinFactor: "",
    fourtyFiveMinFactor: "",
    finalFactor: "",
    factor: "",
    minPassScore: "",
  })

  const handleChange = (name: string, value: string) => {
    setSubjectInfo((prevSubjectInfo) => ({
      ...prevSubjectInfo,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        subjectName: subjectInfo.subjectName,
        fifteenMinFactor: parseFloat(subjectInfo.fifteenMinFactor),
        fourtyFiveMinFactor: parseFloat(subjectInfo.fourtyFiveMinFactor),
        finalFactor: parseFloat(subjectInfo.finalFactor),
        factor: parseFloat(subjectInfo.factor),
        minPassScore: parseFloat(subjectInfo.minPassScore),
      }
      const res = await subjectApi.createSubject(data)
      if (res.EC !== 1) {
        toast.success("Subject created successfully!")
        setCheckReLoading(!checkReLoading)
        closeAddSubjectModal()
      } else {
        toast.error(res.EM)
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while creating the subject")
    }
  }

  return (
    <Transition appear show={isOpenAddSubjectModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeAddSubjectModal}>
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
                  Create Subject
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <Input
                    required
                    id="subjectName"
                    name="subjectName"
                    placeholder="Subject Name"
                    value={subjectInfo.subjectName}
                    onChange={(e) => handleChange("subjectName", e.target.value)}
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
                    <Button type="submit">Add</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeAddSubjectModal}
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

export default AddSubjectModal;

