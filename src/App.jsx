// App.jsx
import React from "react";
import { useDivisas } from "./hooks/useDivisas";
import Header from "./components/Header";
import Convertidor from "./components/Convertidor";
import TablaCruzada from "./components/TablaCruzada";
import { LoadingState, ErrorState } from "./components/Estados";

// Estilos inline para no depender del CSS module de App
const css = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    padding: "3rem 4rem",
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  sectionWrap: {
    padding: "2.5rem 0",
  },
  divider: {
    height: "1px",
    background: "var(--border)",
  },
  errorBanner: {
    background: "var(--red-dim)",
    border: "1px solid rgba(201,76,76,0.3)",
    color: "var(--red)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    padding: "0.7rem 1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
    letterSpacing: "0.05em",
  },
  bannerBtn: {
    background: "transparent",
    border: "1px solid currentColor",
    color: "inherit",
    padding: "0.2rem 0.6rem",
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    cursor: "pointer",
    marginLeft: "auto",
  },
  footer: {
    padding: "1.5rem 4rem",
    borderTop: "1px solid var(--border)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.68rem",
    color: "var(--text-dim)",
    letterSpacing: "0.08em",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  footerLink: {
    color: "var(--gold)",
    textDecoration: "none",
  },
};

function App() {
  const { divisas, loading, error, lastUpdate, refetch, getTasa } = useDivisas();

  return (
    <div style={css.app}>
      <Header
        divisas={divisas}
        lastUpdate={lastUpdate}
        onRefresh={refetch}
        loading={loading}
      />

      {loading && divisas.length === 0 ? (
        <LoadingState />
      ) : error && divisas.length === 0 ? (
        <ErrorState mensaje={error} onRetry={refetch} />
      ) : (
        <main style={css.main}>
          {error && (
            <div style={css.errorBanner}>
              ⚠ No se pudo actualizar: {error}
              <button style={css.bannerBtn} onClick={refetch}>
                Reintentar
              </button>
            </div>
          )}

          <div style={css.sectionWrap}>
            <Convertidor divisas={divisas} getTasa={getTasa} />
          </div>

          <div style={css.divider} />

          <div style={css.sectionWrap}>
            <TablaCruzada divisas={divisas} getTasa={getTasa} />
          </div>
        </main>
      )}

      <footer style={css.footer}>
        <span>Datos en tiempo real vía</span>
        <a
          href="https://dolarapi.com"
          target="_blank"
          rel="noreferrer"
          style={css.footerLink}
        >
          dolarapi.com
        </a>
        <span>· Colombia</span>
      </footer>
    </div>
  );
}

export default App;