'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

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
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden md:flex flex-wrap gap-1">
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

      {/* Mobile hamburger button */}
      <button
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(p => !p)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile dropdown — fixed 56px below top of viewport (below sticky header) */}
      {open && (
        <div className="md:hidden fixed top-14 inset-x-0 bg-white border-b border-gray-200 shadow-lg z-50 py-2 no-print">
          {links.map(({ href, label, soon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : soon
                    ? 'text-gray-400 hover:bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
                {soon && !active && (
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full">
                    Pronto
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
