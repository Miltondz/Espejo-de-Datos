Skill para diseñar y refinar system prompts y helpers de agentes Claude del proyecto Espejo de Datos.

## Cuándo aplicar

- Diseñar/refinar `MIRROR_BUILDER_SYSTEM_PROMPT`, `ACTION_PLANNER_SYSTEM_PROMPT`, `LETTER_GENERATOR_SYSTEM_PROMPT`.
- Implementar helpers `callMirrorBuilderAgent`, `callActionPlannerAgent`, `callLetterGeneratorAgent`.
- Ajustar formato de salida JSON de los agentes.
- Validar que el agente siempre devuelva JSON válido con el esquema correcto.

## Cuándo NO aplicar

- Implementar routes HTTP → usar `espejo-api-routes-builder`.
- Implementar tools MCP → usar `espejo-mcp-tools-builder`.
- Construir UI → usar `espejo-frontend-builder`.

## Instrucciones

1. Si el usuario no proporcionó el input estructurado, pídelo:

```xml
<skill-espejo-agents-designer>
  <agent-name>
    <!-- mirror-builder | action-planner | letter-generator -->
  </agent-name>
  <context>
    <!-- Qué hace el agente hoy, qué problema concreto se está viendo
         (ej: "a veces no usa simulate_change", "a veces inventa leyes"). -->
  </context>
  <tools>
    <!-- Tools MCP disponibles para este agente. -->
  </tools>
  <io-schemas>
    <!-- Esquema actual de input y output JSON. -->
  </io-schemas>
  <current-prompt>
    <!-- System prompt actual si existe. -->
  </current-prompt>
  <constraints>
    - Debe SIEMPRE usar tool X para dato Y
    - Debe SIEMPRE devolver JSON válido con esquema Z
    - No debe citar artículos específicos si no está seguro
    - Lenguaje ciudadano, no paternalista
  </constraints>
</skill-espejo-agents-designer>
```

2. Entrega un **PLAN numerado de 3-5 pasos** antes de escribir código. Espera confirmación.

3. Al implementar:
   - System prompt con secciones claras: Rol, Herramientas disponibles, Pasos obligatorios, Formato de salida, Restricciones
   - El agente NUNCA debe inventar leyes, tasas ni artículos — si no hay datos, decir "sin datos suficientes"
   - Lenguaje ciudadano, no paternalista
   - Helper TypeScript con validación del JSON de salida (zod o validación manual)
   - Sugerir modelo (`claude-sonnet-4-6` vs `claude-haiku-4-5`) y `max_tokens` apropiados
   - Diseño de prompt → implementación de llamada → validación de respuesta (pasos separados)

4. Modelos recomendados:
   - `mirror-builder` y `action-planner` → `claude-sonnet-4-6`
   - `letter-generator` → `claude-haiku-4-5` (texto plano, más económico)

5. Output: system prompt actualizado + helper TypeScript con validación.

## Referencia

- `Docs-Final/06-agentes-claude.md` — system prompts completos de referencia
- `Docs-Final/15-prompts-equipo/milton-backend.md` — Prompts 5, 6, 7
