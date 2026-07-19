// Normalización de nombres de cliente para cruzar la CxC (que viene por nombre,
// no por RIF) contra las cotizaciones. Misma lógica que usa el sync al guardar,
// para que ambos lados coincidan.
//
// Lección heredada del sistema previo del cliente: el cruce por nombre es
// frágil; ante duda es mejor NO mostrar saldo que mostrar el del cliente
// equivocado. Por eso normalizamos agresivo y exigimos coincidencia exacta
// del nombre normalizado (no "contiene").
export function normalizarNombre(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita acentos
    .replace(/[.,&]/g, ' ')
    .replace(/\b(c\s?a|ca|s\s?a|sa|rl|srl|compania|compañia|inversiones|comercial|distribuidora)\b/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
