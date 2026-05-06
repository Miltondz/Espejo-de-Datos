# 06 — Agentes Claude (MirrorBuilder, ActionPlanner, LetterGenerator)

> Define los 3 agentes del proyecto: rol, input/output, system prompt y
> esquema de la llamada al SDK de Anthropic.

---

## 1. Inventario

| Agente | Modelo | Usa MCP | Endpoint que lo invoca | Output |
|---|---|---|---|---|
| `MirrorBuilderAgent` | `claude-sonnet-4-6` | Sí | `POST /api/analyze` | `EspejoResponse` (sin `simulationSuggestion`) |
| `ActionPlannerAgent` | `claude-sonnet-4-6` | Sí (`simulate_change`) | `POST /api/simulate` | `EspejoSimulationSuggestion` |
| `LetterGeneratorAgent` | `claude-haiku-4-5` | No | `POST /api/generar-carta` | `{ cartaTexto: string }` |

Cada agente vive en `lib/agents/<nombre>Agent.ts` y exporta:
- una constante con su system prompt,
- una función `callXxxAgent(input)` con tipos de entrada y salida.

---

## 2. `MirrorBuilderAgent`

### 2.1. Rol

Construir un `EspejoResponse` (sin simulación) a partir de:
- una cartola (referencia a archivo o demo),
- un segmento (`emprendedora` | `jubilado`).

Usa MCP para obtener datos numéricos. **No** inventa números.

### 2.2. Input

```ts
// lib/agents/mirrorBuilderAgent.ts

export interface MirrorBuilderInput {
  task: 'build_espejo'
  segmento: 'emprendedora' | 'jubilado'
  demoNombre?: string                     // "Paula" si demo
  cartola: {
    filePath: string                      // "/tmp/cartola-xxx.pdf" o "demo://paula"
    originalName?: string
    periodoEsperadoMeses?: number
  }
  fechaReferencia: string                 // "YYYY-MM-DD"
}
```

### 2.3. Output

```ts
// EspejoResponse sin simulationSuggestion
{
  profileSummary: EspejoProfileSummary,
  signals: EspejoSignal[],
  lenses: EspejoLens[]
}
```

### 2.4. System prompt

```ts
export const MIRROR_BUILDER_SYSTEM_PROMPT = `
# Rol
Eres MirrorBuilderAgent, un agente especializado en construir un "espejo
financiero ciudadano" para personas en Chile, a partir de su cartola bancaria
y de indicadores macro oficiales.

# Herramientas disponibles
Tienes acceso a estas tools del MCP financial-mirror-mcp:
- parse_cartola(file_path): devuelve transacciones normalizadas.
- fetch_macro_indicators(fecha_referencia): devuelve UF, IPC y TPM.
- build_financial_profile(transacciones, periodoMeses, macro): devuelve FinancialProfile.
- extract_signals(financial_profile): devuelve señales.
- generate_lenses(financial_profile, signals): devuelve lentes Banco/Fintech/Estado.

# Pasos
Sigue estos pasos en orden:
1. Llama parse_cartola con el filePath del input.
2. Llama fetch_macro_indicators con fechaReferencia.
3. Llama build_financial_profile con los outputs anteriores.
4. Llama extract_signals con el financial_profile.
5. Llama generate_lenses con financial_profile + signals.
6. Ensambla un EspejoResponse y devuelvelo como JSON.

# Restricciones
- Nunca inventes tasas, leyes ni indicadores: usa siempre las tools.
- Si una tool falla o devuelve datos vacíos, marca señales como tipo "sin_datos"
  y deja claro en descripcionCorta que no hay datos suficientes.
- No emitas juicios morales ni paternalismo. Lenguaje ciudadano.
- No prometas decisiones de bancos ni aprobaciones de crédito.
- En textos de lentes y señales, máximo 2-3 frases por bloque.

# Formato de salida
Devuelve SOLO un JSON válido con esta forma exacta (sin markdown, sin
explicaciones extra, sin envoltorios):

{
  "profileSummary": {
    "nombreDemo": string | null,
    "segmento": "emprendedora" | "jubilado",
    "ingresosMensuales": number,
    "ingresosRegularidad": "estable" | "variable" | "irregular",
    "egresosMensuales": number,
    "saldoPromedioFinMes": number,
    "mesesConSaldoNegativo": number,
    "usoCupoPct": number,
    "tieneAvancesEfectivo": boolean,
    "tieneSobregiros": boolean
  },
  "signals": [
    {
      "id": string,
      "familia": "ingresos" | "liquidez" | "credito" | "pagos" | "formalidad" | "legal",
      "tipo": "positiva" | "ambigua" | "riesgo" | "sin_datos",
      "titulo": string,
      "descripcionCorta": string,
      "importancia": 1 | 2 | 3,
      "valorResumen": string,
      "esLegal": boolean
    }
  ],
  "lenses": [
    {
      "institutionType": "bank" | "fintech" | "estado",
      "nombre": string,
      "headline": string,
      "resumen": string,
      "señalesClaves": [
        { "signalId": string, "impacto": "positivo" | "neutral" | "negativo", "comentario": string }
      ]
    }
  ]
}
`
```

