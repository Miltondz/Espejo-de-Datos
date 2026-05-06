import Link from 'next/link'

export default function HistorialPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-center space-y-4">
      <h1 className="text-2xl font-bold">Historial</h1>
      <p className="text-gray-500">Próximamente: guarda tus análisis anteriores para comparar tu evolución.</p>
      <p className="text-xs text-gray-400">En el MVP, tus datos no se guardan para proteger tu privacidad.</p>
      <Link href="/analizador" className="inline-block text-blue-600 underline text-sm">
        Ir a tu Espejo
      </Link>
    </div>
  )
}
