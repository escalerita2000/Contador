// components/TablaCruzada.jsx
// Tabla que muestra el valor de 1 unidad de cada moneda en las demas
// Es la parte mas compleja visualmente del proyecto

import React, { useMemo, useState } from "react";
import { formatearValor } from "../utils/formatters";
import styles from "./TablaCruzada.module.css";

function TablaCruzada({ divisas, getTasa }) {
  // La celda activa para resaltar fila/columna
  const [celdaActiva, setCeldaActiva] = useState({ fila: null, col: null });

  // Calculo la tabla entera con useMemo para no recalcular en cada render
  // Solo recalcula cuando cambia divisas
  const matrizDatos = useMemo(() => {
    if (divisas.length === 0) return [];

    const matriz = [];

    divisas.forEach((origen) => {
      const fila = [];
      divisas.forEach((destino) => {
        if (origen.moneda === destino.moneda) {
          fila.push({ tipo: "diagonal", valor: null });
        } else {
          const tasa = getTasa(origen.moneda, destino.moneda);
          fila.push({ tipo: "valor", valor: tasa });
        }
      });
      matriz.push(fila);
    });

    return matriz;
  }, [divisas, getTasa]);

  if (divisas.length === 0) return null;

  const handleMouseEnter = (filaIdx, colIdx) => {
    setCeldaActiva({ fila: filaIdx, col: colIdx });
  };

  const handleMouseLeave = () => {
    setCeldaActiva({ fila: null, col: null });
  };

  // Para colorear la celda segun el valor relativo
  const getClaseCelda = (valor, filaIdx, colIdx) => {
    const classes = [styles.td];
    if (filaIdx === celdaActiva.fila || colIdx === celdaActiva.col) {
      classes.push(styles.highlighted);
    }
    if (filaIdx === celdaActiva.fila && colIdx === celdaActiva.col) {
      classes.push(styles.active);
    }
    if (valor === null) return classes.join(" ");

    if (valor >= 1000) classes.push(styles.valorGrande);
    else if (valor >= 1) classes.push(styles.valorMedio);
    else if (valor < 0.001) classes.push(styles.valorChico);

    return classes.join(" ");
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.titulo}>Tabla Cruzada</h2>
        <p className={styles.sub}>
          Valor de 1 unidad de cada moneda ↓ en las demás →
        </p>
      </div>

      <div className={styles.wrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th className={`${styles.th} ${styles.thCorner}`}>
                ↓ / →
              </th>
              {divisas.map((d, colIdx) => (
                <th
                  key={d.moneda}
                  className={`${styles.th} ${
                    colIdx === celdaActiva.col ? styles.thHighlighted : ""
                  }`}
                  title={d.nombre || d.moneda}
                >
                  {d.moneda}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {divisas.map((origen, filaIdx) => (
              <tr key={origen.moneda} className={styles.tr}>
                <td
                  className={`${styles.tdNombre} ${
                    filaIdx === celdaActiva.fila ? styles.tdNombreHighlighted : ""
                  }`}
                >
                  <span className={styles.monedaTag}>{origen.moneda}</span>
                  <span className={styles.nombreTag}>
                    {origen.nombre || ""}
                  </span>
                </td>

                {matrizDatos[filaIdx]?.map((celda, colIdx) => (
                  <td
                    key={colIdx}
                    className={
                      celda.tipo === "diagonal"
                        ? `${styles.tdDiagonal} ${
                            filaIdx === celdaActiva.fila || colIdx === celdaActiva.col
                              ? styles.highlighted
                              : ""
                          }`
                        : getClaseCelda(celda.valor, filaIdx, colIdx)
                    }
                    onMouseEnter={() => handleMouseEnter(filaIdx, colIdx)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {celda.tipo === "diagonal" ? "—" : formatearValor(celda.valor)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.ayuda}>
        Pasá el mouse por una celda para resaltar la fila y columna correspondiente.
      </p>
    </section>
  );
}

export default TablaCruzada;