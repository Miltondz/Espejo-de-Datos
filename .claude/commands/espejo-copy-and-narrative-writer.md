Skill para escribir y ajustar textos en lenguaje ciudadano del proyecto Espejo de Datos.

## Cuándo aplicar

- Escribir/ajustar headlines de lentes (Banco, Fintech, Estado).
- Descripciones de señales en lenguaje ciudadano.
- Explicaciones de simulaciones.
- Disclaimers legales y de privacidad.
- Texto del pitch y materiales de presentación.
- Microcopy de UI (labels, estados de carga, mensajes de error).

## Cuándo NO aplicar

- Código TypeScript o Python → usar el skill correspondiente.
- System prompts de agentes → usar `espejo-agents-designer`.

## Instrucciones

1. Si el usuario no proporcionó el input estructurado, pídelo:

```xml
<skill-espejo-copy-and-narrative-writer>
  <context>
    <!-- Dónde se usará el texto (ej: headline lente Banco, señal
         de uso de cupo alto, disclaimer del SimulationPanel, etc.). -->
  </context>
  <audience>
    <!-- Segmento: "emprendedora de primera generación en región" o similar. -->
  </audience>
  <constraints>
    - Lenguaje simple, sin tecnicismos
    - Tono respetuoso, no paternalista
    - Máx 2-3 frases por bloque
    - No prometer aprobaciones ni resultados
    - Incluir enfoque "cómo te ven" cuando aplique
  </constraints>
  <draft>
    <!-- Texto actual o ideas en crudo (opcional). -->
  </draft>
</skill-espejo-copy-and-narrative-writer>
```

2. No se necesita plan previo para textos cortos. Para revisiones de más de 5 bloques, listar qué se va a cambiar antes de hacerlo.

3. Al escribir:
   - Lenguaje simple, sin tecnicismos financieros
   - Tono respetuoso, no paternalista ("puedes" en lugar de "tienes que")
   - Máximo 2-3 frases por bloque
   - No prometer resultados ("el banco te aprobará X")
   - Enfoque "cómo te ven" cuando aplique (ej. "así ve el banco tu perfil")
   - Siempre incluir disclaimer cuando se hable de señales o simulaciones

4. Output por defecto: hasta 3 variantes del texto con razón corta de cada cambio.

## Referencia

- `Docs-Final/08-privacidad-y-datos.md §6` — copy de aviso de privacidad canónico
- `Docs-Final/13-easy-wins.md §3.5` — disclaimers aprobados
- `Docs-Final/02-producto-y-segmento.md` — perfil de Paula (audiencia principal)
- `Docs-Final/15-prompts-equipo/alejandra-frontend.md` — Prompt 8
