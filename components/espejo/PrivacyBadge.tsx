export default function PrivacyBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-3 py-1.5 rounded-full">
      <span aria-hidden="true">🔒</span>
      <span>Datos en memoria · Sin guardar</span>
    </span>
  )
}
