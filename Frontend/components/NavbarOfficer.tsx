import Link from 'next/link'

export default function NavbarOfficer() {
  return (
    <nav className="bg-white p-4 h-full fixed">
      <ul className="flex flex-col space-y-4 text-blue-600">
        <li><Link href="/officer/tuition">Tuition</Link></li>
        <li><Link href="/officer/classes">Profile</Link></li>
      </ul>
    </nav>
  )
}
