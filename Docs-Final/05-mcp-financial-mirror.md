# 05 — MCP `financial-mirror-mcp` (Python + FastMCP)

> Servidor MCP en Python que expone las tools de dominio que usan los agentes
> Claude. Implementación de referencia completa, lista para correr.

---

## 1. Decisiones de stack del MCP

| Decisión | Valor |
|---|---|
| Lenguaje | **Python 3.10+** |
| Framework MCP | **FastMCP** (`mcp.server.fastmcp`) |
| Transporte | **stdio** (local, ideal para Claude Desktop / agentes locales) |
| HTTP cliente | **httpx** (async) |
| Nombre del server | `financial-mirror-mcp` |
| Carpeta en repo | `mcp-server/` |
| Archivo principal | `financial_mirror_mcp.py` |

## 2. Setup

```bash
# Dentro de la carpeta mcp-server/
python -m venv .venv
source .venv/bin/activate    # macOS/Linux
# o:
.venv\Scripts\activate       # Windows

pip install fastmcp httpx
```

`requirements.txt`:
```
fastmcp>=0.4.0
httpx>=0.27.0
```

## 3. Tools expuestas

| Tool | Input | Output | Descripción |
|---|---|---|---|
| `parse_cartola` | `file_path: str` | `{ transacciones, periodoMeses, institucionesDetectadas }` | Lee cartola (stub MVP) |
| `fetch_macro_indicators` | `fecha_referencia: str` | `{ ufValor, ipcUltimoMesPct, tpmPct }` | UF, IPC, TPM desde mindicador.cl |
| `build_financial_profile` | `transacciones, periodoMeses, macro, fuenteDatos?` | `FinancialProfile` (dict) | Cálculo determinista del perfil |
| `extract_signals` | `financial_profile: dict` | `{ signals: [...] }` | Reglas de señales |
| `generate_lenses` | `financial_profile, signals` | `{ lenses: [...] }` | Lentes Banco/Fintech/Estado |
| `simulate_change` | `financial_profile, action` | `{ newProfile, changedSignals }` | What-if simple |

## 4. Resources y prompts

- Resource `macro-indicator://{tipo}` — texto explicativo de UF/IPC/TPM.
- Prompt `explain_indicator(indicator)` — plantilla para que Claude explique
  un indicador en lenguaje ciudadano.

## 5. Implementación de referencia

> Este código va en `mcp-server/financial_mirror_mcp.py`. Es el "código fuente"
> del MCP que ya quedó congelado y validado. **Construirlo durante la ventana
> del Lab** (6 mayo en adelante).

