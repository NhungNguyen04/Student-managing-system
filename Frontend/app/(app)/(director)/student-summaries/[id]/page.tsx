import { Suspense } from 'react'
import { StudentSummariesTable } from '@/components/student-summaries-table'
import { Skeleton } from "@/components/ui/skeleton"

export const dynamic = 'force-dynamic'

async function getStudentData(id: string) {
  // In a real application, you would fetch this data from your API
  // For now, we'll just return a placeholder
  return {
    id,
    name: "Student Name",
    // Add other necessary student data here
  }
}

export default async function StudentSummariesPage({ params, searchParams }: { params: { id: string }, searchParams: { name: string } }) {
  const studentData = await getStudentData(params.id)
  const studentName = searchParams.name || studentData.name

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Student Summaries: {studentName}</h1>
      <Suspense fallback={<StudentSummariesSkeleton />}>
        <StudentSummariesTable id={params.id} />
      </Suspense>
    </div>
  )
}

function StudentSummariesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