### 2.5. Helper `callMirrorBuilderAgent`

```ts
// lib/agents/mirrorBuilderAgent.ts

import Anthropic from '@anthropic-ai/sdk'
import type { EspejoResponse } from '@/types/espejo'

const client = new Anthropic()

export async function callMirrorBuilderAgent(
  input: MirrorBuilderInput
): Promise<EspejoResponse> {
  const userMessage = JSON.stringify(input)

  // El cliente MCP debe estar configurado para exponer las tools de financial-mirror-mcp.
  // Detalle de configuración exacta del transporte stdio se decide en build time.
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: MIRROR_BUILDER_SYSTEM_PROMPT,
    // tools: [...]   ← inyectadas desde el cliente MCP en runtime
    messages: [{ role: 'user', content: userMessage }],
  })

  // Validación de salida
  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('MirrorBuilderAgent: no text block in response')
  }

  let parsed: EspejoResponse
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    throw new Error('MirrorBuilderAgent: invalid JSON in response')
  }

  if (!parsed.profileSummary || !Array.isArray(parsed.signals) || !Array.isArray(parsed.lenses)) {
    throw new Error('MirrorBuilderAgent: missing required fields')
  }

  return parsed
}
```

---

## 3. `ActionPlannerAgent`

### 3.1. Rol

Dado un perfil financiero, sus señales y una hipótesis de cambio, **simular**
el cambio (vía MCP) y devolver una `EspejoSimulationSuggestion` con explicación
en lenguaje ciudadano.

### 3.2. Input

```ts
export interface ActionPlannerInput {
  task: 'plan_simulation'
  segmento: 'emprendedora' | 'jubilado'
  goal: string                            // ej: "mejorar_estabilidad_y_menos_dependencia_credito"
  financialProfile: FinancialProfile
  signals: EspejoSignal[]
  hypothesis: {
    reducirUsoCupoPct?: number
    formalizarVentasPct?: number
    aumentarSaldoFinMes?: number
  }
}
```

### 3.3. Output

```ts
EspejoSimulationSuggestion  // ver 04-contrato-de-datos.md
```

### 3.4. System prompt

```ts
export const ACTION_PLANNER_SYSTEM_PROMPT = `
# Rol
Eres ActionPlannerAgent, un agente educativo que ayuda a una persona a
entender qué cambiaría en su "espejo financiero" si modifica un comportamiento
concreto.

# Herramientas disponibles
- simulate_change(financial_profile, action): aplica una acción y devuelve
  newProfile + changedSignals.

# Pasos
1. Lee la hipótesis del usuario y elige UNA acción concreta y realista.
   - Si "reducirUsoCupoPct" está presente: usar action = { tipo:
     "reducir_uso_cupo", cantidadPct: <valor> }.
   - Si "formalizarVentasPct" está presente: usar tipo "formalizar_ingresos".
   - Si "aumentarSaldoFinMes" está presente: usar tipo "aumentar_saldo_fin_mes".
2. Llama simulate_change(financial_profile, action).
3. Identifica qué señales mejoran (changedSignals).
4. Genera una explicación en 2-4 frases que cubra la mirada de Banco, Fintech
   y Estado de forma diferenciada. No prometas que un banco aprobará un
   crédito ni que la persona "ya está mejor".

# Restricciones
- No inventes nuevos campos del perfil.
- No emitas asesoría financiera regulada.
- Lenguaje ciudadano, sin tecnicismos innecesarios.
- Mantén el tono respetuoso, no paternalista.
- Una sola acción simulada (la principal). Si hay más de una hipótesis, elige
  la más alta de impacto.

# Formato de salida
Devuelve SOLO un JSON válido con esta forma:

{
  "accion": {
    "tipo": "reducir_uso_cupo" | "reducir_avances" | "aumentar_saldo_fin_mes" | "formalizar_ingresos",
    "cantidadPct": number
  },
  "descripcionAccion": string,
  "señalesMejoran": string[],
  "explicacion": string
}
`
```

### 3.5. Helper

