Skill para crear y modificar funciones puras de dominio en `lib/` del proyecto Espejo de Datos.

## Cuándo aplicar

- Crear/modificar funciones en `lib/`:
  - `buildEspejoFromProfile`
  - `simulateProfileChange`
  - `recalculateSignals`
  - `extractSignalsFromProfile`
  - `generateLensesFromProfile`
- Ajustar reglas de señales o lentes.

## Cuándo NO aplicar

- UI o componentes → usar `espejo-frontend-builder`.
- Llamadas HTTP o endpoints → usar `espejo-api-routes-builder`.
- Prompts de agentes IA → usar `espejo-agents-designer`.

## Instrucciones

1. Si el usuario no proporcionó el input estructurado, pídelo:

```xml
<skill-espejo-dal-and-domain-builder>
  <context>
    <!-- Qué función se quiere crear o cambiar.
         Ej: "Quiero que SIG_OVER_DEBT se active cuando carga financiera > 35%." -->
  </context>
  <types>
    <!-- types/profile.ts y types/espejo.ts -->
  </types>
  <current-code>
    <!-- Código actual de la función si existe. -->
  </current-code>
  <rules>
    - Funciones puras, sin side effects
    - Sin fetch, sin disco, sin React/Next
    - Solo parámetros y retornos tipados
  </rules>
</skill-espejo-dal-and-domain-builder>
```

2. Entrega un **PLAN numerado de 3-5 pasos** antes de escribir código. Espera confirmación.

3. Al implementar:
   - Funciones puras obligatorio: sin side effects, sin fetch, sin acceso a disco
   - Sin imports a frameworks (React, Next.js, etc.)
   - Solo parámetros y retornos tipados con los tipos canónicos
   - Comentarios solo donde la regla de negocio lo justifique
   - No cambiar la forma de `FinancialProfile` o `EspejoResponse` sin proponer el cambio primero

4. Output: TypeScript de funciones puras con tipos explícitos.

## Referencia

- `Docs-Final/04-contrato-de-datos.md` — contrato de tipos y catálogo de señales
- `Docs-Final/03-arquitectura.md` — capas del sistema
- `Docs-Final/15-prompts-equipo/milton-backend.md` — Prompts 2 y 3
