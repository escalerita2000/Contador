// hooks/useDivisas.js
// Hook custom para manejar las cotizaciones de la API
// Separo esto del componente para que sea reutilizable

import { useState, useEffect } from "react";

const API_URL = "https://co.dolarapi.com/v1/cotizaciones";

// Esta funcion la hice asi para que sea facil de testear por separado
async function fetchCotizaciones() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export function useDivisas() {
  const [divisas, setDivisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const cargar = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCotizaciones();
      // Agregamos COP manualmente como punto de referencia base
      // La API no lo devuelve porque es la moneda local
      const conCOP = [
        { moneda: "COP", nombre: "Peso Colombiano", venta: 1, compra: 1, ultimoCierre: 1 },
        ...data,
      ];
      setDivisas(conCOP);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message || "Error al cargar cotizaciones");
      console.error("useDivisas error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // Auto-refresh cada 5 minutos por si el usuario deja la app abierta
    const interval = setInterval(cargar, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Esta funcion la uso en el convertidor para obtener la tasa de cambio
  // entre dos monedas cualesquiera pasando por COP como intermediario
  const getTasa = (monedaOrigen, monedaDestino) => {
    if (monedaOrigen === monedaDestino) return 1;

    const origen = divisas.find((d) => d.moneda === monedaOrigen);
    const destino = divisas.find((d) => d.moneda === monedaDestino);

    if (!origen || !destino) return null;

    const tasaOrigenCOP = origen.venta || origen.ultimoCierre || 1;
    const tasaDestinoCOP = destino.venta || destino.ultimoCierre || 1;

    // Primero convierto a COP y despues a la moneda destino
    return tasaOrigenCOP / tasaDestinoCOP;
  };

  return {
    divisas,
    loading,
    error,
    lastUpdate,
    refetch: cargar,
    getTasa,
  };
}