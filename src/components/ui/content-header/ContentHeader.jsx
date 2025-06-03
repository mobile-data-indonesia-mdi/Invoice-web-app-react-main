import React from "react";
import plus from "@/assets/plus.png";
import FilterStatusDropdown from "./FilterStatusDropdown.jsx";

import useAuth from "@/hooks/useAuth.js";

export default function ContentHeader({selectedMenu, items, onOpenCreateMenu}) {
  const auth = useAuth(); //Untuk security create invoce dan payment

  return(
    <div className="min-w-full max-h-[64px] flex items-center justify-between">
      <div>
        <h1 className="lg:text-4xl md:text-2xl text-xl dark:text-white tracking-wide font-semibold">
          {selectedMenu === "invoices" ? "Invoices"
          : selectedMenu === "payments" ? "Payments"
          : selectedMenu === "report" ? "Report"
          : selectedMenu === "clients" ? "Clients"
          : ""}
        </h1>
        <p className="text-gray-500 font-light">
          {items === null || items.length === 0 ? 0 : items.length}
          {selectedMenu === "invoices" ? ' total invoices'
            : selectedMenu === "payments" ? ' total payments'
            : selectedMenu === "clients" ? ' total clients'
            : selectedMenu === "report" ? ' total report'
            : ''}
        </p>
      </div>
      <div className="flex max-h-full items-center">
        {(selectedMenu === 'invoices' || selectedMenu === 'payments') && (
          <FilterStatusDropdown
            selectedMenu={selectedMenu}
            filter={
              selectedMenu === 'invoices'
                ? ["paid", "unpaid", "partial", "void"]
                : ["void", "not-void"]
            }
          />
        )}
        
        {auth.user.role === "finance" && (
          <button
            onClick={() => selectedMenu !== 'clients' ? onOpenCreateMenu(true) : onOpenCreateMenu({status: true, type: "create"})}
            className="hover:opacity-80 ml-4 md:ml-10 flex items-center py-2 px-2 md:space-x-3 space-x-2 bg-[#7c5dfa] rounded-full"
          >
            <img src={plus} alt="" />
            <p className="md:block hidden text-white font-semibold text-lg">
              {selectedMenu === "invoices" ? "New Invoice"
                : selectedMenu === "payments" ? "New Payment"
                : selectedMenu === "clients" ? "New Client"
                : ""}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}