import axios from "axios";

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
  });

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      error ? prom.reject(error) : prom.resolve(token);
    });
    failedQueue = [];
  };

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/users/refresh-token")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => instance(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await instance.post(
            "/users/refresh-token",
            null,
            {
              withCredentials: true,
            }
          );

          processQueue(null, refreshResponse.data);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Optionally: window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createAxiosInstance();
