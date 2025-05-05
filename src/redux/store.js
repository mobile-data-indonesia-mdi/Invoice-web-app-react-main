import { configureStore } from "@reduxjs/toolkit";
import invoiceSlice from '../redux/invoiceSlice';
import paymentReducer from '../redux/paymentSlice';

const store = configureStore({
  reducer: {
    invoices: invoiceSlice.reducer,
    payments: paymentReducer, // pakai paymentReducer langsung
  },
});

export default store;
