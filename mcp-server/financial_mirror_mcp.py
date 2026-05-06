"""
financial_mirror_mcp.py

Servidor MCP para Espejo de Datos.
Expone 6 tools de dominio que usan los agentes Claude:
  - fetch_macro_indicators  → UF, IPC, TPM, TMC (mindicador.cl) + USD/CLP, IMACEC (BDE)
  - parse_cartola           → stub MVP / futuro parser PDF/Excel
  - build_financial_profile → FinancialProfile determinista
  - extract_signals         → señales canónicas (umbral TMC dinámico)
  - generate_lenses         → vistas Banco / Fintech / Estado
  - simulate_change         → what-if simple

Transporte: stdio (conecta con Claude Desktop o agentes locales).
"""

from __future__ import annotations

import os
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from urllib.parse import quote

import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(name="financial-mirror-mcp")

MINDICADOR_BASE = "https://mindicador.cl/api"
BDE_BASE        = "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx"

# ─────────────────────────────────────────────────────────────────────────────
# TOOL: fetch_macro_indicators
# ─────────────────────────────────────────────────────────────────────────────

def _bde_url(series_id: str, firstdate: str, lastdate: str) -> Optional[str]:
    user = os.environ.get("BDE_USER", "")
    pwd  = os.environ.get("BDE_PASS", "")
    if not user or not pwd:
        return None
    return (
        f"{BDE_BASE}?user={quote(user)}&pass={quote(pwd)}"
        f"&function=GetSeries&timeseries={series_id}"
        f"&firstdate={firstdate}&lastdate={lastdate}"
    )

def _last_bde_value(data: Dict) -> Optional[float]:
    try:
        obs = data.get("Series", {}).get("Obs", [])
        if obs:
            return float(obs[-1]["value"])
    except Exception:
        pass
    return None

@mcp.tool()
async def fetch_macro_indicators(fecha_referencia: str) -> Dict[str, Any]:
    """
    Obtiene indicadores macro oficiales:
      - UF, IPC, TPM, TMC desde mindicador.cl
      - Dólar observado (F073.TCO.PRE.Z.D) desde Banco Central BDE
      - IMACEC (F032.IMC.IND.Z.Z.EP18.Z.Z.0.M) desde Banco Central BDE
    BDE requiere BDE_USER y BDE_PASS en variables de entorno.
    Devuelve fallback si cualquier fuente falla.
    fecha_referencia: 'YYYY-MM-DD'.
    """
    FALLBACK: Dict[str, Any] = {
        "ufValor": 36500.0,
        "ipcUltimoMesPct": 0.3,
        "tpmPct": 4.75,
        "tmcPct": 45.0,
        "usdClp": None,
        "imacec": None,
    }

    today    = fecha_referencia or datetime.now().strftime("%Y-%m-%d")
    d30_ago  = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
    d90_ago  = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")

    result = dict(FALLBACK)

    async with httpx.AsyncClient(timeout=10.0) as client:

        # mindicador.cl — UF, IPC, TPM, TMC
        for key, endpoint, field in [
            ("ufValor",        "uf",  "ufValor"),
            ("ipcUltimoMesPct","ipc", "ipcUltimoMesPct"),
            ("tpmPct",         "tpm", "tpmPct"),
            ("tmcPct",         "tmc", "tmcPct"),
        ]:
            try:
                resp = await client.get(f"{MINDICADOR_BASE}/{endpoint}")
                resp.raise_for_status()
                result[key] = float(resp.json()["serie"][0]["valor"])
            except Exception as e:
                print(f"[fetch_macro_indicators] {endpoint.upper()} error: {e}")

        # BDE — Dólar observado
        url = _bde_url("F073.TCO.PRE.Z.D", d30_ago, today)
        if url:
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                val = _last_bde_value(resp.json())
                if val is not None:
                    result["usdClp"] = val
            except Exception as e:
                print(f"[fetch_macro_indicators] BDE USD/CLP error: {e}")

        # BDE — IMACEC
        url = _bde_url("F032.IMC.IND.Z.Z.EP18.Z.Z.0.M", d90_ago, today)
        if url:
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                val = _last_bde_value(resp.json())
                if val is not None:
                    result["imacec"] = val
            except Exception as e:
                print(f"[fetch_macro_indicators] BDE IMACEC error: {e}")

    return result


