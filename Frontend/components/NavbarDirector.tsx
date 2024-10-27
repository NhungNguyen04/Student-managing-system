import Link from 'next/link'

export default function NavbarDirector() {
  return (
    <nav className="bg-white p-4 h-full fixed">
      <ul className="flex flex-col space-y-4 text-blue-600">
        <li><Link href="/director/statistics">Statistics</Link></li>
        <li><Link href="/director/classes">Classes</Link></li>
        <li><Link href="/director/students">Students</Link></li>
        <li><Link href="/director/teachers">Teachers</Link></li>
        <li><Link href="/director/teaching">Teaching Assignments</Link></li>
        <li><Link href="/director/tuition">Tuition Fees</Link></li>
        <li><Link href="/director/subjects">Subjects</Link></li>
        <li><Link href="/director/regulations">Regulations</Link></li>
        <li><Link href="/director/profile">Profile</Link></li>
      </ul>
    </nav>
  )
}
