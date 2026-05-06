# Espejo de Datos (Espejo Financiero)

> Convierte tu cartola bancaria en un **espejo financiero ciudadano**: un resumen legible de cómo te ven Banco, Fintech y Estado, con señales claras y simulaciones “what‑if”.

---

## 1. Visión general

Espejo de Datos es un MVP construido para un hackatón con Anthropic. El flujo principal:

1. La persona sube una **cartola** (o usa un perfil demo, como “Paula”).
2. Un **servidor MCP en Python** parsea la cartola y obtiene indicadores macro (UF, IPC, TPM).[web:232][web:335][web:339]
3. Un **agente Claude** construye un `FinancialProfile` y un `EspejoResponse` con:
   - resumen de perfil,
   - señales (positivas, ambiguas, riesgo y legales),
   - lentes de Banco / Fintech / Estado.
4. El usuario puede simular un cambio (“¿qué pasa si bajo mi uso de cupo 20%?”) y ver el impacto.

El enfoque es **explicabilidad y educación**, no scoring opaco ni toma de decisiones de crédito.

---

## 2. Stack técnico

- **Frontend / Backend web**
  - Next.js 14 (App Router) + React + TypeScript.[web:365][web:370]
  - Tailwind CSS para estilos.

- **IA y agentes**
  - Claude Sonnet 4.6 vía `@anthropic-ai/sdk`.
  - Agentes:
    - `MirrorBuilderAgent` (construye el espejo desde cartola + MCP).
    - `ActionPlannerAgent` (simula cambios “what‑if” y los explica).[web:312][web:311]

- **MCP server**
  - Python 3.10+.
  - `fastmcp` / MCP Python SDK para exponer tools y resources.[web:335][web:339]
  - Archivo principal: `financial_mirror_mcp.py`.

- **Contratos de datos**
  - `FinancialProfile` en `types/profile.ts`.
  - `EspejoResponse` en `types/espejo.ts` (lo que consume el frontend).

---

## 3. Estructura de carpetas (propuesta)

```text
espejo-datos/
  app/
    layout.tsx
    page.tsx                # Landing
    analizador/
      page.tsx              # Pantalla principal Espejo
    dashboard/
      page.tsx
    educacion/
      page.tsx
    historial/
      page.tsx
    comunidad/
      page.tsx
    api/
      analyze/
        route.ts            # POST /api/analyze
      simulate/
        route.ts            # POST /api/simulate
      generar-carta/
        route.ts            # POST /api/generar-carta
  components/
    espejo/
      ProfileSummaryCard.tsx
      SignalsGrid.tsx
      InstitutionLensesTabs.tsx
      SimulationPanel.tsx
      CartolaUpload.tsx
      PasaporteButton.tsx
      CartaModal.tsx
  lib/
    data-adapter.ts         # transforma cartola/macro → FinancialProfile
    espejo-builder.ts       # FinancialProfile → EspejoResponse
    simulation.ts           # lógica determinista de simulación
    agents/
      mirrorBuilderAgent.ts
      actionPlannerAgent.ts
  types/
    profile.ts              # FinancialProfile
    espejo.ts               # EspejoResponse y subtipos
  data/
    demo-espejo-paula.json
    demo-financial-profile-paula.json
  mcp-server/
    financial_mirror_mcp.py # servidor MCP Python
  .claude/
    CLAUDE.md               # instrucciones para Claude Code
  README.md
```

---

## 4. Flujo principal (alto nivel)

### 4.1. `/api/analyze`

1. **Modo demo**
   - `POST /api/analyze` con `{ "mode": "demo", "demoId": "paula", "segmento": "emprendedora" }`.
   - La API usa un `FinancialProfile` mock + `espejo-builder.ts` para devolver un `EspejoResponse` determinista.

2. **Modo cartola real**
   - `POST /api/analyze` con `multipart/form-data` (`file`, `segmento`).
   - Flujo:
     1. El backend guarda el archivo temporalmente.
     2. Llama a `MirrorBuilderAgent` con un JSON tipo:

        ```json
        {
          "task": "build_espejo",
          "segmento": "emprendedora",
          "cartola": { "filePath": "/tmp/cartola-paula.pdf" },
          "fechaReferencia": "2026-03-31"
        }
        ```

     3. El agente usa MCP:
        - `parse_cartola(file_path)`,
        - `fetch_macro_indicators(fecha_referencia)`,
        - `build_financial_profile`,
        - `extract_signals`,
        - `generate_lenses`.
     4. Devuelve un `EspejoResponse` listo para el frontend.

### 4.2. `/api/simulate`

