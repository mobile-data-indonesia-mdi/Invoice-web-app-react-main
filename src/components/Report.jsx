import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatCurrency } from "../functions/formatCurrency";
import Sidebar from "./Sidebar";

function Report() {
  const allInvoices = useSelector((state) => state.invoices.allInvoice || []);
  const [expandedClient, setExpandedClient] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("report");

  const piutangData = allInvoices
    .filter((inv) => inv.status === "pending" || inv.status === "unpaid")
    .reduce((acc, curr) => {
      const client = curr.clientName || "Unknown";
      const currency = curr.currency || "IDR";
      const total = (curr.items || []).reduce((sum, item) => {
        const price = parseFloat(item.price) || 0; // Pastikan nilai price valid
        const usage = parseFloat(item.usage) || 0; // Pastikan nilai usage valid
        return sum + price * usage;
      }, 0);

      const key = `${client}___${currency}`;
      if (!acc[key]) acc[key] = { total: 0, invoices: [], currency };

      acc[key].total += total;
      acc[key].invoices.push(curr);
      return acc;
    }, {});

  const toggleClient = (key) => {
    setExpandedClient((prev) => (prev === key ? null : key));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />

      {/* Main Content */}
      <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 shadow-md mt-6 w-full pt-16"> {/* Tambahkan pt-16 */}
        <h2 className="text-2xl font-semibold dark:text-white mb-4">Laporan Piutang</h2>
        {Object.keys(piutangData).length > 0 ? (
          <ul className="space-y-4">
            {Object.entries(piutangData).map(([key, data]) => {
              const [client, currency] = key.split("___");
              const formattedTotal = formatCurrency(data.total, currency);

              return (
                <li key={key} className="border-b pb-3">
                  <div
                    onClick={() => toggleClient(key)}
                    className="cursor-pointer flex justify-between items-center text-gray-800 dark:text-gray-200"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-lg">{client}</span>
                      <span className="text-xs text-gray-500">
                        Mata Uang: {currency === "USD" ? "Dollar (USD)" : "Rupiah (IDR)"}
                      </span>
                    </div>
                    <span className="font-bold text-lg">{formattedTotal}</span>
                  </div>

                  {expandedClient === key && (
                    <ul className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-5 ml-4">
                      {data.invoices.map((inv) => {
                        const formattedDate = inv.createdAt
                          ? new Date(inv.createdAt).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })
                          : "Tanggal tidak diketahui";

                        const formattedInvTotal = formatCurrency(inv.total, currency);

                        return (
                          <li
                            key={inv.id}
                            className="border-l-2 border-[#7c5dfa] pl-4 py-2 bg-gray-50 dark:bg-[#252945] rounded-md"
                          >
                            <div className="flex justify-between">
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold text-sm">{inv.id}</span>
                                <span className="text-xs text-gray-500">{formattedDate}</span>
                                
                              </div>
                              <span className="font-semibold text-sm whitespace-nowrap">
                                {formattedInvTotal}
                              </span>
                            </div>

                            {/* Tabel item */}
                            {Array.isArray(inv.items) && inv.items.length > 0 && (
                              <div className="mt-2 overflow-x-auto">
                                <table className="w-full text-xs border border-gray-300 dark:border-gray-600 mt-2">
                                  <thead className="bg-gray-100 dark:bg-[#1f2937] text-gray-700 dark:text-gray-200">
                                    <tr>
                                      <th className="px-2 py-1 text-left">Item</th>
                                      <th className="px-2 py-1 text-center">Usage</th>
                                      <th className="px-2 py-1 text-right">Harga</th>
                                      <th className="px-2 py-1 text-right">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {inv.items.map((item, idx) => {
                                      const price = formatCurrency(item.price ?? 0, currency);
                                      const subtotalValue = (item.price ?? 0) * (item.usage ?? 0);
                                      const subtotal = formatCurrency(subtotalValue, currency);

                                      return (
                                        <tr key={idx} className="border-t dark:border-gray-600">
                                          <td className="px-2 py-1">{item.name}</td>
                                          <td className="px-2 py-1 text-center">{item.usage}</td>
                                          <td className="px-2 py-1 text-right">{price}</td>
                                          <td className="px-2 py-1 text-right">{subtotal}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Tidak ada piutang klien saat ini.</p>
        )}
      </div>
    </div>
  );
}

export default Report;
