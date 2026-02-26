// utils/formatters.js
// Funciones de utilidad para formatear numeros y divisas
// Las separo aca para reutilizar en varios componentes

// Formatea un numero segun su magnitud
// Si es muy chico muestra mas decimales
export function formatearValor(numero) {
  if (numero === null || numero === undefined || isNaN(numero)) return "—";

  if (numero >= 10000) {
    return numero.toLocaleString("es-CO", { maximumFractionDigits: 0 });
  }
  if (numero >= 100) {
    return numero.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (numero >= 1) {
    return numero.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  if (numero >= 0.001) {
    return numero.toFixed(6);
  }
  return numero.toExponential(4);
}

// Para el ticker del header, version mas compacta
export function formatearTasa(numero) {
  if (!numero) return "—";
  return Number(numero).toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Devuelve la fecha en formato legible en español
export function formatearFecha(date) {
  if (!date) return "";
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Construye el texto del ticker con todas las divisas
export function construirTicker(divisas) {
  // .filter para sacar COP que es la base, .map para construir los textos,
  // y join para unirlos con separador
  return divisas
    .filter((d) => d.moneda !== "COP")
    .map((d) => {
      const tasa = d.venta || d.ultimoCierre;
      return `${d.moneda} · COP ${formatearTasa(tasa)}`;
    })
    .join("     ·     ");
}