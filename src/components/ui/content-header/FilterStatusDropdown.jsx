import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {motion} from "framer-motion";

import arrowDown from "@/assets/icon-arrow-down.svg";

import invoiceSlice from "@/redux/invoiceSlice.js";
import paymentSlice from "@/redux/paymentSlice.js";

export default function FilterStatusDropdown({selectedMenu, filter}) {
  const dispatch = useDispatch();

  const [filterValue, setFilterValue] = useState("");
  const [isDropdown, setIsDropdown] = useState(false);

  useEffect(() => {
    if (selectedMenu === "invoices") {
      dispatch(invoiceSlice.actions.filterInvoice({ status: filterValue }));
    } else if (selectedMenu === "payments") {
      dispatch(paymentSlice.actions.filterPayment({ status: filterValue }));
    }
  }, [filterValue, dispatch])

  return(
    <div className="relative flex items-center">
      <p className="hidden md:block dark:text-white font-medium">
        Filter by status
      </p>
      <div
        onClick={() => setIsDropdown((state) => !state)}
        className="cursor-pointer ml-3 flex items-center"
      >
        <motion.img
          src={arrowDown}
          animate={isDropdown ? { rotate: -180 } : { rotate: 0 }}
        />
      </div>
      {isDropdown && (
        <motion.div
          className="absolute w-40 bg-white dark:bg-[#1E2139] dark:text-white flex px-6 py-4 flex-col top-10 shadow-2xl rounded-xl space-y-2 z-50"
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
    </div>
  )
}