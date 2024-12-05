'use client'
import { CardClass } from "@/components/class-card";
import { useEffect, useState } from "react";
import { studentApi } from "@/apis";
import { DialogView } from "@/components/class-dialog-view";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import Box from "@mui/material/Box";

interface ClassItem {
  classId: string;
  class: {
    classname: string;
    total: number;
  };
}

export default function StudentClass() {
  const { isLoggedIn } = useAuth();
  const role = "student";
  const [checkId, setCheckId] = useState<string | undefined>(undefined);
  const [dataClassGrade10, setGrade10] = useState<ClassItem[]>([]);
  const [dataClassGrade11, setGrade11] = useState<ClassItem[]>([]);
  const [dataClassGrade12, setGrade12] = useState<ClassItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const fetchAllClassByStudentId = async () => {
    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        throw new Error("Student ID not found.");
      }
      const res = await studentApi.getAllClassByStudentId(studentId);
      if (res.EC !== 1) {
        const class10 = res.DT.filter((item: ClassItem) =>
          item.class.classname.startsWith("10")
        );
        const class11 = res.DT.filter((item: ClassItem) =>
          item.class.classname.startsWith("11")
        );
        const class12 = res.DT.filter((item: ClassItem) =>
          item.class.classname.startsWith("12")
        );
        setGrade10(class10);
        setGrade11(class11);
        setGrade12(class12);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    }
  };

  useEffect(() => {
    fetchAllClassByStudentId();
  }, []);

  return (
    <Box className="flex flex-col mx-14 mt-10">
      {/* Grade 10 */}
      <div>
        <div className="mb-3 px-7 py-2 rounded-full bg-gradeTitle2 shadow-md">
          <p className="text-center text-base font-semibold text-black">Khối 10</p>
        </div>
        <div className="flex flex-wrap">
          {dataClassGrade10.map((item) => (
            <div key={item.classId}>
              <CardClass
                checkId={item.classId}
                setCheckId={setCheckId}
                openModal={openModal}
                nameclass={item.class.classname}
                total={item.class.total}
              />
              {checkId === item.classId && (
                <DialogView
                  classId={item.classId}
                  isOpen={isOpen}
                  closeModal={closeModal}
                  nameclass={item.class.classname}
                  openModal={openModal}
                  role={role}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grade 11 */}
      <div>
        <div className="mb-3 px-7 py-2 rounded-full bg-gradeTitle2 shadow-md">
          <p className="text-center text-base font-semibold text-black">Khối 11</p>
        </div>
        <div className="flex flex-wrap">
          {dataClassGrade11.map((item) => (
            <div key={item.classId}>
              <CardClass
                checkId={item.classId}
                setCheckId={setCheckId}
                openModal={openModal}
                nameclass={item.class.classname}
                total={item.class.total}
              />
              {checkId === item.classId && (
                <DialogView
                  classId={item.classId}
                  isOpen={isOpen}
                  closeModal={closeModal}
                  nameclass={item.class.classname}
                  openModal={openModal}
                  role={role}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grade 12 */}
      <div>
        <div className="mb-3 px-7 py-2 rounded-full bg-gradeTitle2 shadow-md">
          <p className="text-center text-base font-semibold text-black">Khối 12</p>
        </div>
        <div className="flex flex-wrap">
          {dataClassGrade12.map((item) => (
            <div key={item.classId}>
              <CardClass
                checkId={item.classId}
                setCheckId={setCheckId}
                openModal={openModal}
                nameclass={item.class.classname}
                total={item.class.total}
              />
              {checkId === item.classId && (
                <DialogView
                  classId={item.classId}
                  isOpen={isOpen}
                  closeModal={closeModal}
                  nameclass={item.class.classname}
                  openModal={openModal}
                  role={role}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}
