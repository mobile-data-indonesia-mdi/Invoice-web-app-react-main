import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getPayments, getPaymentById, createPayment, editPayment} from "../api/paymentApi.js";

export const fetchPayments = createAsyncThunk( 'payments/fetchPayments', async (_, { rejectWithValue }) => {
  try {
    console.log("Fetching all payments...");
    const response = await getPayments();
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
    const response = await getPaymentById(id);
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
    const response = await createPayment(paymentData);
    console.log("Payment created successfully:", response);
    return response;
  } catch (error) {
    console.error("Error creating payment:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const editExistingPayment = createAsyncThunk( 'payments/updatePayment', async ({ id, paymentData }, { rejectWithValue }) => {
  try {
    console.log("Editing payment with data:", paymentData);
    const response = await editPayment(id, paymentData);
    console.log("Payment edited successfully:", response);
    return response;
  } catch (error) {
    console.error("Error editing payment:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

// export const toggleVoidExistingPayment = createAsyncThunk( 'payments/toggleVoidPayment', async (id, { rejectWithValue }) => {
//   try {
//     console.log("Toggling void status for payment ID:", id);
//     const response = await toggleVoidPayment(id);
//     console.log("Void status toggled successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Error toggling void status:", error.response?.data || error.message);
//     return rejectWithValue(error.response.data);
//   }
// });

const initialState = {
  allPayments: [], // daftar semua transaksi pembayaran
  paymentById: null, // transaksi pembayaran berdasarkan ID
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    // Menambahkan pembayaran baru ke dalam state
    addPayment: (state, action) => {
      state.payments.push(action.payload);
    },

    // Menghapus pembayaran berdasarkan ID
    deletePayment: (state, action) => {
      state.payments = state.payments.filter(p => p.id !== action.payload.id);
    },

    // Memperbarui pembayaran berdasarkan ID
    updatePayment: (state, action) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching pending...");
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data;
        console.log("Fetched payments successfully:", action.payloa);
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
        console.error("Error fetching payments:", action.payload);
      })
      .addCase(fetchPaymentById.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching payment by ID pending...");
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceById = action.payload.data;
        console.log("Fetched invoice by ID:", action.payload);
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
        console.error("Error fetching payment by ID:", action.payload);
      })
      .addCase(createNewPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Creating payment pending...");
      })
      .addCase(createNewPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload.data);
        console.log("New payment created successfully:", action.payload.data);
      })
      .addCase(createNewPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
        console.error("Error creating payment:", action.payload);
      })
      .addCase(editExistingPayment.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        console.log("Editing payment pending...");
      })
      .addCase(editExistingPayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.payments[index] = action.payload.data;
        }
        state.paymentById = null;
        console.log("Payment edited successfully:", action.payload.data);
      })
      .addCase(editExistingPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
        console.error("Error editing payment:", action.payload);
      });
  }
});

// Mengekspor action yang digunakan di komponen untuk dispatch
export const { addPayment, deletePayment, updatePayment } = paymentSlice.actions;

// Mengekspor reducer untuk digunakan di store.js
export default paymentSlice.reducer;
