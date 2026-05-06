import { NextResponse } from 'next/server'

const MINDICADOR = 'https://mindicador.cl/api'
const BDE = 'https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx'

function bdeUrl(series: string, firstdate: string, lastdate: string): string {
  const user = encodeURIComponent(process.env.BDE_USER ?? '')
  const pass = encodeURIComponent(process.env.BDE_PASS ?? '')
  return `${BDE}?user=${user}&pass=${pass}&function=GetSeries&timeseries=${series}&firstdate=${firstdate}&lastdate=${lastdate}`
}

function lastBdeObs(data: unknown): { value: number | null; fecha: string | null } {
  try {
    const obs = (data as { Series?: { Obs?: Array<{ indexDateString: string; value: string }> } })
      ?.Series?.Obs
    if (!Array.isArray(obs) || obs.length === 0) return { value: null, fecha: null }
    const last = obs[obs.length - 1]
    const v = Number(last?.value)
    // indexDateString comes as "DD-MM-YYYY"
    const parts = last?.indexDateString?.split('-') ?? []
    const fecha = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : null
    return { value: isNaN(v) ? null : v, fecha }
  } catch {
    return { value: null, fecha: null }
  }
}

export async function GET() {
  const today = new Date().toISOString().slice(0, 10)
  const d30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const d90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const hasBde = !!(process.env.BDE_USER && process.env.BDE_PASS)

  const fetches: Promise<PromiseSettledResult<unknown>>[] = [
    Promise.allSettled([fetch(`${MINDICADOR}/uf`).then(r => r.json())]).then(r => r[0]),
    Promise.allSettled([fetch(`${MINDICADOR}/ipc`).then(r => r.json())]).then(r => r[0]),
    Promise.allSettled([fetch(`${MINDICADOR}/tpm`).then(r => r.json())]).then(r => r[0]),
    Promise.allSettled([fetch(`${MINDICADOR}/tmc`).then(r => r.json())]).then(r => r[0]),
    hasBde
      ? Promise.allSettled([fetch(bdeUrl('F073.TCO.PRE.Z.D', d30, today)).then(r => r.json())]).then(r => r[0])
      : Promise.resolve({ status: 'rejected', reason: 'no credentials' } as PromiseSettledResult<unknown>),
    hasBde
      ? Promise.allSettled([fetch(bdeUrl('F032.IMC.IND.Z.Z.EP18.Z.Z.0.M', d90, today)).then(r => r.json())]).then(r => r[0])
      : Promise.resolve({ status: 'rejected', reason: 'no credentials' } as PromiseSettledResult<unknown>),
  ]

  const [uf, ipc, tpm, tmc, usd, imacec] = await Promise.all(fetches)

  const minVal = (r: PromiseSettledResult<unknown>) =>
    r.status === 'fulfilled'
      ? (Number((r.value as { serie?: Array<{ valor: number }> })?.serie?.[0]?.valor) || null)
      : null

  const usdObs  = usd.status   === 'fulfilled' ? lastBdeObs(usd.value)   : { value: null, fecha: null }
  const imacecObs = imacec.status === 'fulfilled' ? lastBdeObs(imacec.value) : { value: null, fecha: null }

  return NextResponse.json({
    ufValor:        minVal(uf),
    ipcPct:         minVal(ipc),
    tpmPct:         minVal(tpm),
    tmcPct:         minVal(tmc),
    usdClp:         usdObs.value,
    usdFecha:       usdObs.fecha,
    imacec:         imacecObs.value,
    imacecFecha:    imacecObs.fecha,
    fuenteBde:      hasBde,
    fechaConsulta:  today,
  })
}
