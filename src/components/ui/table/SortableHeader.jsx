import React from "react";

import {FaSort, FaSortDown, FaSortUp} from "react-icons/fa";

const SortableHeader = (label, column, align = 'center') => {
  const isSorted = column.getIsSorted();
  const justifyMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      onClick={() => column.toggleSorting()}
      className={`flex cursor-pointer items-center ${justifyMap[align]} ${
        isSorted ? "text-indigo-500 dark:text-indigo-400" : "text-gray-700 dark:text-white"
      }`}
    >
      {label}
      {isSorted === "asc" && <FaSortUp className="ml-1" />}
      {isSorted === "desc" && <FaSortDown className="ml-1" />}
      {!isSorted && <FaSort className="ml-1" />}
    </div>
  );
};


export default SortableHeader;