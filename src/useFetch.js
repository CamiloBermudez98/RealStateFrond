import { useState, useEffect, useCallback } from "react";

export function useFetch() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchData = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    const { filterText } = filters;
    let url = apiUrl;

    if (filterText) {
      // Append filterText as a query parameter. Adjust the parameter name if your backend expects something different.
      url += `/filtered?name=${encodeURIComponent(filterText)}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener las propiedades');
      }
      const responseData = await response.json();
      console.log('Datos recibidos del backend:', responseData);
      setData(responseData);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Cancelled request");
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    // Carga inicial de datos sin filtro (cuando va vacío)
    fetchData();
  }, [fetchData]);

  return { data, loading, error, fetchData };
}