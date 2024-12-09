'use client'

import { PiStudent } from "react-icons/pi"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardCardProps {
  NumberHSG: number;
  NumberHSTotal: number;
  grade: string;
}

export default function DashboardCard({ NumberHSG, NumberHSTotal, grade }: DashboardCardProps) {
  const data = [
    { name: "NumberHSG", number: NumberHSG },
    { name: "TotalHS", number: NumberHSTotal },
  ]
  const colors = ["#475be8", "#e4e8ef"]

  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex flex-col">
        <CardTitle className="text-xl">Student Grade {grade}</CardTitle>
        <CardContent className="mt-2 flex items-center p-0">
          <PiStudent />
          <p className="font-bold">{NumberHSTotal}</p>
        </CardContent>
      </div>
      <PieChart width={100} height={100}>
        <Pie
          data={data}
          cx={50}
          cy={45}
          innerRadius={20}
          fill="#e4e8ef"
          paddingAngle={0}
          dataKey="number"
          startAngle={-270}
          endAngle={150}
          stroke="none"
          isAnimationActive={true}
          animationBegin={0}
          animationDuration={2000}
          animationEasing="ease"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Card>
  )
}