# ─────────────────────────────────────────────────────────────────────────────
# TOOL: parse_cartola  (stub MVP)
# ─────────────────────────────────────────────────────────────────────────────

@mcp.tool()
def parse_cartola(file_path: str) -> Dict[str, Any]:
    """
    Lee cartola desde archivo. MVP: demos por nombre de archivo.
    Post-MVP: parser real PDF/Excel con pdfplumber / openpyxl.
    """
    nombre = file_path.lower()

    if "paula" in nombre:
        return {
            "transacciones": [
                # Enero
                {"fecha": "2026-01-03", "monto": 750000.0,  "tipo": "abono",  "descripcion": "Ventas enero",       "saldo": 750000.0},
                {"fecha": "2026-01-10", "monto": -180000.0, "tipo": "cargo",  "descripcion": "Pago tarjeta",        "saldo": 570000.0},
                {"fecha": "2026-01-20", "monto": -200000.0, "tipo": "cargo",  "descripcion": "Arriendo",            "saldo": 370000.0},
                {"fecha": "2026-01-25", "monto": -120000.0, "tipo": "cargo",  "descripcion": "Avance en efectivo",  "saldo": 50000.0},
                # Febrero
                {"fecha": "2026-02-03", "monto": 600000.0,  "tipo": "abono",  "descripcion": "Ventas febrero",     "saldo": 650000.0},
                {"fecha": "2026-02-12", "monto": -180000.0, "tipo": "cargo",  "descripcion": "Pago tarjeta",        "saldo": 470000.0},
                {"fecha": "2026-02-20", "monto": -200000.0, "tipo": "cargo",  "descripcion": "Arriendo",            "saldo": 270000.0},
                {"fecha": "2026-02-27", "monto": -310000.0, "tipo": "cargo",  "descripcion": "Gastos varios",       "saldo": -40000.0},
                # Marzo
                {"fecha": "2026-03-03", "monto": 900000.0,  "tipo": "abono",  "descripcion": "Ventas marzo",        "saldo": 860000.0},
                {"fecha": "2026-03-11", "monto": -180000.0, "tipo": "cargo",  "descripcion": "Pago tarjeta",        "saldo": 680000.0},
                {"fecha": "2026-03-20", "monto": -200000.0, "tipo": "cargo",  "descripcion": "Arriendo",            "saldo": 480000.0},
                {"fecha": "2026-03-28", "monto": -430000.0, "tipo": "cargo",  "descripcion": "Gastos varios",       "saldo": 50000.0},
            ],
            "periodoMeses": 3,
            "institucionesDetectadas": ["BancoEstado", "Mercado Pago"],
        }

    # Perfil Luis (jubilado, ingresos estables)
    return {
        "transacciones": [
            {"fecha": "2026-01-01", "monto": 850000.0,  "tipo": "abono", "descripcion": "Pensión enero",    "saldo": 850000.0},
            {"fecha": "2026-01-10", "monto": -350000.0, "tipo": "cargo", "descripcion": "Gastos hogar",      "saldo": 500000.0},
            {"fecha": "2026-01-20", "monto": -200000.0, "tipo": "cargo", "descripcion": "Crédito consumo",   "saldo": 300000.0},
            {"fecha": "2026-02-01", "monto": 850000.0,  "tipo": "abono", "descripcion": "Pensión febrero",   "saldo": 1150000.0},
            {"fecha": "2026-02-10", "monto": -350000.0, "tipo": "cargo", "descripcion": "Gastos hogar",      "saldo": 800000.0},
            {"fecha": "2026-02-20", "monto": -200000.0, "tipo": "cargo", "descripcion": "Crédito consumo",   "saldo": 600000.0},
            {"fecha": "2026-03-01", "monto": 850000.0,  "tipo": "abono", "descripcion": "Pensión marzo",     "saldo": 1450000.0},
            {"fecha": "2026-03-10", "monto": -350000.0, "tipo": "cargo", "descripcion": "Gastos hogar",      "saldo": 1100000.0},
            {"fecha": "2026-03-20", "monto": -200000.0, "tipo": "cargo", "descripcion": "Crédito consumo",   "saldo": 900000.0},
        ],
        "periodoMeses": 3,
        "institucionesDetectadas": ["BancoEstado"],
    }