```python
"""
financial_mirror_mcp.py

Servidor MCP en Python para Espejo de Datos.

Expone tools para:
- parse_cartola: leer cartola (stub MVP).
- fetch_macro_indicators: UF, IPC, TPM desde mindicador.cl.
- build_financial_profile: calcular FinancialProfile determinista.
- extract_signals: derivar señales.
- generate_lenses: generar vistas Banco / Fintech / Estado.
- simulate_change: aplicar acción "what-if".
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Any, Literal, Optional

import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(name="financial-mirror-mcp")

# ---------------------------------------------------------------------
# CONSTANTES
# ---------------------------------------------------------------------

MINDICADOR_BASE = "https://mindicador.cl/api"

# ---------------------------------------------------------------------
# TOOL: fetch_macro_indicators
# ---------------------------------------------------------------------

@mcp.tool()
async def fetch_macro_indicators(fecha_referencia: str) -> Dict[str, float]:
    """
    Obtiene UF, IPC último mes y TPM desde mindicador.cl (Chile).
    fecha_referencia: 'YYYY-MM-DD' (por ahora ignorado, se devuelve el último valor).
    """
    uf_valor = 0.0
    ipc_ultimo_mes_pct = 0.0
    tpm_pct = 0.0

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            uf = (await client.get(f"{MINDICADOR_BASE}/uf")).raise_for_status().json()
            ipc = (await client.get(f"{MINDICADOR_BASE}/ipc")).raise_for_status().json()
            tpm = (await client.get(f"{MINDICADOR_BASE}/tpm")).raise_for_status().json()
            uf_valor = float(uf["serie"][0]["valor"])
            ipc_ultimo_mes_pct = float(ipc["serie"][0]["valor"])
            tpm_pct = float(tpm["serie"][0]["valor"])
        except Exception as e:
            print(f"[fetch_macro_indicators] Error: {e}")

    return {
        "ufValor": uf_valor,
        "ipcUltimoMesPct": ipc_ultimo_mes_pct,
        "tpmPct": tpm_pct,
    }

# ---------------------------------------------------------------------
# TOOL: parse_cartola (stub MVP)
# ---------------------------------------------------------------------

@mcp.tool()
def parse_cartola(file_path: str) -> Dict[str, Any]:
    """
    Lee cartola desde archivo. En MVP usa demos cableados por nombre.
    En post-MVP: parser real de PDF/Excel.
    """
    if "paula" in file_path.lower():
        transacciones = [
            {"fecha": "2026-01-03", "monto": 750000.0, "tipo": "abono",
             "descripcion": "Ventas redes sociales", "saldo": 200000.0},
            {"fecha": "2026-01-10", "monto": -180000.0, "tipo": "cargo",
             "descripcion": "Pago tarjeta tienda", "saldo": 20000.0},
            {"fecha": "2026-01-25", "monto": -120000.0, "tipo": "cargo",
             "descripcion": "Avance en efectivo", "saldo": -100000.0},
            # ... añadir 2 meses adicionales para que periodoMeses=3 sea consistente
        ]
        return {
            "transacciones": transacciones,
            "periodoMeses": 3,
            "institucionesDetectadas": ["BancoEstado"],
        }

    return {
        "transacciones": [
            {"fecha": "2026-02-01", "monto": 1500000.0, "tipo": "abono",
             "descripcion": "Sueldo", "saldo": 400000.0},
            {"fecha": "2026-02-05", "monto": -350000.0, "tipo": "cargo",
             "descripcion": "Crédito consumo", "saldo": 50000.0},
        ],
        "periodoMeses": 3,
        "institucionesDetectadas": ["Banco Genérico"],
    }

# ---------------------------------------------------------------------
# TOOL: build_financial_profile
# ---------------------------------------------------------------------

def _relative_std(values: List[float]) -> float:
    if not values:
        return 0.0
    mean = sum(values) / len(values)
    if mean == 0:
        return 0.0
    var = sum((v - mean) ** 2 for v in values) / len(values)
    return (var ** 0.5) / mean

@mcp.tool()
def build_financial_profile(
    transacciones: List[Dict[str, Any]],
    periodoMeses: int,
    macro: Dict[str, float],
    fuenteDatos: str = "cartola_manual",
) -> Dict[str, Any]:
    """Construye FinancialProfile determinista desde transacciones + macro."""
    if periodoMeses <= 0:
        periodoMeses = 1

    ingresos_por_mes: Dict[str, float] = {}
    egresos_por_mes: Dict[str, float] = {}
    saldos_fin_mes: Dict[str, float] = {}

    for t in transacciones:
        fecha = t.get("fecha", "")
        monto = float(t.get("monto", 0.0))
        tipo = t.get("tipo", "cargo")
        saldo = t.get("saldo")
        mes = fecha[:7] if len(fecha) >= 7 else "0000-00"
        if tipo == "abono":
            ingresos_por_mes[mes] = ingresos_por_mes.get(mes, 0.0) + monto
        else:
            egresos_por_mes[mes] = egresos_por_mes.get(mes, 0.0) + abs(monto)
        if saldo is not None:
            saldos_fin_mes[mes] = float(saldo)

    promedio = lambda lst: sum(lst) / len(lst) if lst else 0.0
    ingresos_prom = promedio(list(ingresos_por_mes.values()))
    egresos_prom = promedio(list(egresos_por_mes.values()))
    saldo_prom = promedio(list(saldos_fin_mes.values()))
    meses_neg = sum(1 for v in saldos_fin_mes.values() if v < 0)

    if len(ingresos_por_mes) <= 1:
        regularidad = "irregular"
    else:
        d = _relative_std(list(ingresos_por_mes.values()))
        regularidad = "estable" if d < 0.15 else ("variable" if d < 0.40 else "irregular")

    if saldo_prom > 200000:
        presion = "baja"
    elif saldo_prom > 0:
        presion = "media"
    elif meses_neg <= 1:
        presion = "alta"
    else:
        presion = "critica"

    tiene_avances = any("avance" in (t.get("descripcion", "").lower()) for t in transacciones)
    tiene_sobregiros = meses_neg > 0

    return {
        "metadata": {
            "fechaAnalisis": datetime.now().strftime("%Y-%m-%d"),
            "fuenteDatos": fuenteDatos,
            "periodoAnalizadoMeses": periodoMeses,
            "institucionesDetectadas": [],
            "fuentesConsultadas": ["cartola", "mindicador"],
        },
        "ingresos": {
            "promedioMensual": ingresos_prom,
            "regularidad": regularidad,
            "fuentes": 1,
            "tendencia": "estable",
        },
        "egresos": {
            "promedioMensual": egresos_prom,
            "essentials": egresos_prom * 0.6,
            "serviciosRecurrentes": egresos_prom * 0.2,
            "creditoCuotas": egresos_prom * 0.15,
            "avancesEfectivo": egresos_prom * 0.05,
            "otros": 0.0,
        },
        "liquidez": {
            "saldoPromedioFinMes": saldo_prom,
            "mesesConSaldoNegativo": meses_neg,
            "presion": presion,
        },
        "credito": {
            "usoCupoEstimadoPct": 85.0 if (tiene_avances or tiene_sobregiros) else 40.0,
            "tieneAvancesEfectivo": tiene_avances,
            "tieneSobregiros": tiene_sobregiros,
            "pagosPuntuales": True,
            "tasaEfectivaEstimadoPct": 42.0 if tiene_avances else 28.0,
        },
        "tributario": {
            "ingresoTributarioEstimado": ingresos_prom * 12 * 0.6,
            "ingresoBancarioEstimado": ingresos_prom * 12,
            "brechaFormalidadPct": 40.0 if regularidad == "irregular" else 20.0,
        },
        "benchmarks": {
            "ufValor": macro.get("ufValor", 0.0),
            "ipcUltimoMesPct": macro.get("ipcUltimoMesPct", 0.0),
            "tpmPct": macro.get("tpmPct", 0.0),
        },
    }

# ---------------------------------------------------------------------
# TOOL: extract_signals
# ---------------------------------------------------------------------

@mcp.tool()
def extract_signals(financial_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Deriva señales canónicas desde FinancialProfile."""
    signals: List[Dict[str, Any]] = []

    ingresos = financial_profile.get("ingresos", {})
    liquidez = financial_profile.get("liquidez", {})
    credito = financial_profile.get("credito", {})
    tributario = financial_profile.get("tributario", {})

    uso_cupo = float(credito.get("usoCupoEstimadoPct", 0.0))
    if uso_cupo >= 80:
        signals.append({
            "id": "sig_uso_cupo_alto", "familia": "credito", "tipo": "riesgo",
            "titulo": "Uso de cupo muy alto",
            "descripcionCorta": "Casi siempre estás usando más del 80% de tu cupo de crédito.",
            "importancia": 3, "valorResumen": f"Uso de cupo ~{uso_cupo:.0f}%",
            "esLegal": False,
        })
    elif uso_cupo >= 50:
        signals.append({
            "id": "sig_uso_cupo_medio", "familia": "credito", "tipo": "ambigua",
            "titulo": "Uso de cupo intermedio",
            "descripcionCorta": "Tu uso de cupo es moderado, conviene mirarlo.",
            "importancia": 2, "valorResumen": f"Uso de cupo ~{uso_cupo:.0f}%",
            "esLegal": False,
        })

    presion = liquidez.get("presion", "media")
    if presion in ("alta", "critica"):
        signals.append({
            "id": "sig_liquidez_justa", "familia": "liquidez", "tipo": "riesgo",
            "titulo": "Liquidez muy ajustada",
            "descripcionCorta": "Llegas a fin de mes con saldos bajos o negativos.",
            "importancia": 3,
            "valorResumen": f"Saldo fin mes ~{liquidez.get('saldoPromedioFinMes', 0):.0f}",
            "esLegal": False,
        })

    if ingresos.get("regularidad") == "irregular":
        signals.append({
            "id": "sig_ingresos_irregulares", "familia": "ingresos", "tipo": "ambigua",
            "titulo": "Ingresos irregulares",
            "descripcionCorta": "Tus ingresos varían bastante de un mes a otro.",
            "importancia": 2, "valorResumen": "Regularidad: variable",
            "esLegal": False,
        })

    brecha = float(tributario.get("brechaFormalidadPct", 0.0))
    if brecha >= 30:
        signals.append({
            "id": "sig_brecha_formalidad", "familia": "formalidad", "tipo": "ambigua",
            "titulo": "Brecha entre cartola y declaración",
            "descripcionCorta": "Lo que entra a tu cuenta parece más que lo declarado formalmente.",
            "importancia": 2, "valorResumen": f"Brecha ~{brecha:.0f}%",
            "esLegal": False,
        })

    tasa = float(credito.get("tasaEfectivaEstimadoPct", 0.0))
    if tasa >= 40.0:
        signals.append({
            "id": "sig_tasa_cercana_tmc", "familia": "legal", "tipo": "riesgo",
            "titulo": "Tasa cercana al máximo legal",
            "descripcionCorta": "La tasa estimada de tu crédito está cerca del límite legal.",
            "importancia": 2, "valorResumen": f"Tasa ~{tasa:.1f}%",
            "esLegal": True,
        })

    return {"signals": signals}

# ---------------------------------------------------------------------
# TOOL: generate_lenses
# ---------------------------------------------------------------------

@mcp.tool()
def generate_lenses(
    financial_profile: Dict[str, Any],
    signals: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Genera lentes Banco / Fintech / Estado."""
    ingresos = financial_profile.get("ingresos", {})
    credito = financial_profile.get("credito", {})

    uso_cupo = float(credito.get("usoCupoEstimadoPct", 0.0))
    regularidad = ingresos.get("regularidad", "irregular")

    def señales_para(filtro):
        return [
            {"signalId": s["id"], "impacto": filtro(s), "comentario": ""}
            for s in signals
        ]

    bank = {
        "institutionType": "bank", "nombre": "Banco",
        "headline": f"Te vemos con ingresos {regularidad} y uso de crédito alrededor de {uso_cupo:.0f}%.",
        "resumen": (
            "Un banco tradicional se fija en qué tan predecibles son tus "
            "ingresos y cuánto dependes del crédito para llegar a fin de mes."
        ),
        "señalesClaves": señales_para(lambda s: (
            "negativo" if s["id"] in ("sig_uso_cupo_alto", "sig_liquidez_justa", "sig_ingresos_irregulares")
            else "positivo" if s["id"] == "sig_pagos_puntuales"
            else "neutral"
        )),
    }

    fintech = {
        "institutionType": "fintech", "nombre": "Fintech",
        "headline": "Vemos actividad constante; tu uso de crédito puede limitar nuevas ofertas.",
        "resumen": (
            "Una fintech tolera mejor ingresos variables si ve movimiento "
            "frecuente y cumplimiento de pagos."
        ),
        "señalesClaves": señales_para(lambda s: (
            "negativo" if s["id"] == "sig_uso_cupo_alto"
            else "neutral" if s["id"] == "sig_ingresos_irregulares"
            else "neutral"
        )),
    }

    estado = {
        "institutionType": "estado", "nombre": "Estado / SII",
        "headline": "Nos importa que tu realidad bancaria coincida con lo que declaras.",
        "resumen": (
            "Desde la mirada del Estado, el foco está en la formalidad y en "
            "que la brecha entre cartola y declaración no sea excesiva."
        ),
        "señalesClaves": señales_para(lambda s: (
            "negativo" if s["id"] == "sig_brecha_formalidad" else "neutral"
        )),
    }

    return {"lenses": [bank, fintech, estado]}

# ---------------------------------------------------------------------
# TOOL: simulate_change
# ---------------------------------------------------------------------

@mcp.tool()
def simulate_change(
    financial_profile: Dict[str, Any],
    action: Dict[str, Any],
) -> Dict[str, Any]:
    """Aplica una acción what-if simple. Devuelve newProfile y changedSignals."""
    tipo = action.get("tipo")
    cantidad_pct = float(action.get("cantidadPct", 0.0))

    new_profile = dict(financial_profile)
    credito = dict(new_profile.get("credito", {}))
    liquidez = dict(new_profile.get("liquidez", {}))
    changed: List[Dict[str, Any]] = []

    if tipo == "reducir_uso_cupo" and cantidad_pct > 0:
        actual = float(credito.get("usoCupoEstimadoPct", 0.0))
        nuevo = max(0.0, actual - cantidad_pct)
        credito["usoCupoEstimadoPct"] = nuevo
        new_profile["credito"] = credito

        if actual >= 80:
            changed.append({
                "id": "sig_uso_cupo_alto",
                "from": "riesgo",
                "to": "ambigua" if nuevo >= 50 else "positiva",
            })

        # Liquidez mejora marginalmente al bajar el uso de cupo
        actual_saldo = float(liquidez.get("saldoPromedioFinMes", 0.0))
        liquidez["saldoPromedioFinMes"] = actual_saldo + 50000  # heurística
        if liquidez.get("presion") == "alta":
            liquidez["presion"] = "media"
            changed.append({"id": "sig_liquidez_justa", "from": "riesgo", "to": "ambigua"})
        new_profile["liquidez"] = liquidez

    return {"newProfile": new_profile, "changedSignals": changed}

# ---------------------------------------------------------------------
# RESOURCES + PROMPT
# ---------------------------------------------------------------------

@mcp.resource("macro-indicator://{tipo}")
def macro_indicator_resource(tipo: str) -> str:
    if tipo == "uf": return "UF (Unidad de Fomento), valor indexado a la inflación."
    if tipo == "ipc": return "IPC (Índice de Precios al Consumidor), variación mensual."
    if tipo == "tpm": return "TPM (Tasa de Política Monetaria) fijada por el Banco Central."
    return f"Indicador desconocido: {tipo}"

@mcp.prompt()
def explain_indicator(indicator: str) -> str:
    return (
        f"Explica en lenguaje ciudadano qué significa '{indicator}', "
        "en máximo 3 frases, con un ejemplo cercano a la vida cotidiana."
    )

# ---------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

## 6. Cómo lo conecta el backend Next

El backend invoca el MCP como uno de los `mcp_servers` del cliente Claude.
La configuración mínima en `lib/agents/` (TypeScript) puede usar el helper
de transporte stdio del SDK:

```ts
// lib/agents/mcpClient.ts (boceto)
// Conecta vía stdio al proceso financial_mirror_mcp.py.
// Detalle de la API exacta: revisar @modelcontextprotocol/sdk en la fase de implementación.
```

Para el equipo en el Lab: la opción más simple es correr el MCP en una
terminal aparte y pasarle el path al cliente del agente. Detalle de
integración exacto se decide el 6 mayo durante la construcción.

## 7. Pruebas mínimas del MCP (durante el Lab)

1. Arrancar el server: `python financial_mirror_mcp.py`.
2. Probar cada tool desde Claude Code o MCP Inspector con inputs de muestra.
3. Validar que `extract_signals` devuelve al menos las 4 señales canónicas
   para el perfil de Paula.
4. Validar que `simulate_change` con `tipo=reducir_uso_cupo, cantidadPct=20`
   cambia `sig_uso_cupo_alto` de `riesgo` a `ambigua` y `sig_liquidez_justa`
   de `riesgo` a `ambigua`.
