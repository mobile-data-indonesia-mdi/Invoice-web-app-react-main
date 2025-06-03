//api/invoiceApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/invoices";

export const getAllInvoicesApi = async () => {
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

export const getInvoiceByIdApi = async (id) => {
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

export const createInvoiceApi = async (invoiceData) => {
  try {
    const response = await axios.post(API_BASE_URL, invoiceData, {
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

export const editInvoiceApi = async (id, invoiceData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, invoiceData, {
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

export const toggleVoidInvoiceApi = async (id) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/${id}/void-status`,
      null,
      { withCredentials: true }
    );
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
