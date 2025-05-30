import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllInvoicesApi, getInvoiceByIdApi, createInvoiceApi, editInvoiceApi, toggleVoidInvoiceApi } from "@/api/invoiceApi.js";

export const fetchAllInvoices = createAsyncThunk("invoice/fetchInvoices", async (_, { rejectWithValue }) => {
  try {
    console.log("Fetching all invoices...");
    const response = await getAllInvoicesApi();
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
    const response = await getInvoiceByIdApi(id);
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
      const response = await createInvoiceApi(invoiceData);
      console.log("Invoice created successfully:", response);
      return response;
    } catch (error) {
      console.error("Error creating invoice:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  });

export const editInvoice = createAsyncThunk("invoice/updateInvoice", async ({ id, invoiceData }, { rejectWithValue }) => {
  try {
    console.log("id: ", id);
    console.log("Editing invoice with data:", invoiceData);
    const response = await editInvoiceApi(id, invoiceData);
    console.log("Invoice edited successfully:", response);
    return response;
  } catch (error) {
    console.error("Error editing invoice:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const toggleVoidInvoice = createAsyncThunk("invoice/toggleVoidInvoice", async (id, { rejectWithValue }) => {
  try {
    console.log("Toggling void status for invoice ID:", id);
    const response = await toggleVoidInvoiceApi(id);
    console.log("Void status toggled successfully:", response);
    return response;
  } catch (error) {
    console.error("Error toggling void status:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  allInvoices: [],
  filteredInvoice: [],
  invoiceById: null,
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    // Filter berdasarkan status
    filterInvoice: (state, action) => {
      const { allInvoices } = state;
      if (action.payload.status === "") {
        state.filteredInvoice = allInvoices;
      } else {
        console.log("Filtering invoices by status:", action.payload.status);
        const filteredData = allInvoices.filter((invoice) => {
          if (action.payload.status === "void") {
            return invoice.voided_at !== null;
          } else {
            return invoice.payment_status === action.payload.status && invoice.voided_at === null;
          }
        });
        state.filteredInvoice = filteredData;
      }
    },

    // Update status invoice (Void/Unvoid)
    updateInvoiceStatus: (state, action) => {
      const { id, status } = action.payload;
      const invoiceToUpdate = state.allInvoices.find(
        (invoice) => invoice.invoice_id === id
      );
      if (invoiceToUpdate) {
        invoiceToUpdate.status = status;
      }

      // Pastikan filteredInvoice juga diperbarui dengan status baru
      state.filteredInvoice = [...state.allInvoices];
    },

    // Reset error state
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Case for fetching all invoices
      .addCase(fetchAllInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching pending...");
      })
      .addCase(fetchAllInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.allInvoices = action.payload?.data || [];
        state.filteredInvoice = action.payload?.data || []; // Set filteredInvoice to all invoices initially
        console.log("Fetched invoices:", action.payload);
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error fetching invoices:", action.payload);
      })
      // Case for fetching invoice by ID
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
        state.error = action.payload;
        console.error("Error fetching invoice by ID:", action.payload);
      })
      // Case for creating a new invoice
      .addCase(createNewInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Creating a new invoice is pending...");
      })
      .addCase(createNewInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.allInvoices.push(action.payload.data);
        console.log("New invoice created successfully:", action.payload);
      })
      .addCase(createNewInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error creating a new invoice:", action.payload);
      })
      // Case for editing an existing invoice
      .addCase(editInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Editing an existing invoice is pending...");
      })
      .addCase(editInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const updatedInvoice = action.payload.data;
        const index = state.allInvoices.findIndex((invoice) => invoice.invoice_id === updatedInvoice.invoice_id);
        if (index !== -1) {
          state.allInvoices[index] = {
            ...state.allInvoices[index],
            ...updatedInvoice,
          };
          // Update filteredInvoice as well
          const filteredIndex = state.filteredInvoice.findIndex((invoice) => invoice.invoice_id === updatedInvoice.invoice_id);
          if (filteredIndex !== -1) {
            state.filteredInvoice[filteredIndex]= {
              ...state.filteredInvoice[filteredIndex],
              ...updatedInvoice,
            }
          }
        }
        // Reset invoiceById
        state.invoiceById = null;
        console.log("Invoice updated successfully:", action.payload.data);
      })
      .addCase(editInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error editing an existing invoice:", action.payload);
      })
      .addCase(toggleVoidInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Toggling void status is pending...");
      })
      // Case for toggling void status
      .addCase(toggleVoidInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const updatedInvoice = action.payload.data;
        const index = state.allInvoices.findIndex((invoice) => invoice.invoice_id === updatedInvoice.invoice_id);
        if (index !== -1) {
          state.allInvoices[index] = {
            ...state.allInvoices[index],
            ...updatedInvoice,
          };
          // Update filteredInvoice as well
          const filteredIndex = state.filteredInvoice.findIndex((invoice) => invoice.invoice_id === updatedInvoice.invoice_id);
          if (filteredIndex !== -1) {
            state.filteredInvoice[filteredIndex]= {
              ...state.filteredInvoice[filteredIndex],
              ...updatedInvoice,
            }
          }
        }
        // Reset invoiceById
        state.invoiceById = null;
        console.log("Void status toggled successfully:", action.payload.data);
      })
      .addCase(toggleVoidInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Error toggling void status:", action.payload.data);
      });
  },
});

export default invoiceSlice;
