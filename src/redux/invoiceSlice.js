import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInvoices, getInvoiceById, createInvoice, editInvoice, toggleVoidInvoice } from "../api/invoiceAPI";

export const fetchInvoices = createAsyncThunk("invoice/fetchInvoices", async (_, { rejectWithValue }) => {
  try {
    console.log("Fetching all invoices...");
    const response = await getInvoices();
    console.log("Fetched invoices:", response);
    return response;
  } catch (error) {
    console.error("Error fetching invoices:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const fetchInvoiceById = createAsyncThunk("invoice/fetchInvoiceById", async (id, { rejectWithValue }) => {
  try {
    console.log("Fetching invoice with ID:", id);
    const response = await getInvoiceById(id);
    console.log("Fetched invoice data:", response);
    return response;
  } catch (error) {
    console.error("Error fetching invoice by ID:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const createNewInvoice = createAsyncThunk( "invoice/createInvoice", async (invoiceData, { rejectWithValue }) => {
    try {
      console.log("Creating new invoice with data:", invoiceData);
      const response = await createInvoice(invoiceData);
      console.log("Invoice created successfully:", response);
      return response;
    } catch (error) {
      console.error("Error creating invoice:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  });

export const editExistingInvoice = createAsyncThunk("invoice/updateInvoice", async ({ id, invoiceData }, { rejectWithValue }) => {
  try {
    console.log("id: ", id);
    console.log("Editing invoice with data:", invoiceData);
    const response = await editInvoice(id, invoiceData);
    console.log("Invoice edited successfully:", response);
    return response;
  } catch (error) {
    console.error("Error editing invoice:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const toggleVoidExistingInvoice = createAsyncThunk("invoice/toggleVoidInvoice", async (id, { rejectWithValue }) => {
  try {
    console.log("Toggling void status for invoice ID:", id);
    const response = await toggleVoidInvoice(id);
    console.log("Void status toggled successfully:", response);
    return response;
  } catch (error) {
    console.error("Error toggling void status:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

const invoiceSlice = createSlice({
  name: "invoice",

  initialState: {
    allInvoice: [],
    filteredInvoice: [],
    invoiceById: null,
    loading: false,
    error: null,
  },

  reducers: {
    // Filter berdasarkan status
    filterInvoice: (state, action) => {
      const { allInvoice } = state;
      if (action.payload.status === "") {
        state.filteredInvoice = allInvoice;
      } else {
        console.log("Filtering invoices by status:", action.payload.status);
        const filteredData = allInvoice.filter((invoice) => {
          if (action.payload.status === "void") {
            return invoice.voided_at !== null;
          } else {
            return invoice.payment_status === action.payload.status && invoice.voided_at === null;
          }
        });
        state.filteredInvoice = filteredData;
      }
    },

    // Hapus invoice
    deleteInvoice: (state, action) => {
      const { allInvoice } = state;
      const index = allInvoice.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        allInvoice.splice(index, 1);
        state.filteredInvoice = allInvoice; // Perbarui filteredInvoice
      }
    },

    // Update status invoice (Void/Unvoid)
    updateInvoiceStatus: (state, action) => {
      const { id, status } = action.payload;
      const invoiceToUpdate = state.allInvoice.find(
        (invoice) => invoice.invoice_id === id
      );
      if (invoiceToUpdate) {
        invoiceToUpdate.status = status;
      }

      // Pastikan filteredInvoice juga diperbarui dengan status baru
      state.filteredInvoice = [...state.allInvoice];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching pending...");
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.allInvoice = action.payload.data;
        state.filteredInvoice = action.payload.data; // Set filteredInvoice to all invoices initially
        console.log("Fetched invoices:", action.payload);
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
        console.error("Error fetching invoices:", action.payload);
      })
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching invoice by ID is pending...");
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceById = action.payload.data;
        console.log("Fetched invoice by ID successfully:", action.payload);
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
        console.error("Error fetching invoice by ID:", action.payload);
      })
      .addCase(createNewInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Creating a new invoice is pending...");
      })
      .addCase(createNewInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.allInvoice.push(action.payload.data);
        console.log("New invoice created successfully:", action.payload);
      })
      .addCase(createNewInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
        console.error("Error creating a new invoice:", action.payload);
      })
      .addCase(editExistingInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Editing an existing invoice is pending...");
      })
      .addCase(editExistingInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.meta.arg; // Get the ID from the meta argument
        const index = state.allInvoice.findIndex((invoice) => invoice.invoice_id === id);
        if (index !== -1) {
          state.allInvoice[index] = { ...state.allInvoice[index], ...action.payload.data };
          // Update filteredInvoice as well
          const filteredIndex = state.filteredInvoice.findIndex((invoice) => invoice.invoice_id === id);
          if (filteredIndex !== -1) {
            state.filteredInvoice[filteredIndex] = { ...state.filteredInvoice[filteredIndex], ...action.payload.data };
          }
          // Reset invoiceById
          state.invoiceById = null;
          console.log("Invoice updated successfully:", action.payload);
        }
      })
      .addCase(editExistingInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
        console.error("Error editing an existing invoice:", action.payload);
      })
      .addCase(toggleVoidExistingInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Toggling void status is pending...");
      })
      .addCase(toggleVoidExistingInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.meta.arg; // Get the ID from the meta argument
        const voidedAt = action.payload.data.voided_at;
        const index = state.allInvoice.findIndex((invoice) => invoice.invoice_id === id);
        if (index !== -1) {
          state.allInvoice[index] = {
            ...state.allInvoice[index],
            voided_at: voidedAt,
          };
          // Update filteredInvoice as well
          const filteredIndex = state.filteredInvoice.findIndex((invoice) => invoice.invoice_id === id);
          if (filteredIndex !== -1) {
            state.filteredInvoice[filteredIndex]= {
              ...state.filteredInvoice[filteredIndex],
              voided_at: voidedAt,
            }
          }
        }
        // Reset invoiceById
        state.invoiceById = null;
        console.log("Void status toggled successfully:", action.payload.data);
      })
      .addCase(toggleVoidExistingInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
        console.error("Error toggling void status:", action.payload.data);
      })
      ;
  },
});

export default invoiceSlice;
