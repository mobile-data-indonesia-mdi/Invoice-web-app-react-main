//api/invoiceApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/invoices";

export const getInvoices = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(API_BASE_URL, invoiceData, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const editInvoice = async (id, invoiceData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, invoiceData, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const toggleVoidInvoice = async (id) => {
  try {
    console.log("Toggling void status for invoice ID:", id);
    const response = await axios.patch(`${API_BASE_URL}/${id}/void-status`, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error toggling void status:", error);
    throw error;
  }
};

// export const deleteInvoice = async (id) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting invoice:", error);
//     throw error;
//   }
// };