- `POST /api/simulate` con:

  ```json
  {
    "segmento": "emprendedora",
    "goal": "mejorar_estabilidad_y_menos_dependencia_credito",
    "hypothesis": { "reducirUsoCupoPct": 20 },
    "financialProfile": { "...": "perfil actual" },
    "signals": [ "...": "señales actuales" ]
  }
  ```

- La API llama a `ActionPlannerAgent`, que usa MCP `simulate_change` para:
  - producir un nuevo perfil (opcional),
  - devolver `simulationSuggestion` (acción + explicación).

---

## 5. MCP Python: tools clave

Archivo: `mcp-server/financial_mirror_mcp.py`.

Tools principales:

- `parse_cartola(file_path: str) -> { transacciones, periodoMeses, institucionesDetectadas }`  
  Stub MVP: devuelve movimientos de ejemplo según nombre de archivo.

- `fetch_macro_indicators(fecha_referencia: str) -> { ufValor, ipcUltimoMesPct, tpmPct }`  
  Llama a `https://mindicador.cl/api` (UF, IPC, TPM).[web:232][web:335][web:339]

- `build_financial_profile(transacciones, periodoMeses, macro, fuenteDatos)`  
  Calcula un `FinancialProfile` determinista (sin IA).

- `extract_signals(financial_profile) -> { signals: EspejoSignal[] }`  
  Reglas simples (uso de cupo alto, liquidez justa, ingresos irregulares, brecha de formalidad, señal legal demo).

- `generate_lenses(financial_profile, signals) -> { lenses: EspejoLens[] }`  
  Construye tres lentes: Banco, Fintech y Estado.

- `simulate_change(financial_profile, action) -> { newProfile, changedSignals[] }`  
  Aplica acciones “what‑if” tipo `reducir_uso_cupo`.

Resources y prompt:

- `macro-indicator://{tipo}` (uf|ipc|tpm) → explicación corta.
- `explain_indicator(indicator)` → prompt reusable para explicar un indicador.

---

## 6. Puesta en marcha (desarrollo)

### 6.1. Requisitos

- Node.js 20+
- pnpm / npm / yarn
- Python 3.10+
- API key de Anthropic (para Claude)
- Acceso a internet para `mindicador.cl`[web:232]

### 6.2. Instalación

```bash
# Clonar el repo
git clone https://github.com/<ORG>/<REPO>.git
cd <REPO>

# Backend / Frontend
pnpm install            # o npm install / yarn

# MCP Python
cd mcp-server
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install fastmcp httpx
```

Configurar variables de entorno (crear `.env.local`):

```bash
ANTHROPIC_API_KEY=tu_api_key
# Opcional: puertos específicos, etc.
```

### 6.3. Ejecutar en desarrollo

En una terminal (Next.js):

```bash
pnpm dev
# o npm run dev
```

En otra terminal (MCP):

```bash
cd mcp-server
source .venv/bin/activate
python financial_mirror_mcp.py
```

---

## 7. Uso de Claude Code en este repo

Este repo incluye un `CLAUDE.md` con reglas para Claude Code (estructura del proyecto, contratos de datos, roles de skills).  
Recomendado según mejores prácticas oficiales:[web:368][web:371][web:374]

- Mantener `CLAUDE.md` **breve y estable**.
- Usar prompts estructurados con:
  - contexto → intención → formato de salida.[web:287][web:296]
- Hacer que Claude Code:
  - primero genere un **plan**,
  - luego aplique cambios en archivos específicos.[web:374]

Roles típicos de uso:

- Alejandra:
  - `espejo-frontend-builder`: componentes y páginas.
  - `espejo-copy-and-narrative-writer`: textos ciudadanos.
- Milton:
  - `espejo-dal-and-domain-builder`: lógica de dominio TS.
  - `espejo-api-routes-builder`: endpoints.
  - `espejo-mcp-tools-builder`: MCP Python.
  - `espejo-agents-designer`: prompts de agentes.

---

## 8. Estado actual del MVP

- 🔜 Front `/analizador` conectado a JSON demo (Paula).
- 🔄 MCP Python con tools stub y `fetch_macro_indicators`.
- 🔜 Integración de `MirrorBuilderAgent` con `/api/analyze`.
- 🔜 Integración de `ActionPlannerAgent` con `/api/simulate`.
- 🔜 Pasaporte imprimible y generador de carta demo.

✅🔄🔜
---

## 9. Licencia

Por definir.

---

## 10. Contacto del equipo

- Arquitectura / Backend / IA: Milton
- Liderazgo / Frontend / UX: Alejandra
- Negocio / Adopción: Adolfo
- Legal / Datos Personales: Renzo
