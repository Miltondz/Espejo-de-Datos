import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import NavLinks from '@/components/NavLinks'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Espejo de Datos — Tu perfil financiero en lenguaje ciudadano',
  description:
    'Descubre cómo bancos, fintechs y el Estado interpretan tu cartola bancaria. Educación financiera con IA y privacidad garantizada.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 no-print">
          <nav className="container mx-auto px-4 h-14 flex items-center justify-between max-w-5xl">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl" aria-hidden="true">🪞</span>
              <span className="font-black text-gray-900 text-lg tracking-tight">
                Espejo <span className="text-blue-600">de Datos</span>
              </span>
            </Link>
            <NavLinks />
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t border-gray-200 py-6 no-print">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span aria-hidden="true">🪞</span>
                <span className="font-semibold text-gray-700">Espejo de Datos</span>
                <span className="text-gray-300">·</span>
                <span>Claude Impact Lab Chile 2026</span>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/educacion" className="hover:text-blue-600 transition-colors">Educación</Link>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Indicadores</Link>
                <Link href="/nosotros" className="hover:text-blue-600 transition-colors">Equipo</Link>
                <Link href="/debug" className="hover:text-blue-600 transition-colors">Transparencia técnica</Link>
                <a
                  href="https://sernac.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  SERNAC
                </a>
                <a
                  href="https://cmfeduca.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  CMF Educa
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Herramienta educativa · No es asesoría financiera ni legal · Tus datos no se guardan ·{' '}
              © 2026 Espejo de Datos
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