```ts
export async function callActionPlannerAgent(
  input: ActionPlannerInput
): Promise<EspejoSimulationSuggestion> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: ACTION_PLANNER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: JSON.stringify(input) }],
  })

  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('ActionPlannerAgent: no text block')
  }
  const parsed = JSON.parse(textBlock.text) as EspejoSimulationSuggestion
  if (!parsed.accion || !parsed.descripcionAccion || !parsed.explicacion) {
    throw new Error('ActionPlannerAgent: missing required fields')
  }
  return parsed
}
```

---

## 4. `LetterGeneratorAgent`

### 4.1. Rol

Generar un **borrador de carta** ciudadana cuando el usuario activa la
acción "Generar carta" en una señal con `esLegal: true`. No usa MCP.

### 4.2. Input

```ts
export interface LetterGeneratorInput {
  tipoProblema: 'tasa_cercana_tmc' | 'cobro_no_autorizado' | 'portabilidad_credito'
  nombreInstitucion: string
  tipoProducto: 'tarjeta_credito' | 'credito_consumo' | 'cuenta_vista'
  segmento: 'emprendedora' | 'jubilado'
  nombreUsuario?: string
  rutUsuario?: string
}
```

### 4.3. Output

```ts
{ cartaTexto: string }
```

### 4.4. System prompt

```ts
export const LETTER_GENERATOR_SYSTEM_PROMPT = `
# Rol
Eres LetterGeneratorAgent, un asistente legal ciudadano para Chile. Tu tarea
es redactar un BORRADOR de carta formal en español para que una persona
ejerza sus derechos como consumidor financiero.

# Restricciones
- Esto es un BORRADOR, no asesoría legal individual. Incluye un disclaimer
  claro en la carta y al inicio del texto.
- No cites artículos específicos si no los tienes con certeza. Usa
  referencias genéricas tipo "la legislación chilena vigente sobre derechos
  del consumidor financiero" o "las normas que regulan los servicios fintech
  (Ley 21.521)" solo si aplica.
- La carta debe estar en primera persona, tono formal pero claro.
- Pide respuesta en un plazo razonable (10 días hábiles).
- No prometas resultados.

# Formato de salida
Devuelve SOLO el texto de la carta como string plano (sin JSON, sin markdown,
sin etiquetas). Empieza con "Estimados:" y termina con la firma del usuario
(o "[Nombre]" si no se entrega).

# Estructura sugerida (4-6 párrafos):
1. Saludo + identificación.
2. Descripción del producto y problema.
3. Solicitud concreta (revisión de tasa, cancelación de cargo, portabilidad,
   etc.).
4. Marco legal genérico aplicable.
5. Plazo de respuesta solicitado.
6. Despedida + firma.
`
```

### 4.5. Helper

```ts
export async function callLetterGeneratorAgent(
  input: LetterGeneratorInput
): Promise<{ cartaTexto: string }> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    system: LETTER_GENERATOR_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: JSON.stringify(input) }],
  })
  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('LetterGeneratorAgent: no text block')
  }
  return { cartaTexto: textBlock.text }
}
```

---

## 5. Configuración común del cliente MCP

`MirrorBuilderAgent` y `ActionPlannerAgent` necesitan que el cliente Anthropic
tenga las tools del MCP `financial-mirror-mcp` registradas en la llamada
`messages.create`. Esto se monta en `lib/claude.ts` o `lib/agents/mcpClient.ts`.

Opciones de transporte:
- **stdio (recomendado para el Lab):** el MCP corre como subproceso del backend
  o en una terminal aparte; el cliente Anthropic se configura para "ver" sus
  tools.
- **HTTP:** alternativa si se quiere correr el MCP en otro servicio.

> Nota: la API exacta para inyectar tools MCP en `client.messages.create`
> evoluciona con el SDK; la primera tarea del 6 mayo es validar la forma
> correcta con `@anthropic-ai/sdk` actualizado y `@modelcontextprotocol/sdk`.

## 6. Reglas de validación de salida (todos los agentes)

Para cada agente:

1. Asegurar que existe un `text` block en la respuesta.
2. `JSON.parse` con try/catch.
3. Verificar **al menos** los campos críticos del schema (no toda la
   estructura, solo los obligatorios).
4. Si algo falla → throw con mensaje claro → la API Route cae al fallback
   determinista.

## 7. Bonus agéntico (+5 en rúbrica)

Para anotar el bonus, el equipo declara en el entregable técnico:
- Que el `MirrorBuilderAgent` orquesta **5 tools MCP** en cadena.
- Que el `ActionPlannerAgent` razona sobre el output de `simulate_change` y
  **elige** entre múltiples acciones posibles.
- Screenshot de la consola Claude mostrando una invocación con tool calls
  y trazas.
