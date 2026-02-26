// components/Estados.jsx
// Componentes simples para los estados de carga y error
// Los separo del App para mantener todo mas limpio

import React from "react";
import styles from "./Estados.module.css";

export function LoadingState() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <p className={styles.texto}>Cargando cotizaciones...</p>
      <p className={styles.subtexto}>Consultando dolarapi.com</p>
    </div>
  );
}

export function ErrorState({ mensaje, onRetry }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠</div>
      <p className={styles.errorTitulo}>No se pudieron cargar las cotizaciones</p>
      <p className={styles.errorMensaje}>{mensaje}</p>
      <button className={styles.retryBtn} onClick={onRetry}>
        REINTENTAR
      </button>
    </div>
  );
}