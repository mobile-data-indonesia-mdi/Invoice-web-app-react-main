import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {getAllClientsApi, getClientByIdApi, createClientApi, editClientApi} from "@/api/clientApi.js";

export const fetchAllClients = createAsyncThunk('clients/fetchAllClients', async (_, { rejectWithValue }) => {
  try {
    const response = await getAllClientsApi();
    console.log("Fetched clients data:", response);
    return response;
  } catch (error) {
    console.error("Error fetching clients:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const fetchClientById = createAsyncThunk('clients/fetchClientById', async (id, { rejectWithValue }) => {
  try {
    const response = await getClientByIdApi(id);
    console.log("Fetched client data:", response);
    return response;
  } catch (error) {
    console.error("Error fetching client by ID:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const createNewClient = createAsyncThunk('clients/createClient', async (clientData, { rejectWithValue }) => {
  try {
    const response = await createClientApi(clientData);
    console.log("Created new client:", response);
    return response;
  } catch (error) {
    console.error("Error creating client:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

export const editClient = createAsyncThunk('clients/editClient', async ({id, clientData}, { rejectWithValue }) => {
  try {
    const response = await editClientApi(id, clientData);
    console.log("Edited client:", response);
    return response;
  } catch (error) {
    console.error("Error editing client:", error.response?.data || error.message);
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  allClients: [],
  clientById: null,
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    resetClientById: (state) => {
      state.clientById = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Case for fetching all clients
      .addCase(fetchAllClients.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching pending...");
      })
      .addCase(fetchAllClients.fulfilled, (state, action) => {
        state.loading = false;
        state.allClients = action.payload?.data || [];
        console.log("Fetched clients:", action.payload.data);
      })
      .addCase(fetchAllClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("Error fetching clients:", action.payload.data);
      })
      // Case for fetching client by ID
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching client by ID pending...");
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.clientById = action.payload.data;
        console.log("Fetched client by ID:", action.payload.data);
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("Error fetching client by ID:", action.payload.data);
      })
      // Case for creating a new client
      .addCase(createNewClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Creating new client pending...");
      })
      .addCase(createNewClient.fulfilled, (state, action) => {
        state.loading = false;
        state.allClients.push(action.payload.data);
        console.log("Created new client:", action.payload.data);
      })
      // Case for editing a client
      .addCase(createNewClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("Error creating client:", action.payload.data);
      })
      .addCase(editClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Editing client pending...");
      })
      .addCase(editClient.fulfilled, (state, action) => {
        state.loading = false;
        const updatedClient = action.payload.data;
        const index = state.allClients.findIndex((client) => client.client_id === updatedClient.client_id);
        if (index !== -1) {
          state.allClients[index] = {
            ...state.allClients[index],
            ...updatedClient,
          };
        }
        
        console.log("Edited client:", action.payload.data);
      })
      .addCase(editClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("Error editing client:", action.payload.data);
      });
  }
});

export default clientSlice;