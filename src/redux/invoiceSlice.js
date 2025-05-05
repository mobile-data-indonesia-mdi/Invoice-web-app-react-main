import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import data from "../assets/data/data.json";

const today = moment().format("YYYY-MM-DD");

const invoiceSlice = createSlice({
  name: "invoice",

  initialState: {
    allInvoice: data,
    filteredInvoice: [],
    invoiceById: null,
  },

  reducers: {
    // Filter berdasarkan status
    filterInvoice: (state, action) => {
      const { allInvoice } = state;
      if (action.payload.status === "") {
        state.filteredInvoice = allInvoice;
      } else {
        const filteredData = allInvoice.filter((invoice) => {
          return invoice.status === action.payload.status;
        });
        state.filteredInvoice = filteredData;
      }
    },

    // Ambil invoice berdasarkan ID
    getInvoiceById: (state, action) => {
      const { allInvoice } = state;
      const invoice = allInvoice.find((item) => item.id === action.payload.id);
      state.invoiceById = invoice;
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
        (invoice) => invoice.id === id
      );
      if (invoiceToUpdate) {
        invoiceToUpdate.status = status;
      }

      // Pastikan filteredInvoice juga diperbarui dengan status baru
      state.filteredInvoice = [...state.allInvoice];
    },

    // Tambahkan invoice baru
    addInvoice: (state, action) => {
      const {
        description,
        paymentTerms,
        clientName,
        clientEmail,
        senderStreet,
        senderCity,
        senderPostCode,
        senderCountry,
        clientStreet,
        clientCity,
        clientPostCode,
        clientCountry,
        item,
        invoiceNumber,
        createdAt,
        dueDate,
        currency,
      } = action.payload;

      const finalData = {
        id: invoiceNumber,
        createdAt,
        paymentDue: dueDate,
        description,
        paymentTerms,
        clientName,
        clientEmail,
        status: "pending",
        senderAddress: {
          street: senderStreet,
          city: senderCity,
          postCode: senderPostCode,
          country: senderCountry,
        },
        clientAddress: {
          street: clientStreet,
          city: clientCity,
          postCode: clientPostCode,
          country: clientCountry,
        },
        items: item.map((i) => ({
          ...i,
          price: parseFloat(i.price) || 0, // Pastikan nilai price valid
          usage: parseFloat(i.usage) || 0, // Pastikan nilai usage valid
          total: parseFloat((i.usage || 0) * (i.price || 0)).toFixed(2),
        })),
        currency: currency || "USD",
        total: item.reduce(
          (acc, i) => acc + parseFloat((i.usage || 0) * (i.price || 0)).toFixed(2),
          0
        ),
      };

      state.allInvoice.push(finalData);
    },

    // Edit invoice
    editInvoice: (state, action) => {
      const { allInvoice } = state;
      const {
        description,
        paymentTerms,
        clientName,
        clientEmail,
        senderStreet,
        senderCity,
        senderPostCode,
        senderCountry,
        clientStreet,
        clientCity,
        clientPostCode,
        clientCountry,
        item,
        id,
        createdAt,
        dueDate,
        currency,
      } = action.payload;

      const invoiceIndex = allInvoice.findIndex((invoice) => invoice.id === id);
      if (invoiceIndex !== -1) {
        allInvoice[invoiceIndex] = {
          ...allInvoice[invoiceIndex],
          description,
          paymentTerms,
          clientName,
          clientEmail,
          senderAddress: {
            street: senderStreet,
            city: senderCity,
            postCode: senderPostCode,
            country: senderCountry,
          },
          clientAddress: {
            street: clientStreet,
            city: clientCity,
            postCode: clientPostCode,
            country: clientCountry,
          },
          items: item,
          createdAt,
          paymentDue: dueDate,
          currency,
          total: item.reduce((acc, i) => acc + Number(i.total), 0),
        };
        state.filteredInvoice = [...allInvoice]; // Perbarui filteredInvoice
      }
    },
  },
});

export default invoiceSlice;
