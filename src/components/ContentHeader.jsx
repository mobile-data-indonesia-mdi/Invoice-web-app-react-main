import React, { useEffect, useState } from "react";
import {motion} from "framer-motion";

import arrowDown from "../assets/icon-arrow-down.svg";
import plus from "../assets/plus.png";

import useAuth from "../hooks/useAuth.js";

export default function ContentHeader({selectedMenu, items, filterValue, setFilterValue, onOpenCreateMenu}) {
  const filter = ["paid", "unpaid", "partial", "void"];
  const auth = useAuth(); //Untuk security create invoce dan payment

  // State Hooks
  const [isDropdown, setIsDropdown] = useState(false);

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
          {items.length}
          {selectedMenu === "invoices" ? ' total invoices'
          : selectedMenu === "payments" ? ' total payments' : ''}
        </p>
      </div>
      <div className="flex max-h-full items-center">
        <div className="flex items-center">
          <p className="hidden md:block dark:text-white font-medium">
            Filter by status
          </p>
          <p className="md:hidden dark:text-white font-medium">
            Filter
          </p>
          <div
            onClick={() => setIsDropdown((state) => !state)}
            className="cursor-pointer ml-3"
          >
            <motion.img
              src={arrowDown}
              animate={isDropdown ? { rotate: -180 } : { rotate: 0 }}
            />
          </div>
        </div>
        {isDropdown && (
          <motion.div
            as="select"
            className="w-40 bg-white dark:bg-[#1E2139] dark:text-white flex px-6 py-4 flex-col top-[160px] lg:top-[148px] absolute shadow-2xl rounded-xl space-y-2"
          >
            {filter.map((item, i) => (
              <div
                key={i}
                onClick={() => setFilterValue(item === filterValue ? "" : item)}
                className="items-center cursor-pointer flex space-x-2"
              >
                <input
                  value={item}
                  checked={filterValue === item}
                  type="checkbox"
                  className="accent-[#7c5dfa] hover:accent-[#7c5dfa]"
                />
                <p>{item}</p>
              </div>
            ))}
          </motion.div>
        )}
        {auth.user.role === "finance" && (
          <button
            onClick={() => onOpenCreateMenu(true)}
            className="hover:opacity-80 ml-4 md:ml-10 flex items-center py-2 px-2 md:space-x-3 space-x-2 bg-[#7c5dfa] rounded-full"
          >
            <img src={plus} alt="" />
            <p className="md:block hidden text-white font-semibold text-lg">
              {selectedMenu === "invoices" ? "New Invoice"
                : selectedMenu === "invoices" ? "New Payment"
                  : ""}
            </p>
            <p className="md:hidden block text-white font-semibold text-base">
              New
            </p>
          </button>
        )}
      </div>
    </div>
  );
}