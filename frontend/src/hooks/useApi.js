import { useState, useCallback } from 'react';

export function useApi(apiCall) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiCall(...params);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { execute, loading, error };
}