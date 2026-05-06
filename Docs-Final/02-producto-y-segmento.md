# 02 — Producto y segmento

> Documento ejecutivo. Define para quién construimos, qué problema le
> resolvemos, qué valor le entregamos y por qué canal llega.

---

## 1. Segmento ciudadano específico

> **Emprendedoras de primera generación en regiones de Chile**, que venden a
> través de cuentas fintech o bancarias simples y tienen obligaciones tributarias
> digitales básicas.

Características del perfil:
- Mujeres 25–45 años, generalmente jefas de hogar.
- Ingresos variables (ventas online, ferias, redes sociales, boletas
  ocasionales).
- Mezclan cuentas personales y de negocio.
- Uso intensivo de tarjeta de crédito, avances en efectivo y pagos en cuotas.
- Desconocen cómo esas decisiones afectan:
  - su evaluación crediticia,
  - el riesgo que percibe el banco,
  - su formalidad tributaria.

**Segmento secundario en roadmap:** jubilados con tarjeta prepago y pequeños
créditos de consumo. Para el MVP no se construye, pero la arquitectura lo
soporta.

## 2. Persona principal — Paula

| Dato | Valor |
|---|---|
| Nombre | Paula |
| Edad | 34 |
| Ubicación | Temuco |
| Trabajo | Vende ropa por Instagram + ferias mensuales |
| Ingresos | Variables, ~$750.000 CLP/mes promedio (puede oscilar entre $400k y $1.2M) |
| Cuenta bancaria | BancoEstado Cuenta RUT + Mercado Pago |
| Tarjeta crédito | Cupo $500.000, uso casi siempre 80–90% |
| Sentimientos | "Siento que el banco no me ve"; "no sé si lo que hago me hunde o me ayuda" |

Paula es el "lente humano" sobre el que se diseña toda la UX y la copy.

## 3. Persona backup — Luis

Para contraste o si Paula falla en demo:

| Dato | Valor |
|---|---|
| Nombre | Luis |
| Edad | 45 |
| Trabajo | Trabajador formal asalariado |
| Ingresos | $1.500.000 estables |
| Tarjetas | 3 tarjetas + 1 crédito de consumo |
| Pago | Siempre al día, pero con DTI alto |
| Ángulo | Carga financiera alta aun siendo formal — distinto a Paula |

## 4. Problema concreto que se resuelve

Paula no entiende:
1. Qué señal envía su cartola al banco.
2. Si lo que hace (avances, uso alto de cupo, ingresos en cuentas personales)
   le perjudica o no.
3. Qué pequeño cambio podría modificar su reflejo institucional.
4. Qué derechos tiene si sospecha que le cobran algo abusivo.

Hoy, esa información existe pero está fragmentada: la cartola en el banco,
la normativa en la CMF, los derechos en SERNAC, la realidad tributaria en
el SII.

## 5. Propuesta de valor (formato Impact Lab)

> **Para emprendedoras de primera generación en regiones de Chile que
> mezclan ventas digitales con cuentas bancarias simples, Espejo de Datos
> traduce su cartola en un "espejo financiero ciudadano" que les muestra
> cómo las ven banco, fintech y Estado, con señales claras y un simulador de
> cambios — llegando vía un programa B2G de educación financiera con CMF
> Educa y SERNAC.**

## 6. Canal de adopción (rúbrica del Lab)

| Canal | Detalle | Estado MVP |
|---|---|---|
| **B2G primario** | Programa de educación financiera CMF Educa, SERNAC, municipios con fomento productivo | Identificado, pendiente contacto formal post-Lab |
| B2NGO secundario | ONGs de inclusión financiera (ASECH, Fundación ChileMujeres, FINCA) | Identificado como Fase 2 |
| B2C directo | App pública para usuarios individuales | Existe pero no es el foco de impacto |

**Bonus de viabilidad post-Lab:**
- Anthropic Sandbox (60 días si ganamos): trabajar con CMF en piloto.
- Plan 30/60/90 días en `12-entregables-rubrica.md`.

## 7. Diferenciadores

Frente a iniciativas existentes:

- **vs. Destacame** (score crediticio alternativo): nosotros no damos un
  score; damos un **espejo explicable** con tres lentes.
- **vs. Fintual / Fintonic / apps de educación financiera**: nosotros
  no enseñamos abstracciones — usamos **la cartola real** del usuario.
- **vs. CMF Educa**: nosotros no leemos circulares; **traducimos**
  la cartola a esas circulares cuando aplica.
- **vs. comparadores Open Finance**: nosotros funcionamos **hoy**, sin SFA, y
  la arquitectura está lista para enchufarse cuando llegue.

## 8. Lo que NO hacemos (para evitar promesas riesgosas)

- ❌ No predecimos si el banco aprobará un crédito.
- ❌ No damos asesoría legal ni financiera personalizada.
- ❌ No vendemos los datos del usuario.
- ❌ No persistimos cartolas.
- ❌ No emitimos juicios morales ("estás mal", "deberías ahorrar").

## 9. Marco emocional / tono

- **Lenguaje ciudadano**: "uso de cupo" en vez de "utilización de línea
  rotativa".
- **No paternalismo**: "si cambias X, probablemente Y se vería así desde la
  mirada Z" — nunca "debes hacer X".
- **Respeto y transparencia**: cada número viene con su fuente; cada estimación
  se etiqueta como tal.
- **Acción, no solo info**: el simulador y la carta son "salidas" concretas,
  no solo dashboards.

## 10. Validación / KPIs (para post-Lab)

Si el proyecto llega al sandbox, los KPIs naturales son:
- % de usuarios que entienden cada lente (test con 5–10 personas reales).
- % que generan al menos 1 simulación.
- % que descargan el pasaporte.
- Tiempo desde subida de cartola hasta primer "ajá".
- Reducción reportada de reclamos en SERNAC en piloto B2G.

Para el Lab, estos no se miden — se mencionan en el pitch como roadmap.
