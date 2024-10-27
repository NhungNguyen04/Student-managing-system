import Link from 'next/link'

export default function NavbarTeacher() {
  return (
    <nav className="bg-white p-4 h-full fixed">
      <ul className="flex flex-col space-y-4 text-blue-600">
        <li><Link href="/teacher/class">Class</Link></li>
        <li><Link href="/teacher/profile">Profile</Link></li>
      </ul>
    </nav>
  )
}