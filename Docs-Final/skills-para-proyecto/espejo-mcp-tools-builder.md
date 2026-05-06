Skill para definir y ajustar tools del servidor MCP Python del proyecto Espejo de Datos.

## Cuándo aplicar

- Definir o ajustar input/output de tools en `mcp-server/financial_mirror_mcp.py`.
- Agregar validaciones o nuevas tools.
- Ajustar firmas de tools existentes.

## Cuándo NO aplicar

- Llamadas a Claude API desde las tools → las tools NO llaman a Claude.
- Lógica de UI.
- System prompts de agentes → usar `espejo-agents-designer`.

## Instrucciones

1. Si el usuario no proporcionó el input estructurado, pídelo:

```xml
<skill-espejo-mcp-tools-builder>
  <tool-name>
    <!-- parse_cartola | fetch_macro_indicators | build_financial_profile |
         extract_signals | generate_lenses | simulate_change -->
  </tool-name>
  <context>
    <!-- Qué debe hacer la tool y qué NO. -->
  </context>
  <schemas>
    <!-- Estructura esperada de input y output (en JSON). -->
  </schemas>
  <current-code>
    <!-- Implementación actual si existe. -->
  </current-code>
  <constraints>
    - Python + FastMCP
    - No llamar a Claude API desde aquí
    - Solo parsing, HTTP a APIs públicas, cálculo
    - Manejar errores con mensajes claros (sin datos sensibles)
  </constraints>
</skill-espejo-mcp-tools-builder>
```

2. Entrega un **PLAN numerado de 3-5 pasos** antes de escribir código. Espera confirmación.

3. Al implementar:
   - Usar `@mcp.tool()` decorator de FastMCP
   - Una sola responsabilidad por tool
   - Input/output tipados con anotaciones Python
   - Validaciones básicas de input con mensajes de error claros
   - No llamar a Claude API ni a nada de `@anthropic-ai/sdk`
   - Solo parsing, HTTP a APIs públicas (mindicador.cl, etc.), cálculo

4. Output: código Python de la tool con `@mcp.tool()`.

## Referencia

- `Docs-Final/05-mcp-financial-mirror.md` — código de referencia completo del MCP
- `Docs-Final/03-arquitectura.md` — capa MCP
- `Docs-Final/15-prompts-equipo/milton-backend.md` — Prompt 4
