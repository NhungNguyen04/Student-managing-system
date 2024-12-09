'use client'

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { studentApi } from "@/apis"

interface NumberByTitle {
  concludetitle: string;
  NumberHS: number;
}

interface AreaProgressChartProps {
  numberByTitle: NumberByTitle[];
}

export default function AreaProgressChart({ numberByTitle }: AreaProgressChartProps) {
  const [totalStudent, setTotalStudent] = useState(1)

  const getTotalStudent = async () => {
    let res = await studentApi.getAllStudent()
    setTotalStudent(res.DT.length)
  }

  useEffect(() => {
    getTotalStudent()
  }, [])

  return (
    <Card className="ml-5 flex w-full flex-col">
      <CardHeader>
        <CardTitle className="text-center">Student Type</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          width={400}
          height={300}
          data={numberByTitle}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            bottom: 5,
          }}
        >
          <XAxis type="number" axisLine={false} domain={[0, totalStudent]} />
          <YAxis type="category" dataKey="concludetitle" axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="NumberHS"
            fill="#4a7746"
            radius={[4, 4, 4, 4]}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease"
          />
        </BarChart>
      </CardContent>
    </Card>
  )
}

