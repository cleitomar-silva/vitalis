export function inverterDataHora(str) {
  // remove vírgula e espaços extras
  str = str.replaceAll(',', '').trim();

  const [data, hora] = str.split(' ')        // ["06/09/2025", "22:20:29"]
  const [dia, mes, ano] = data.split('/')    // ["06", "09", "2025"]

  return `${ano}-${mes}-${dia} ${hora}`      // "2025-09-06 22:20:29"
}

export function formatDateToYMD(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // pega só YYYY-MM-DD
}

export function normalizarDecimal(valor) {
  if (typeof valor === "number") {
    return valor.toFixed(2);
  }

  if (typeof valor === "string") {
    let normalizado = valor;

    if (valor.includes(",")) {
      // formato brasileiro: "1.150,00"
      normalizado = valor.replace(/\./g, "").replace(/,/g, ".");
    }

    if (isNaN(normalizado)) {
      throw new Error(`Valor inválido: ${valor}`);
    }

    return parseFloat(normalizado).toFixed(2);
  }

  throw new Error("Tipo de valor não suportado");
}
