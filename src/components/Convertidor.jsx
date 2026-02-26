// components/Convertidor.jsx
// Componente del formulario principal de conversion
// Recibe divisas del hook y llama al callback con los resultados

import React, { useState } from "react";
import { formatearValor } from "../utils/formatters";
import styles from "./Convertidor.module.css";

function Convertidor({ divisas, getTasa }) {
  const [valor, setValor] = useState("");
  const [monedaOrigen, setMonedaOrigen] = useState("COP");
  const [resultados, setResultados] = useState([]);
  const [convirtiendo, setConvirtiendo] = useState(false);
  const [yaConvirio, setYaConvirio] = useState(false);

  const handleConvertir = () => {
    const num = parseFloat(valor);
    if (isNaN(num) || num <= 0) {
      alert("Ingresá un valor válido mayor a 0");
      return;
    }

    setConvirtiendo(true);

    // Simulo un pequeño delay para que se vea que "hace algo"
    // En produccion real esto seria async si la conversion fuera remota
    setTimeout(() => {
      const nuevosResultados = [];

      divisas.forEach((divisa) => {
        // No incluir la moneda de origen en los resultados
        if (divisa.moneda === monedaOrigen) return;

        const tasa = getTasa(monedaOrigen, divisa.moneda);
        if (tasa === null) return;

        const valorConvertido = num * tasa;

        // Uso push igual que en el original para agregar al array
        nuevosResultados.push({
          moneda: divisa.moneda,
          nombre: divisa.nombre || divisa.moneda,
          valor: valorConvertido,
          tasa: tasa,
          // guardo la tasa inversa para mostrar referencia
          tasaLabel: `1 ${monedaOrigen} = ${formatearValor(tasa)} ${divisa.moneda}`,
        });
      });

      setResultados(nuevosResultados);
      setConvirtiendo(false);
      setYaConvirio(true);
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConvertir();
  };

  const handleLimpiar = () => {
    setValor("");
    setResultados([]);
    setYaConvirio(false);
  };

  return (
    <section className={styles.section}>
      {/* Formulario */}
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="valor">
            INGRESE EL MONTO
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="valor"
              type="number"
              className={styles.input}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0.00"
              min="0"
              step="any"
            />
            <select
              className={styles.select}
              value={monedaOrigen}
              onChange={(e) => {
                setMonedaOrigen(e.target.value);
                // Si ya habia convertido, limpio para que vuelva a convertir
                if (yaConvirio) {
                  setResultados([]);
                  setYaConvirio(false);
                }
              }}
            >
              {divisas.map((d) => (
                <option key={d.moneda} value={d.moneda}>
                  {d.moneda}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.botones}>
          <button
            className={styles.btnConvertir}
            onClick={handleConvertir}
            disabled={convirtiendo || !valor}
          >
            <span>{convirtiendo ? "CALCULANDO..." : "CONVERTIR"}</span>
            <span className={styles.arrow}>→</span>
          </button>
          {yaConvirio && (
            <button className={styles.btnLimpiar} onClick={handleLimpiar}>
              LIMPIAR
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {resultados.length > 0 && (
        <div className={styles.resultados}>
          <div className={styles.resultadosHeader}>
            <h2 className={styles.subtitulo}>Resultados</h2>
            <span className={styles.countLabel}>
              {resultados.length} monedas
            </span>
          </div>

          <div className={styles.cards}>
            {resultados.map((r, idx) => (
              <div
                key={r.moneda}
                className={styles.card}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div className={styles.cardPais}>{r.nombre}</div>
                <div className={styles.cardMoneda}>{r.moneda}</div>
                <div className={styles.cardValor}>{formatearValor(r.valor)}</div>
                <div className={styles.cardTasa}>{r.tasaLabel}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {yaConvirio && resultados.length === 0 && (
        <p className={styles.noResultados}>No hay resultados para mostrar.</p>
      )}
    </section>
  );
}

export default Convertidor;