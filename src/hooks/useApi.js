// useApi.js
import { useState, useEffect, useRef } from "react";
import { apiClient } from "./api";

export function useApi({ url, method = "GET", body = null, trigger }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cancelSource = useRef(null);

  useEffect(() => {
    let isMounted = true;
    cancelSource.current = apiClient.CancelToken.source();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient({
          url,
          method,
          data: body,
          cancelToken: cancelSource.current.token,
        });

        if (isMounted) {
          setData(response.data?.data || response.data);
        }
      } catch (err) {
        if (isMounted && !axios.isCancel(err)) {
          setError(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      cancelSource.current?.cancel("Component unmounted");
    };
  }, [url, method, JSON.stringify(body), trigger]);

  return { data, loading, error };
}
