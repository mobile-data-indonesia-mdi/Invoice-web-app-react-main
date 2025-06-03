import { configureStore } from "@reduxjs/toolkit";
import invoiceSlice from '@/redux/invoiceSlice';
import paymentSlice from "@/redux/paymentSlice";
import clientSlice from "@/redux/clientSlice.js";

const store = configureStore({
  reducer: {
    invoices: invoiceSlice.reducer,
    payments: paymentSlice.reducer,
    clients: clientSlice.reducer,
  },
});

export default store;
