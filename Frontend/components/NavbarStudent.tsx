import Link from 'next/link'

export default function NavbarStudent() {
  return (
    <nav className="bg-white p-4 h-full fixed">
      <ul className="flex flex-col space-y-4 text-blue-600">
        <li><Link href="/student/scores">View Scores</Link></li>
        <li><Link href="/student/class">Class Information</Link></li>
        <li><Link href="/student/tuition">Tuition Fees</Link></li>
        <li><Link href="/student/profile">Profile</Link></li>
      </ul>
    </nav>
  )
}