import { useState, useCallback } from "react";

export const useFetch = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFunc(...args);
        setData(res.data);
        return res.data;
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Something went wrong";
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
};

export default useFetch;
