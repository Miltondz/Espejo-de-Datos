export interface LeyReferencia {
  id: string
  nombre: string
  extracto: string
}

export const LEYES_CHILE: Record<string, LeyReferencia> = {
  tasa_cercana_tmc: {
    id: 'ley_18010',
    nombre: 'Ley 18.010 — Operaciones de Crédito de Dinero (TMC)',
    extracto: `
Ley 18.010, artículo 6°: "Se tendrá por no escrito todo pacto de intereses que exceda el máximo convencional, y en tal caso los intereses se reducirán al interés corriente que rija al momento de la convención o al momento en que se devenguen los respectivos intereses, en el caso de ser estipulados en una cláusula separada."

Artículo 8°: "El interés máximo convencional es el que las partes pueden estipular en sus contratos. Ninguna convención sobre intereses puede establecer una tasa que exceda en más de un 50% al interés corriente que rija al momento de la convención."

La Tasa Máxima Convencional (TMC) es fijada mensualmente por la Comisión para el Mercado Financiero (CMF). Todo cobro de intereses por encima de la TMC vigente es nulo de pleno derecho y debe ser restituido al deudor.

Artículo 16°: "El deudor que pague intereses superiores a los legalmente autorizados, tendrá derecho a imputar el exceso al capital."
    `.trim(),
  },

  cobro_no_autorizado: {
    id: 'ley_19496',
    nombre: 'Ley 19.496 — Protección de los Derechos de los Consumidores',
    extracto: `
Ley 19.496, artículo 3°: "Son derechos y deberes básicos del consumidor: a) La libre elección del bien o servicio. b) El derecho a una información veraz y oportuna sobre los bienes y servicios ofrecidos, su precio, condiciones de contratación y otras características relevantes de los mismos."

Artículo 12°: "Todo proveedor de bienes o servicios estará obligado a respetar los términos, condiciones y modalidades conforme a las cuales se hubiere ofrecido o convenido con el consumidor la entrega del bien o la prestación del servicio."

Artículo 55°: "Las acciones que deriven de esta ley prescribirán en el plazo de dos años contados desde que se haya incurrido en la infracción respectiva."

Ley 20.555 (SERNAC Financiero), artículo 17 B: "Los proveedores de servicios financieros deberán informar en forma clara, oportuna y destacada la Carga Anual Equivalente (CAE) y el Costo Total del Crédito."
    `.trim(),
  },

  portabilidad_credito: {
    id: 'ley_21236',
    nombre: 'Ley 21.236 — Portabilidad Financiera',
    extracto: `
Ley 21.236, artículo 3°: "Todo cliente podrá ejercer el derecho a portabilidad financiera respecto de los productos y servicios financieros que mantenga con un proveedor de servicios financieros."

Artículo 6°: "El nuevo proveedor deberá comunicar al cliente, dentro del plazo de tres días hábiles contados desde que éste manifeste su interés en la portabilidad, las condiciones del o los productos que ofrece como alternativa."

Artículo 9°: "El proveedor de servicios financieros no podrá cobrar al cliente comisión, costo ni cargo alguno por el ejercicio del derecho de portabilidad, salvo los gastos notariales que correspondan."

Artículo 12°: "El proveedor original deberá proporcionar al nuevo proveedor y al cliente, dentro de los plazos establecidos en esta ley, toda la información necesaria para materializar la portabilidad."
    `.trim(),
  },

  datos_personales: {
    id: 'ley_21719',
    nombre: 'Ley 21.719 — Protección de Datos Personales',
    extracto: `
Ley 21.719, artículo 4°: "Toda persona tiene derecho a la protección de sus datos personales. En virtud de este derecho, los titulares de datos personales tendrán, respecto de sus datos, los derechos de acceso, rectificación, supresión, oposición, portabilidad y a no ser objeto de decisiones automatizadas."

Artículo 13°: "El responsable de datos deberá obtener el consentimiento del titular para el tratamiento de sus datos personales, salvo en los casos en que la ley autorice su tratamiento sin dicho consentimiento."

Artículo 45° (derecho de acceso): "El titular tiene derecho a obtener del responsable de datos, en cualquier momento, información sobre sus datos personales que estén siendo objeto de tratamiento, así como el origen de los mismos."

Artículo 48° (derecho de supresión): "El titular tiene derecho a solicitar la supresión de sus datos personales cuando éstos no sean necesarios para la finalidad para la que fueron recabados."
    `.trim(),
  },
}

export function getLeyParaProblema(tipoProblema: string): LeyReferencia | null {
  return LEYES_CHILE[tipoProblema] ?? null
}
