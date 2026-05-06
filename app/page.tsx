import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Espejo de Datos</h1>
      <p className="text-xl text-gray-600">
        La cartola que te evalúa en silencio, ahora también te explica.
      </p>
      <p className="text-gray-500 leading-relaxed">
        Carga tu cartola bancaria y descubre cómo distintas instituciones leen tu perfil
        financiero. Sin guardar tus datos, sin asesoría financiera — solo transparencia.
      </p>
      <Link
        href="/analizador"
        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Ver mi Espejo
      </Link>
      <p className="text-xs text-gray-400">
        🔒 Tu información se procesa en memoria y nunca se guarda
      </p>
    </div>
  )
}
