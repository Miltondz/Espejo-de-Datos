import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Espejo de Datos',
  description: 'Tu cartola que te evalúa en silencio, ahora también te explica.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <header className="bg-white border-b shadow-sm no-print">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
            <Link href="/" className="font-bold text-blue-700 text-lg">
              Espejo de Datos
            </Link>
            <div className="flex gap-4 text-sm flex-wrap">
              <Link href="/analizador" className="hover:text-blue-600 font-medium">
                Tu Espejo
              </Link>
              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/educacion" className="hover:text-blue-600">
                Educación
              </Link>
              <span className="text-gray-400">Historial*</span>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t mt-8 py-4 no-print">
          <p className="text-center text-xs text-gray-500 px-4">
            Espejo de Datos es educativo. No es asesoría financiera ni legal. Tus datos no se
            guardan. © 2026 · Construido para Claude Impact Lab Chile
          </p>
        </footer>
      </body>
    </html>
  )
}
