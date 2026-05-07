'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/analizador', label: 'Tu Espejo' },
  { href: '/dashboard', label: 'Indicadores' },
  { href: '/educacion', label: 'Educación' },
]

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <div className="flex gap-1">
      {links.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
