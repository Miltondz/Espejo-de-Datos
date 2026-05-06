# 08 — Privacidad por diseño y manejo de datos

> Pesa 20% en la rúbrica del Lab ("Datos responsables"). Y es coherente con
> la nueva Ley 21.719 de Protección de Datos (vigencia plena diciembre 2026).
> Estas reglas son **innegociables** en el MVP.

---

## 1. Marco legal aplicable (Chile, mayo 2026)

| Norma | Estado en mayo 2026 | Relevancia |
|---|---|---|
| **Ley 19.628** | Vigente | Marco actual de protección de datos personales |
| **Ley 21.521** (Fintech) | Vigente desde feb-2023 | Define SFA y derechos del consumidor financiero |
| **Ley 21.719** (Nueva LPDP) | **Promulgada**, vigencia plena **1 dic 2026** | Próxima — diseñar para cumplirla |
| **NCG 514 CMF** (Open Finance) | Publicada jul-2024 | Define el SFA. Implementación efectiva 2027–2028 |
| **Ley 19.496 + 20.555 + 21.398** | Vigentes | Derechos del consumidor financiero (SERNAC) |

Diseño coherente con principios de la Ley 21.719:
- **Minimización**: solo los datos estrictamente necesarios.
- **Finalidad**: cada dato se usa solo para generar el espejo.
- **Calidad**: no perpetuar datos antiguos.
- **Seguridad**: cifrado en tránsito; sin reposo (no se guarda).

## 2. Principio central — "La cartola no se guarda"

**Regla fija e innegociable:**

> La cartola del usuario se procesa en memoria del servidor y se descarta
> inmediatamente. Nunca se escribe en disco, base de datos, storage, ni se
> envía a ningún servicio externo distinto de la API de Claude para análisis.

Esta regla:
- es la diferencia narrativa frente a bancos y brokers de datos,
- protege al equipo legalmente,
- es la promesa central que se hace al usuario en la UI.

## 3. Qué se guarda y qué no

| Dato | ¿Se guarda? | Justificación |
|---|---|---|
| Cartola PDF/Excel original | ❌ Nunca | Dato bruto sensible. Cumple su función en memoria |
| Transacciones individuales | ❌ Nunca | Más detalle del necesario; el análisis requiere patrones, no movimientos |
| Perfil normalizado (`FinancialProfile`) | ⚠️ **No en MVP**; opt-in opcional post-MVP | Es output, no datos crudos |
| Señales (`EspejoSignal[]`) | ⚠️ Igual | Producto de la app, no datos crudos del usuario |
| Resultados de APIs macro (UF, IPC, TPM) | ✅ Caché breve | No son datos del usuario |
| Logs de procesamiento | ❌ Sin contenido del usuario | Solo métricas técnicas agregadas (latencia, errores) |
| API keys (Anthropic) | ✅ Solo en env vars del servidor | Nunca en frontend, nunca en repo |

## 4. Flujo correcto de datos en `POST /api/analyze`

```
1. Browser sube cartola (PDF/Excel) o demoId.
2. Servidor recibe el archivo en memoria (Buffer/Stream temporal).
3. MirrorBuilderAgent llama parse_cartola(filePath) en MCP.
   → MCP lee el archivo, extrae transacciones en memoria.
4. Agente llama otras tools para construir EspejoResponse.
5. Servidor devuelve EspejoResponse al browser.
6. Servidor descarta el buffer del archivo (garbage collection).
7. ❌ Ningún dato del usuario queda en disco, DB ni logs.
```

## 5. Reglas técnicas duras (lo que el código debe respetar)

### 5.1. Logs

- ❌ No loggear contenido de cartolas.
- ❌ No loggear transacciones individuales.
- ❌ No loggear `FinancialProfile` completo.
- ✅ Sí loggear: latencia, status codes, conteo de tools llamadas, errores
  agregados (sin payload del usuario).
- ✅ Sí loggear el `task` y `segmento` (datos no identificables).

### 5.2. Errores HTTP

