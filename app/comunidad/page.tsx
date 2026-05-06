import Link from 'next/link'

export default function ComunidadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-center space-y-4">
      <h1 className="text-2xl font-bold">Comunidad</h1>
      <p className="text-gray-500">Próximamente: comparte aprendizajes y estrategias con otros usuarios.</p>
      <Link href="/analizador" className="inline-block text-blue-600 underline text-sm">
        Ir a tu Espejo
      </Link>
    </div>
  )
}
