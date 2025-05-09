import { useState, useEffect } from "react";
import axios from "axios";

export function useApi({
  url,
  method = "GET",
  body = null,
  trigger,
  withCredentials = true,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios({
          url,
          method,
          data: body,
          withCredentials,
          cancelToken: source.token,
        });
        if (isMounted) setData(response.data.data || response.data);
      } catch (err) {
        if (isMounted && !axios.isCancel(err)) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      source.cancel("Request cancelled");
    };
  }, [url, method, JSON.stringify(body), trigger]);

  return { data, loading, error };
}
