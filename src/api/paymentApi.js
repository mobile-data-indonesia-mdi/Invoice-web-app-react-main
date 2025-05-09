import axios from "axios";

const API_BASE_URL = "http://localhost:8080/payments";

export const getPayments = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const getPaymentById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(API_BASE_URL, paymentData, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const editPayment = async (id, paymentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, paymentData, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

// export const toggleVoidPayment = async (id) => {
//   try {
//     const response = await axios.patch(`${API_BASE_URL}/${id}/void-status`, null, { withCredentials: true });
//     return response.data;
//   } catch (error) {
//     console.error("Error toggling void status:", error);
//     throw error;
//   }
// };