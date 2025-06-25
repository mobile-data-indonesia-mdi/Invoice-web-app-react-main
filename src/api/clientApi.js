// src/api/clientService.js
import { apiClient } from "./api"; // pastikan path-nya benar

export const getAllClientsApi = async () => {
  try {
    const response = await apiClient.get("/clients");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getClientByIdApi = async (id) => {
  try {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createClientApi = async (clientData) => {
  try {
    const response = await apiClient.post("/clients", clientData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const editClientApi = async (id, clientData) => {
  try {
    const response = await apiClient.put(`/clients/${id}`, clientData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Reusable error handler
const handleError = (error) => {
  if (error.response) {
    console.error("API error:", error.response.status, error.message);
  } else {
    console.error("Unexpected error:", error);
  }
  throw error;
};
