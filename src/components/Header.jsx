


// components/Header.jsx
import React from "react";
import { construirTicker, formatearFecha } from "../utils/formatters";
import styles from "./Header.module.css";

function Header({ divisas, lastUpdate, onRefresh, loading }) {
  const tickerTexto = construirTicker(divisas);

  return (
    <header className={styles.header}>
      <div className={styles.noise} />

      <div className={styles.topRow}>
        <span className={styles.label}>COLOMBIA · DIVISAS EN TIEMPO REAL</span>
        <div className={styles.controls}>
          {lastUpdate && (
            <span className={styles.update}>
              Actualizado: {formatearFecha(lastUpdate)}
            </span>
          )}
          <button
            className={`${styles.refreshBtn} ${loading ? styles.spinning : ""}`}
            onClick={onRefresh}
            disabled={loading}
            title="Actualizar cotizaciones"
          >
            ↻
          </button>
        </div>
      </div>

      <h1 className={styles.titulo}>
        Convertidor<br />
        <em>de Divisas</em>
      </h1>

      <div className={styles.ticker}>
        {tickerTexto || "Cargando cotizaciones..."}
      </div>
    </header>
  );
}

export default Header;