- ❌ No devolver el contenido del archivo en el cuerpo del error.
- ❌ No devolver el `FinancialProfile` en errores.
- ✅ Mensajes de error genéricos al cliente: "No pudimos procesar la cartola.
  Intenta con otro formato o usa la demo."
- ✅ Detalles técnicos solo en logs del servidor (sin datos del usuario).

### 5.3. localStorage (frontend)

- Si se usa para guardar el resultado actual, **debe ser explícito en UI** y
  ofrecer un botón **"Borrar mis datos"** que limpia `localStorage`.
- En el MVP, lo más seguro es **no usarlo**: el resultado vive solo en estado
  React mientras la pestaña está abierta.

### 5.4. Variables de entorno

- `ANTHROPIC_API_KEY` solo en `.env.local` (gitignored) y en Vercel env vars.
- Nunca en código. Nunca en frontend (`NEXT_PUBLIC_*` solo para datos no
  sensibles).
- Si la app necesita `MCP_SERVER_URL`, también en env vars.

### 5.5. CORS y exposición

- Las API routes están en el mismo dominio que el frontend (Next.js): no se
  necesita CORS en el MVP.
- No se expone ningún endpoint público distinto de `/api/analyze`,
  `/api/simulate`, `/api/generar-carta`.

## 6. Lo que se le promete al usuario (UI)

Aviso visible **antes** de subir cualquier archivo:

> 🔒 **Tu cartola se procesa en memoria y se descarta inmediatamente.**
> No la guardamos, no la vendemos, no la enviamos a ningún tercero distinto
> de la API de Claude para analizarla. Lo que se queda contigo es tu Espejo —
> no tus datos.

Disclaimer al pie en todas las páginas:

> Espejo de Datos es una herramienta educativa. No es asesoría financiera ni
> legal, ni certifica decisiones de bancos, fintech o el Estado.

## 7. Lo que NO se prometerá

- ❌ "Tus datos están seguros" en abstracto. → Decir **qué** hacemos exactamente.
- ❌ "Cumplimos con [norma]". → Decir **qué reglas seguimos** (minimización,
  procesamiento en memoria, etc.).
- ❌ "Nunca tendrás un problema de datos con nosotros". → Imposible prometerlo.

## 8. Si llegara a haber persistencia (post-MVP)

Solo se guardaría el `FinancialProfile` agregado, **opt-in explícito** del
usuario, y:
- cifrado en reposo,
- separado de cualquier identificador (ej. RUT) si lo hay,
- con derecho a borrado (la UI debe tener un botón "Borrar mi historial"),
- sin transacciones individuales nunca.

Esto está fuera del alcance del MVP del Lab.

## 9. Discurso de "Datos responsables" para el pitch

Frase corta para los 3 minutos del pitch:

> "La cartola es el dato más sensible del usuario. Por eso la procesamos en
> memoria y la descartamos. No la guardamos, no la vendemos. Lo que se queda
> es solo el espejo — no los datos. Eso no es solo cumplir la ley, es practicar
> hoy lo que el SFA exigirá mañana."

## 10. Q&A esperable de jueces / reguladores

**P: ¿Qué pasa si un juez les pide la cartola de un usuario?**
R: No la tenemos. Diseñamos el sistema para no almacenarla.

**P: ¿Qué pasa si Claude (Anthropic) la guarda?**
R: Anthropic procesa pero no entrena con datos enviados por API por default.
Igualmente, en producción evaluamos si pasarla a Claude o solo extraer datos
locales antes de llamar al modelo.

**P: ¿Por qué no usan Supabase u otra DB?**
R: Porque no la necesitamos en el MVP. Si en el futuro persistiéramos algo,
sería el perfil agregado opt-in, cifrado, con derecho a borrado.

**P: ¿Esto es scoring crediticio? ¿Necesitan registro CMF?**
R: No es scoring. No otorgamos crédito ni evaluamos solvencia. Es una
herramienta educativa de explicabilidad. No requerimos registro en el RPSF.
