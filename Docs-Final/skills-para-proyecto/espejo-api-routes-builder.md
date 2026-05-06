Skill para crear y ajustar API Routes en `app/api/*/route.ts` del proyecto Espejo de Datos.

## Cuándo aplicar

- Crear/ajustar `app/api/analyze/route.ts`, `simulate/route.ts`, `generar-carta/route.ts`.
- Implementar parsing de multipart/form-data.
- Conectar con agentes vía helpers de `lib/agents/`.
- Manejo de errores HTTP con degradación controlada.

## Cuándo NO aplicar

- Lógica de dominio pura → usar `espejo-dal-and-domain-builder`.
- UI → usar `espejo-frontend-builder`.
- Diseño de system prompts → usar `espejo-agents-designer`.

## Instrucciones

1. Si el usuario no proporcionó el input estructurado, pídelo:

```xml
<skill-espejo-api-routes-builder>
  <route>
    <!-- /api/analyze | /api/simulate | /api/generar-carta -->
  </route>
  <context>
    <!-- Qué debe hacer la ruta:
         - qué recibe (body o multipart),
         - qué llama (DAL, agentes, MCP),
         - qué devuelve. -->
  </context>
  <types>
    <!-- Tipos relevantes (FinancialProfile, EspejoResponse, ...) -->
  </types>
  <claude-config>
    <!-- Forma actual de uso de @anthropic-ai/sdk. -->
  </claude-config>
  <constraints>
    - No exponer API keys
    - Responder siempre JSON tipado
    - Fallback determinista si la IA falla
    - No loggear contenido del usuario
  </constraints>
</skill-espejo-api-routes-builder>
```

2. Entrega un **PLAN numerado de 3-5 pasos** antes de escribir código. Espera confirmación.

3. Al implementar:
   - `ANTHROPIC_API_KEY` solo en variables de entorno del servidor, nunca en código ni cliente
   - Responder siempre JSON tipado con status HTTP correcto
   - **Fallback obligatorio**: si el agente o MCP falla, caer al DAL determinista y marcar resultado como demo
   - Loggear solo metadatos (status, latencia, conteo de tools), NUNCA contenido del usuario
   - Errores con status 4xx/5xx claros, sin datos sensibles en mensajes
   - No persistir cartolas ni transacciones individuales; todo en memoria

4. Output: código TypeScript del archivo `route.ts`.

## Referencia

- `Docs-Final/03-arquitectura.md` — capas del sistema
- `Docs-Final/08-privacidad-y-datos.md` — reglas de privacidad
- `Docs-Final/15-prompts-equipo/milton-backend.md` — Prompts 3, 5, 6, 7
