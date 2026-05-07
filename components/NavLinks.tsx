'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/analizador',          label: 'Tu Espejo',   soon: false },
  { href: '/dashboard',           label: 'Indicadores', soon: false },
  { href: '/educacion',           label: 'Educación',   soon: false },
  { href: '/nosotros',            label: 'Equipo',      soon: false },
  { href: '/historial',           label: 'Historial',   soon: true  },
  { href: '/comunidad',           label: 'Comunidad',   soon: true  },
  { href: '/proximas-funciones',  label: 'Roadmap',     soon: true  },
]

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <div className="flex flex-wrap gap-1">
      {links.map(({ href, label, soon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-blue-50 text-blue-700'
                : soon
                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {label}
            {soon && !active && (
              <span className="ml-1.5 text-[9px] font-bold bg-amber-100 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full align-middle">
                Pronto
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
