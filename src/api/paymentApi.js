import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/payments`;

export const getAllPaymentsApi = async () => {
  try {
    const response = await axios.get(API_BASE_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching payments");
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getPaymentByIdApi = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payment by ID:");
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const createPaymentApi = async (paymentData) => {
  try {
    const response = await axios.post(API_BASE_URL, paymentData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment");
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const editPaymentApi = async (id, paymentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, paymentData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating payment");
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const toggleVoidPaymentApi = async (id) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/${id}/void-status`,
      null,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling void status");
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const getProofOfTransferApi = async (filePath) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${filePath}`, {
      withCredentials: true,
      responseType: "blob",
    });
    const fileUrl = URL.createObjectURL(new Blob([response.data]));
    const newWindow = window.open(fileUrl, "_blank", "noopener,noreferrer");
    if (newWindow) {
      URL.revokeObjectURL(fileUrl);
    }
    return fileUrl;
  } catch (error) {
    console.error("Error fetching proof of transfer");
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.status, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
