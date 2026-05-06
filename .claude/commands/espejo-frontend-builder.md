Skill para construir componentes y páginas Next.js 14 + Tailwind del proyecto Espejo de Datos.

## Cuándo aplicar

- Crear o modificar componentes en `app/` o `components/espejo/`.
- Generar layouts responsive con Tailwind.
- Conectar UI con `/api/analyze` y `/api/simulate`.
- Escribir copy visible al usuario.

## Cuándo NO aplicar

- Lógica de negocio → usar `espejo-dal-and-domain-builder`.
- Endpoints HTTP → usar `espejo-api-routes-builder`.
- Prompts de agentes IA → usar `espejo-agents-designer`.

## Instrucciones

1. Si el usuario no proporcionó el input estructurado, pídelo:

```xml
<skill-espejo-frontend-builder>
  <context>
    <!-- Qué parte de la UI se quiere construir o modificar. -->
  </context>
  <types>
    <!-- Pegar las definiciones relevantes de types/espejo.ts. -->
  </types>
  <example-data>
    <!-- Opcional: EspejoResponse de demo para imaginar el render. -->
  </example-data>
  <constraints>
    - Next.js 14 App Router
    - TypeScript
    - Tailwind CSS, sin librería extra de UI
    - No lógica de negocio, solo presentación
    - Mobile-first (360px+)
  </constraints>
</skill-espejo-frontend-builder>
```

2. Entrega un **PLAN numerado de 3-5 pasos** antes de escribir código. Espera confirmación.

3. Al implementar:
   - Props tipadas con los tipos de `types/espejo.ts`
   - Mobile-first (360px mínimo)
   - Tailwind sin librerías de UI pesadas (sin Chakra, MUI, etc.)
   - Si hace fetch, usa `/api/analyze` o `/api/simulate` explícitamente
   - Lenguaje ciudadano en todo texto visible; no prometer resultados
   - Disclaimer visible cuando corresponda

4. Colores por tipo de señal:
   - `positiva` → `emerald-100`
   - `ambigua` → `yellow-100`
   - `riesgo` → `red-100`
   - `sin_datos` → `gray-100`

5. Output: código TSX completo del componente o página.

## Referencia

- `Docs-Final/07-frontend-next.md` — rutas y componentes detallados
- `Docs-Final/04-contrato-de-datos.md` — tipos `EspejoResponse`
- `Docs-Final/15-prompts-equipo/alejandra-frontend.md` — prompts paso a paso