# ─────────────────────────────────────────────────────────────────────────────
# TOOL: build_financial_profile
# ─────────────────────────────────────────────────────────────────────────────

def _relative_std(values: List[float]) -> float:
    if not values:
        return 0.0
    mean = sum(values) / len(values)
    if mean == 0:
        return 0.0
    variance = sum((v - mean) ** 2 for v in values) / len(values)
    return (variance ** 0.5) / mean


@mcp.tool()
def build_financial_profile(
    transacciones: List[Dict[str, Any]],
    periodoMeses: int,
    macro: Dict[str, float],
    fuenteDatos: str = "cartola_manual",
) -> Dict[str, Any]:
    """
    Construye FinancialProfile determinista desde transacciones + indicadores macro.
    Sin lógica de IA — cálculos puros.
    """
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

    def promedio(lst: List[float]) -> float:
        return sum(lst) / len(lst) if lst else 0.0

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

    tiene_avances = any("avance" in t.get("descripcion", "").lower() for t in transacciones)
    tiene_sobregiros = meses_neg > 0

    uso_cupo = 85.0 if (tiene_avances or tiene_sobregiros) else 40.0
    tasa_estimada = 46.0 if tiene_avances else 28.0

    return {
        "metadata": {
            "fechaAnalisis": datetime.now().strftime("%Y-%m-%d"),
            "fuenteDatos": fuenteDatos,
            "periodoAnalizadoMeses": periodoMeses,
            "institucionesDetectadas": [],
            "fuentesConsultadas": ["cartola", "mindicador"],
        },
        "ingresos": {
            "promedioMensual": round(ingresos_prom, 2),
            "regularidad": regularidad,
            "fuentes": 1,
            "tendencia": "estable",
        },
        "egresos": {
            "promedioMensual": round(egresos_prom, 2),
            "essentials": round(egresos_prom * 0.60, 2),
            "serviciosRecurrentes": round(egresos_prom * 0.20, 2),
            "creditoCuotas": round(egresos_prom * 0.15, 2),
            "avancesEfectivo": round(egresos_prom * 0.05, 2),
            "otros": 0.0,
        },
        "liquidez": {
            "saldoPromedioFinMes": round(saldo_prom, 2),
            "mesesConSaldoNegativo": meses_neg,
            "presion": presion,
        },
        "credito": {
            "usoCupoEstimadoPct": uso_cupo,
            "tieneAvancesEfectivo": tiene_avances,
            "tieneSobregiros": tiene_sobregiros,
            "pagosPuntuales": True,
            "tasaEfectivaEstimadoPct": tasa_estimada,
        },
        "tributario": {
            "ingresoTributarioEstimado": round(ingresos_prom * 12 * 0.6, 2),
            "ingresoBancarioEstimado": round(ingresos_prom * 12, 2),
            "brechaFormalidadPct": 40.0 if regularidad in ("irregular", "variable") else 20.0,
        },
        "benchmarks": {
            "ufValor": macro.get("ufValor", 0.0),
            "ipcUltimoMesPct": macro.get("ipcUltimoMesPct", 0.0),
            "tpmPct": macro.get("tpmPct", 0.0),
            "tmcPct": macro.get("tmcPct", 45.0),
        },
    }


# ─────────────────────────────────────────────────────────────────────────────
# TOOL: extract_signals
# ─────────────────────────────────────────────────────────────────────────────

