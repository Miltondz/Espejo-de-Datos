# Ficha de Proyecto — Espejo de Datos
**Claude Impact Lab Chile 2026 · Línea 01 Inclusión Financiera · AI Builder**

---

## 1. Problema (≤ 300 caracteres, sin jerga técnica)

> "Tu banco ya sabe cómo eres financieramente. Tú no. Espejo de Datos te muestra la misma lectura que ellos hacen — en lenguaje simple, sin guardar tus datos."

**Longitud:** 175 caracteres.
**Jerga técnica usada:** ninguna. Los términos "banco" y "datos" son de uso cotidiano.

---

## 2. Segmento ciudadano específico

| Campo | Detalle |
|---|---|
| **Grupo etario** | 25 a 65 años |
| **Perfil** | Trabajadores dependientes, emprendedores/independientes y pensionados |
| **Ubicación** | Región Metropolitana, Valparaíso y Biobío (concentran el 65% del sistema financiero personal de Chile) |
| **Condición socioeconómica** | Segmento C2 y D — ingresos mensuales entre $500.000 y $1.200.000 CLP |
| **Condición financiera** | Con cuenta bancaria activa, al menos un producto de crédito vigente, pero sin formación financiera formal ni acceso a asesoría privada |
| **Personas representadas en demo** | **Paula** (emprendedora, 34 años, Santiago) y **Luis** (jubilado AFP, 68 años, Valparaíso) |

---

## 3. Canal de adopción concreto

| Canal | Detalle | Estado MVP |
|---|---|---|
| **B2G — primario** | Programa de educación financiera CMF Educa, SERNAC y municipios con fomento productivo | Identificado · pendiente contacto formal post-Lab |
| **B2NGO — secundario** | ONGs de inclusión financiera: ASECH, Fundación ChileMujeres, FINCA | Identificado como Fase 2 |
| **B2C — directo** | App pública para usuarios individuales | Existe y funciona · no es el foco de impacto del MVP |

**Justificación del canal B2G como primario:**
Las instituciones públicas (CMF Educa, SERNAC, municipios) ya tienen el mandato legal y los canales de llegada a los segmentos C2-D. Espejo de Datos no necesita construir distribución desde cero — se integra como herramienta a los programas existentes de educación financiera ciudadana, que llegan a cientos de miles de personas por año a costo marginal cercano a cero para el producto.

---

## 4. Impacto cuantificado con fuente verificable

| Métrica | Valor | Fuente | URL |
|---|---|---|---|
| Personas con deuda vigente en el sistema financiero regulado | > 8 millones | CMF Chile — Informe de Endeudamiento de los Hogares | https://www.cmf.cl/estadisticas/ |
| Reclamos financieros recibidos por SERNAC (2023) | > 100.000 | SERNAC — Estadísticas de reclamos | https://www.sernac.cl/portal/604/w3-propertyvalue-1052.html |
| Tasa de comprensión financiera en adultos chilenos | Baja (quintil inferior OCDE) | CMF — Encuesta de Inclusión Financiera 2023 | https://www.cmf.cl/informes/ |

**Impacto directo del producto:** Cada usuario que corre el Espejo obtiene, por primera vez, la misma lectura de su perfil financiero que hacen los sistemas institucionales — sin costo, sin registro, en <30 segundos.

---

## 5. Fuentes regulatorias oficiales (≥ 2 con URL)

| Ley / Norma | Relevancia para el producto | URL oficial |
|---|---|---|
| **Ley 21.719** — Protección de datos personales (2024) | Marco bajo el que opera el tratamiento de cartolas: sin persistencia, datos mínimos, Privacy by Design | https://www.bcn.cl/leychile/navegar?idNorma=1209272 |
| **Ley 19.628** — Protección de la vida privada | Principios de proporcionalidad y seguridad vigentes | https://www.bcn.cl/leychile/navegar?idNorma=141599 |
| **Ley 21.658** — Fintech y Open Finance | Marco de transparencia financiera en que se inscribe la herramienta | https://www.bcn.cl/leychile/navegar?idNorma=1184427 |
| **Ley 20.575** — Principio de finalidad (DICOM) | Impide usar datos financieros con propósito distinto al informado | https://www.bcn.cl/leychile/navegar?idNorma=1031325 |
| **Ley 18.010** — TMC (Tasa Máxima Convencional) | Referencia para la señal de tasa cercana al límite legal | https://www.bcn.cl/leychile/navegar?idNorma=29570 |
| **Ley 19.496** — SERNAC / Protección del consumidor | Base de las cartas de reclamo que genera el agente | https://www.bcn.cl/leychile/navegar?idNorma=61438 |

---

## 6. Datos responsables — trazabilidad

- La cartola se procesa en memoria RAM y se elimina automáticamente en el bloque `finally` del API route (ver `app/api/analyze/route.ts` línea 127–138).
- Ninguna transacción individual se persiste en base de datos ni en logs de aplicación.
- Las afirmaciones legales del agente se derivan de extractos de ley reales almacenados en `data/leyes-referencias.ts`, referenciados via Citations de Claude API.
- Los indicadores macro (UF, TPM, TMC, dólar, IPC) se obtienen en tiempo real desde `mindicador.cl` y el API del Banco Central de Chile (`si3.bcentral.cl`) — nunca se inventan.

---

## 7. Uso de Claude + arquitectura agéntica

| Componente | Evidencia |
|---|---|
| **System prompt MirrorBuilderAgent** | >200 chars, menciona CMF, Ley 21.719, Fintech. Ver `entregable/MIRROR_BUILDER_SYSTEM_PROMPT.txt` |
| **Tools MCP con schema JSON** | 6 tools con schema completo. Ver `entregable/MCP_TOOLS_SCHEMA.txt` |
| **Modelos usados** | `claude-sonnet-4-6` (agente principal y simulación), `claude-haiku-4-5` (generador de cartas) |
| **Features Anthropic** | Agent SDK · Files API · Extended Thinking · Citations · Prompt Caching · MCP Server |
| **Consola Anthropic** | Mensajes generados durante la ventana 6–7 mayo 2026 — verificables en `console.anthropic.com` → Logs |

---

## 8. Equipo

| Persona | Rol |
|---|---|
| Milton | Arquitectura · Backend · IA |
| Alejandra | Liderazgo · Frontend · UX |
| Adolfo | Negocio · Adopción |
| Renzo | Legal · Datos Personales |
