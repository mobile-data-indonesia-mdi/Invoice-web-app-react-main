import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/clients`;

export const getAllClientsApi = async () => {
  try {
    const response = await axios.get(API_BASE_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getClientByIdApi = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const createClientApi = async (clientData) => {
  try {
    const response = await axios.post(API_BASE_URL, clientData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const editClientApi = async (id, clientData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, clientData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
