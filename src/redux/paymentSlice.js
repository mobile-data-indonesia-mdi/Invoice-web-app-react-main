import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getAllPaymentsApi, getPaymentByIdApi, createPaymentApi, editPaymentApi, toggleVoidPaymentApi} from "@/api/paymentApi.js";

export const fetchAllPayments = createAsyncThunk( 'payments/fetchAllPayments', async (_, { rejectWithValue }) => {
  try {
    console.log("Fetching all payments...");
    const response = await getAllPaymentsApi();
    console.log("Fetched payments:", response);
    return response;
  } catch (error) {
    console.error("Error fetching payments:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const fetchPaymentById = createAsyncThunk( 'payments/fetchPaymentById', async (id, { rejectWithValue }) => {
  try {
    console.log("Fetching payment with ID:", id);
    const response = await getPaymentByIdApi(id);
    console.log("Fetched payment data:", response);
    return response;
  } catch (error) {
    console.error("Error fetching payment by ID:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const createNewPayment = createAsyncThunk( 'payments/createPayment', async (paymentData, { rejectWithValue }) => {
  try {
    console.log("Creating new payment with data:", paymentData);
    const response = await createPaymentApi(paymentData);
    console.log("Payment created successfully:", response);
    return response;
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const editPayment = createAsyncThunk( 'payments/editPayment', async ({ id, paymentData }, { rejectWithValue }) => {
  try {
    console.log("Editing payment with data:", paymentData);
    const response = await editPaymentApi(id, paymentData);
    console.log("Payment edited successfully:", response);
    return response;
  } catch (error) {
    console.error("Error editing payment:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const toggleVoidPayment = createAsyncThunk( 'payments/toggleVoidPayment', async (id, { rejectWithValue }) => {
  try {
    console.log("Toggling void status for payment ID:", id);
    const response = await toggleVoidPaymentApi(id);
    console.log("Void status toggled successfully:", response);
    return response;
  } catch (error) {
    console.error("Error toggling void status:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  allPayments: [],
  filteredPayment: [], // daftar semua transaksi pembayaran
  paymentById: null, // transaksi pembayaran berdasarkan ID
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
     // Filter berdasarkan status
    filterPayment: (state, action) => {
      const { allPayments } = state;
      if (action.payload.status === "") {
        state.filteredPayment = allPayments;
      } else {
        console.log("Filtering payments by status:", action.payload.status);
        const filteredData = allPayments.filter((payment) => {
          if (action.payload.status === "void") {
            return payment.voided_at !== null;
          } else if (action.payload.status === "not-void") {
            return payment.voided_at === null;
          }
        });
        state.filteredPayment = filteredData;
        console.log("Filtered payments:", state.filteredPayment);
      }
    },
    resetPaymentById: (state) => {
      state.paymentById = null;
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Case for fetching all payments
      .addCase(fetchAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching pending...");
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.allPayments = action.payload?.data || [];
        state.filteredPayment = action.payload?.data || [];
        console.log("Fetched payments successfully:", action.payload);
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error fetching payments:", action.payload);
      })
      // Case for fetching payment by ID
      .addCase(fetchPaymentById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching payment by ID pending...");
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentById = action.payload.data;
        console.log("Fetched invoice by ID:", action.payload);
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error fetching payment by ID:", action.payload);
      })
      // Case for creating a new payment
      .addCase(createNewPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Creating payment pending...");
      })
      .addCase(createNewPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.allPayments.push(action.payload.data);
        console.log("New payment created successfully:", action.payload.data);
      })
      .addCase(createNewPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error creating payment:", action.payload);
      })
      // Case for editing a payment
      .addCase(editPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Editing payment pending...");
      })
      .addCase(editPayment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPayment = action.payload.data;
        const index = state.allPayments.findIndex((payment) => payment.payment_id === updatedPayment.payment_id);

        if (index !== -1) {
          state.allPayments[index] = {
            ...state.allPayments[index],
            ...updatedPayment,
          };

          const filteredIndex = state.filteredPayment.findIndex((payment) => payment.payment_id === updatedPayment.payment_id);
          if (filteredIndex !== -1) {
            state.filteredPayment[filteredIndex] = {
              ...state.filteredPayment[filteredIndex],
              ...updatedPayment,
            };
          }
        }
        state.paymentById = null;
        console.log("Payment edited successfully:", action.payload.data);
      })
      .addCase(editPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error editing payment:", action.payload);
      })
      // Case for toggling void status
      .addCase(toggleVoidPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Toggling void status pending...");
      })
      .addCase(toggleVoidPayment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPayment = action.payload.data;
        const index = state.allPayments.findIndex((payment) => payment.payment_id === updatedPayment.payment_id);

        if (index !== -1) {
          state.allPayments[index] = {
            ...state.allPayments[index],
            ...updatedPayment,
          };

          const filteredIndex = state.filteredPayment.findIndex((payment) => payment.payment_id === updatedPayment.payment_id);
          if (filteredIndex !== -1) {
            state.filteredPayment[filteredIndex] = {
              ...state.filteredPayment[filteredIndex],
              ...updatedPayment,
            };
          }
        }

        console.log("Void status toggled successfully:", action.payload.data);
      })
      .addCase(toggleVoidPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error toggling void status:", action.payload);
      });
  }
});

// Mengekspor reducer untuk digunakan di store.js
export default paymentSlice;
