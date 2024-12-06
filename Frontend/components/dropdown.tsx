import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gradeApi } from "@/apis"; // Ensure this path is correct or update it

interface DropdownProps {
  selectYear: number | null;
  setSelectYear: (year: number | null) => void;
  type: string | null;
}

interface Grade {
  year: string; // Adjust this if the year is a number in your API response
}

export function Dropdown({ selectYear, setSelectYear, type }: DropdownProps) {
  const [data, setData] = useState<Grade[]>([]);
  const [yearArr, setYearArr] = useState<number[]>([]);

  // Fetch all years
  const fetchAllYear = async () => {
    try {
      const response = await gradeApi.getAllYear();
      const grades = response.DT || [];
      setData(grades);

        const years = grades.map((grade: Grade) => Number(grade.year));
        const uniqueYears: number[] = Array.from(new Set<number>(years));
        setYearArr(type === null ? uniqueYears : [0, ...uniqueYears]); // Add 0 for "All" if type is not null
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  useEffect(() => {
    fetchAllYear();
  }, []);

  return (
    <div className="w-fit">
      <Select
        value={selectYear?.toString() || ""}
        onValueChange={(value) => setSelectYear(value === "0" ? null : Number(value))} // "0" means "All"
      >
        <SelectTrigger className="w-[10vw] bg-white mr-3">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {type !== null && <SelectItem value="0">All</SelectItem>}
          {yearArr.map((year, index) => (
            <SelectItem key={index} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}