@mcp.tool()
def extract_signals(financial_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Deriva señales canónicas desde un FinancialProfile."""
    signals: List[Dict[str, Any]] = []

    ingresos  = financial_profile.get("ingresos", {})
    liquidez  = financial_profile.get("liquidez", {})
    credito   = financial_profile.get("credito", {})
    tributario = financial_profile.get("tributario", {})

    uso_cupo = float(credito.get("usoCupoEstimadoPct", 0.0))
    if uso_cupo >= 80:
        signals.append({
            "id": "sig_uso_cupo_alto", "familia": "credito", "tipo": "riesgo",
            "titulo": "Uso de cupo muy alto",
            "descripcionCorta": "Casi siempre estás usando más del 80% de tu cupo de crédito.",
            "importancia": 3, "valorResumen": f"Uso de cupo ~{uso_cupo:.0f}%", "esLegal": False,
        })
    elif uso_cupo >= 50:
        signals.append({
            "id": "sig_uso_cupo_medio", "familia": "credito", "tipo": "ambigua",
            "titulo": "Uso de cupo intermedio",
            "descripcionCorta": "Tu uso de cupo es moderado, conviene mirarlo.",
            "importancia": 2, "valorResumen": f"Uso de cupo ~{uso_cupo:.0f}%", "esLegal": False,
        })

    presion = liquidez.get("presion", "media")
    saldo_prom = liquidez.get("saldoPromedioFinMes", 0)
    if presion in ("alta", "critica"):
        signals.append({
            "id": "sig_liquidez_justa", "familia": "liquidez", "tipo": "riesgo",
            "titulo": "Liquidez muy ajustada",
            "descripcionCorta": "Llegas a fin de mes con saldos muy bajos o en rojo.",
            "importancia": 3, "valorResumen": f"Saldo fin mes ~{saldo_prom:,.0f}", "esLegal": False,
        })
    elif presion == "baja" and liquidez.get("mesesConSaldoNegativo", 0) == 0:
        signals.append({
            "id": "sig_liquidez_sana", "familia": "liquidez", "tipo": "positiva",
            "titulo": "Liquidez saludable",
            "descripcionCorta": "Llegas a fin de mes con saldo positivo de forma consistente.",
            "importancia": 2, "valorResumen": "Sin meses en rojo", "esLegal": False,
        })

    regularidad = ingresos.get("regularidad", "estable")
    if regularidad in ("irregular", "variable"):
        signals.append({
            "id": "sig_ingresos_irregulares", "familia": "ingresos", "tipo": "ambigua",
            "titulo": "Ingresos irregulares",
            "descripcionCorta": "Tus ingresos varían bastante de un mes a otro.",
            "importancia": 2, "valorResumen": f"Regularidad: {regularidad}", "esLegal": False,
        })
    else:
        signals.append({
            "id": "sig_ingresos_estables", "familia": "ingresos", "tipo": "positiva",
            "titulo": "Ingresos estables",
            "descripcionCorta": "Recibes ingresos de forma regular y predecible.",
            "importancia": 2, "valorResumen": "Regularidad: estable", "esLegal": False,
        })

    if credito.get("tieneAvancesEfectivo"):
        signals.append({
            "id": "sig_avances_recurrentes", "familia": "credito", "tipo": "riesgo",
            "titulo": "Avances de efectivo recurrentes",
            "descripcionCorta": "Estás usando avances de efectivo, que tienen tasas muy altas.",
            "importancia": 2, "valorResumen": "Avances de efectivo: sí", "esLegal": False,
        })

    brecha = float(tributario.get("brechaFormalidadPct", 0.0))
    if brecha >= 30:
        signals.append({
            "id": "sig_brecha_formalidad", "familia": "formalidad", "tipo": "ambigua",
            "titulo": "Brecha entre cartola y declaración",
            "descripcionCorta": "Lo que entra a tu cuenta parece más que lo declarado formalmente.",
            "importancia": 2, "valorResumen": f"Brecha estimada ~{brecha:.0f}%", "esLegal": False,
        })

    tasa = float(credito.get("tasaEfectivaEstimadoPct", 0.0))
    tmc_pct = float(financial_profile.get("benchmarks", {}).get("tmcPct", 45.0))
    tmc_umbral = tmc_pct * 0.90
    if tasa >= tmc_umbral:
        tmc_ref = f" (TMC vigente ~{tmc_pct:.0f}%)" if tmc_pct else ""
        signals.append({
            "id": "sig_tasa_cercana_tmc", "familia": "legal", "tipo": "riesgo",
            "titulo": "Tasa cercana al máximo legal",
            "descripcionCorta": f"La tasa estimada de tu crédito está cerca del límite legal permitido{tmc_ref}.",
            "importancia": 2, "valorResumen": f"Tasa estimada ~{tasa:.1f}% anual", "esLegal": True,
        })

    if credito.get("pagosPuntuales"):
        signals.append({
            "id": "sig_pagos_puntuales", "familia": "pagos", "tipo": "positiva",
            "titulo": "Pagos siempre al día",
            "descripcionCorta": "No tienes registros de pagos atrasados.",
            "importancia": 1, "valorResumen": "Historial de pagos: puntual", "esLegal": False,
        })

    return {"signals": signals}


# ─────────────────────────────────────────────────────────────────────────────
# TOOL: generate_lenses
# ─────────────────────────────────────────────────────────────────────────────

@mcp.tool()
def generate_lenses(
    financial_profile: Dict[str, Any],
    signals: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Genera los 3 lentes institucionales: Banco, Fintech y Estado/SII."""
    ingresos = financial_profile.get("ingresos", {})
    credito  = financial_profile.get("credito", {})

    uso_cupo   = float(credito.get("usoCupoEstimadoPct", 0.0))
    regularidad = ingresos.get("regularidad", "irregular")

    ids = {s["id"] for s in signals}

    def impact(signal_id: str, *, negatives: set, positives: set, neutral_default: str = "neutral") -> str:
        if signal_id in negatives:
            return "negativo"
        if signal_id in positives:
            return "positivo"
        return neutral_default

    bank_negatives = {"sig_uso_cupo_alto", "sig_uso_cupo_medio", "sig_liquidez_justa", "sig_ingresos_irregulares", "sig_avances_recurrentes"}
    bank_positives = {"sig_pagos_puntuales", "sig_ingresos_estables", "sig_liquidez_sana"}

    fintech_negatives = {"sig_uso_cupo_alto"}
    fintech_positives = {"sig_pagos_puntuales"}

    estado_negatives = {"sig_brecha_formalidad", "sig_tasa_cercana_tmc"}

    bank = {
        "institutionType": "bank", "nombre": "Banco",
        "headline": f"Te vemos con ingresos {regularidad}s y uso de crédito del {uso_cupo:.0f}%.",
        "resumen": "Un banco tradicional se fija en qué tan predecibles son tus ingresos y cuánto dependes del crédito para llegar a fin de mes.",
        "señalesClaves": [
            {"signalId": s["id"], "impacto": impact(s["id"], negatives=bank_negatives, positives=bank_positives), "comentario": ""}
            for s in signals
            if s["id"] in (bank_negatives | bank_positives)
        ],
    }

    fintech = {
        "institutionType": "fintech", "nombre": "Fintech",
        "headline": "Vemos actividad constante; tu uso de crédito puede limitar nuevas ofertas.",
        "resumen": "Una fintech tolera mejor ingresos variables si ve movimiento frecuente y cumplimiento de pagos.",
        "señalesClaves": [
            {"signalId": s["id"], "impacto": impact(s["id"], negatives=fintech_negatives, positives=fintech_positives, neutral_default="neutral"), "comentario": ""}
            for s in signals
            if s["id"] in (fintech_negatives | fintech_positives | {"sig_ingresos_irregulares"})
        ],
    }

    estado = {
        "institutionType": "estado", "nombre": "Estado / SII",
        "headline": "Nos importa que tu realidad bancaria coincida con lo que declaras.",
        "resumen": "Desde la mirada del Estado, el foco está en la formalidad y en que la brecha entre cartola y declaración no sea excesiva.",
        "señalesClaves": [
            {"signalId": s["id"], "impacto": impact(s["id"], negatives=estado_negatives, positives=set()), "comentario": ""}
            for s in signals
            if s["id"] in estado_negatives
        ],
    }

    return {"lenses": [bank, fintech, estado]}


# ─────────────────────────────────────────────────────────────────────────────
# TOOL: simulate_change
# ─────────────────────────────────────────────────────────────────────────────

@mcp.tool()
def simulate_change(
    financial_profile: Dict[str, Any],
    action: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Aplica una acción what-if y devuelve el perfil modificado + señales que cambian.
    action: { tipo: 'reducir_uso_cupo' | 'reducir_avances' | 'aumentar_saldo_fin_mes' | 'formalizar_ingresos', cantidadPct: float }
    """
    tipo = action.get("tipo", "")
    cantidad_pct = float(action.get("cantidadPct", 0.0))

    import copy
    new_profile = copy.deepcopy(financial_profile)
    credito  = new_profile.setdefault("credito", {})
    liquidez = new_profile.setdefault("liquidez", {})
    changed: List[Dict[str, Any]] = []

    if tipo == "reducir_uso_cupo" and cantidad_pct > 0:
        actual = float(credito.get("usoCupoEstimadoPct", 0.0))
        nuevo = max(0.0, actual - cantidad_pct)
        credito["usoCupoEstimadoPct"] = nuevo

        if actual >= 80:
            changed.append({
                "id": "sig_uso_cupo_alto",
                "from": "riesgo",
                "to": "ambigua" if nuevo >= 50 else "positiva",
            })

        # Liquidez mejora marginalmente al reducir dependencia del crédito
        saldo_actual = float(liquidez.get("saldoPromedioFinMes", 0.0))
        liquidez["saldoPromedioFinMes"] = saldo_actual + 50000
        if liquidez.get("presion") in ("alta", "critica"):
            liquidez["presion"] = "media"
            changed.append({"id": "sig_liquidez_justa", "from": "riesgo", "to": "ambigua"})

    elif tipo == "reducir_avances":
        credito["tieneAvancesEfectivo"] = False
        credito["tasaEfectivaEstimadoPct"] = 28.0
        changed.append({"id": "sig_avances_recurrentes", "from": "riesgo", "to": "positiva"})

    elif tipo == "formalizar_ingresos":
        tributario = new_profile.setdefault("tributario", {})
        brecha_actual = float(tributario.get("brechaFormalidadPct", 0.0))
        nuevo_brecha = max(0.0, brecha_actual - cantidad_pct)
        tributario["brechaFormalidadPct"] = nuevo_brecha
        if nuevo_brecha < 30:
            changed.append({"id": "sig_brecha_formalidad", "from": "ambigua", "to": "positiva"})

    return {"newProfile": new_profile, "changedSignals": changed}


# ─────────────────────────────────────────────────────────────────────────────
# RESOURCES + PROMPT
# ─────────────────────────────────────────────────────────────────────────────

@mcp.resource("macro-indicator://{tipo}")
def macro_indicator_resource(tipo: str) -> str:
    descriptions = {
        "uf":     "UF (Unidad de Fomento): valor diario indexado a la inflación, usado en créditos hipotecarios, arriendos y contratos. Fuente: mindicador.cl.",
        "ipc":    "IPC (Índice de Precios al Consumidor): mide la variación mensual de los precios de la canasta básica. Publicado por el INE. Fuente: mindicador.cl.",
        "tpm":    "TPM (Tasa de Política Monetaria): tasa de referencia fijada por el Banco Central de Chile en cada reunión de política monetaria. Fuente: mindicador.cl.",
        "tmc":    "TMC (Tasa Máxima Convencional): límite legal máximo de interés que puede cobrar cualquier institución en Chile, fijada trimestralmente por la CMF. Si tu tasa la supera, tienes derecho a reclamar. Fuente: mindicador.cl.",
        "usd":    "Dólar observado (USD/CLP): tipo de cambio oficial peso-dólar publicado diariamente por el Banco Central de Chile. Fuente: BDE API (serie F073.TCO.PRE.Z.D).",
        "imacec": "IMACEC (Indicador Mensual de Actividad Económica): mide la evolución mensual de la actividad económica en Chile, equivalente a un PIB mensual. Fuente: BDE API (serie F032.IMC.IND.Z.Z.EP18.Z.Z.0.M).",
    }
    return descriptions.get(tipo, f"Indicador desconocido: {tipo}")


@mcp.prompt()
def explain_indicator(indicator: str) -> str:
    return (
        f"Explica en lenguaje ciudadano qué significa '{indicator}', "
        "en máximo 3 frases, con un ejemplo cercano a la vida cotidiana de una persona en Chile. "
        "No uses tecnicismos. No menciones siglas sin explicarlas primero."
    )


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    mcp.run(transport="stdio")
