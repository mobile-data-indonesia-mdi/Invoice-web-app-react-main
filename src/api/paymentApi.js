// src/api/paymentService.js
import { apiClient } from "./api"; 

export const getAllPaymentsApi = async () => {
  try {
    const response = await apiClient.get("/payments");
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching payments");
  }
};

export const getPaymentByIdApi = async (id) => {
  try {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Error fetching payment by ID");
  }
};

export const createPaymentApi = async (paymentData) => {
  try {
    const response = await apiClient.post("/payments", paymentData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error, "Error creating payment");
  }
};

export const editPaymentApi = async (id, paymentData) => {
  try {
    const response = await apiClient.put(`/payments/${id}`, paymentData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error, "Error updating payment");
  }
};

export const toggleVoidPaymentApi = async (id) => {
  try {
    const response = await apiClient.patch(`/payments/${id}/void-status`);
    return response.data;
  } catch (error) {
    handleError(error, "Error toggling void status");
  }
};

export const getProofOfTransferApi = async (filePath) => {
  try {
    const response = await apiClient.get(`/payments/${filePath}`, {
      responseType: "blob",
    });
    const fileUrl = URL.createObjectURL(new Blob([response.data]));
    const newWindow = window.open(fileUrl, "_blank", "noopener,noreferrer");
    if (newWindow) URL.revokeObjectURL(fileUrl);
    return fileUrl;
  } catch (error) {
    handleError(error, "Error fetching proof of transfer");
  }
};

// Error handler
const handleError = (error, contextMessage = "API Error") => {
  console.error(contextMessage);
  if (error.response) {
    console.error("API error:", error.response.status, error.message);
  } else {
    console.error("Unexpected error:", error);
  }
  throw error;
};
