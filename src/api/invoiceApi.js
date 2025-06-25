//api/invoiceApi.js
import axios from "axios";
import { apiClient } from "./api";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/invoices`;

export const getAllInvoicesApi = async () => {
  try {
    const response = await apiClient.get("/invoices");
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API error:", error.response.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getInvoiceByIdApi = async (id) => {
  try {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createInvoiceApi = async (invoiceData) => {
  try {
    const response = await apiClient.post("/invoices", invoiceData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const editInvoiceApi = async (id, invoiceData) => {
  try {
    const response = await apiClient.put(`/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const toggleVoidInvoiceApi = async (id) => {
  try {
    const response = await apiClient.patch(`/invoices/${id}/void-status`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  if (error.response) {
    console.error("API error:", error.response.status, error.message);
  } else {
    console.error("Unexpected error:", error);
  }
  throw error;
};
