import Sidebar from "./Sidebar";
import { useState } from "react";
import { useApi } from "../hooks/useApi"; 

export default function ClientPage() {
  const [selectedMenu, setSelectedMenu] = useState("Client");
  const [showModal, setShowModal] = useState(false);
  const [trigger, setTrigger] = useState(0); 
  const [formData, setFormData] = useState({
    client_name: "",
    currency: "",
    country: "",
    client_address: "",
    postal_code: "",
    client_phone: "",
  });

  const {
    data: clients = [],
    loading,
    error,
  } = useApi({
    url: "http://localhost:8081/clients",
    method: "GET",
    trigger,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8081/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      setFormData({
        client_name: "",
        currency: "",
        country: "",
        client_address: "",
        postal_code: "",
        client_phone: "",
      });
      setShowModal(false);
      setTrigger((prev) => prev + 1); 
    } catch (err) {
      console.error("Error submitting client data:", err);
    }
  };

  return (
    <div className="flex dark:bg-[#141625] min-h-screen">
      <Sidebar selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />
      <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 shadow-md mt-6 w-full pt-16">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Client Data
          </h1>
          <button
            className="hover:opacity-80 ml-4 md:ml-10 flex items-center py-2 px-4 md:space-x-3 space-x-2 bg-[#7c5dfa] text-white rounded-full shadow-md"
            onClick={() => setShowModal(true)}
          >
            <span className="text-sm font-medium">New Client</span>
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading clients...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">Error fetching clients</p>
        ) : clients.length > 0 ? (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white dark:bg-[#1E2139] text-sm text-left text-gray-700 dark:text-gray-200">
              <thead className="bg-gray-100 dark:bg-[#252945] text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Currency</th>
                  <th className="px-4 py-2">Country</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Postal Code</th>
                  <th className="px-4 py-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.client_id}
                    className="hover:bg-gray-50 dark:hover:bg-[#2c2e4a]"
                  >
                    <td className="px-4 py-2">{client.client_name}</td>
                    <td className="px-4 py-2">{client.currency}</td>
                    <td className="px-4 py-2">{client.country}</td>
                    <td className="px-4 py-2">{client.client_address}</td>
                    <td className="px-4 py-2">{client.postal_code}</td>
                    <td className="px-4 py-2">{client.client_phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No clients found.
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Add New Client
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { name: "client_name", label: "Name" },
                { name: "currency", label: "Currency" },
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
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-[#252945] dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
      )}
    </div>
  );
}
