'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Compare3YearData {
  Year: string;
  NumberHSG: number;
  NumberHSK: number;
  NumberHSTB: number;
  NumberHSY: number;
}

export default function BarchartAdmin({ compare3year }: { compare3year: Compare3YearData[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-center">Student Classification</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={compare3year}
            margin={{
              top: 5,
              right: 30,
              bottom: 5,
            }}
            barSize={30}
          >
            <XAxis dataKey="Year" axisLine={false} padding={{ left: 10 }} />
            <YAxis type="number" axisLine={false} tickLine={false} padding={{ top: 10 }} />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Legend iconType="circle" iconSize={10} verticalAlign="top" align="center" height={50} />
            <Bar
              dataKey="NumberHSG"
              fill="#4a7746"
              radius={[4, 4, 4, 4]}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease"
            />
            <Bar
              dataKey="NumberHSK"
              fill="#5D7B6F"
              radius={[4, 4, 4, 4]}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease"
            />
            <Bar
              dataKey="NumberHSTB"
              fill="#A4C3A2"
              radius={[4, 4, 4, 4]}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease"
            />
            <Bar
              dataKey="NumberHSY"
              fill="#B0D4B8"
              radius={[4, 4, 4, 4]}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

