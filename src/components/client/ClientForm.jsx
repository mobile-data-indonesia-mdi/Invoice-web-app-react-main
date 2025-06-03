import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import clientSlice, { createNewClient, editClient } from "@/redux/clientSlice.js";
import { clientFormValidator } from '@/functions/validator/clientFormValidator.js';

// Validation function
function validator(formData) {
  const msg = clientFormValidator(formData);
  if (msg !== true) {
    alert(msg);
    return false;
  }
  return true;
}

export default function ClientForm({showModal, setShowModal}) {
  const dispatch = useDispatch();
  const type = showModal.type;

  const client = useSelector((state) => state.clients.clientById);

  const [formData, setFormData] = useState({
    client_name: type === "edit" ? client?.client_name : "",
    currency: type === "edit" ? client?.currency : "USD",
    country: type === "edit" ? client?.country : "",
    client_address: type === "edit" ? client?.client_address : "",
    postal_code: type === "edit" ? client?.postal_code : "",
    client_phone: type === "edit" ? client?.client_phone : "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator(formData)) {
      return;
    }

    if(type === 'edit') {
      await dispatch(editClient({id: client.client_id, clientData: formData}));
    } else {
      await dispatch(createNewClient(formData));
    }

    setShowModal({status: false});
    if (type === "edit") await dispatch(clientSlice.actions.resetClientById());
  };

  return(
    <div
      onClick={(e) => e.target === e.currentTarget && setShowModal({status: false})}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          { type === "edit" ? "Edit CLient" : "Add New Client"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { name: "client_name", label: "Name" },
            { name: "country", label: "Country" },
            { name: "client_address", label: "Address" },
            { name: "postal_code", label: "Postal Code" },
            { name: "client_phone", label: "Phone" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm text-gray-700 dark:text-gray-300">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-[#252945] dark:text-white shadow-sm sm:text-sm"
                required
              />
            </div>
          ))}
          <label className="text-gray-400 dark:text-gray-300 block mb-1">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="w-full py-2 px-4 border rounded dark:bg-[#1E2139] dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="USD">USD</option>
            <option value="IDR">IDR</option>
          </select>

          <div className="flex justify-end gap-2 pt-8">
            <button
              type="button"
              onClick={() => setShowModal({status: false})}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#7c5dfa] text-white hover:bg-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}