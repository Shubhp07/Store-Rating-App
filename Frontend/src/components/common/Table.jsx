import React from "react";

const Table = ({ columns, data, onSort, sortBy, order }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 transition-colors duration-200">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                onClick={() => col.sortable && onSort(col.key)}
                className={`px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.sortable ? "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span className="text-indigo-500 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-md">
                      {order === "ASC" ? "↑" : "↓"}
                    </span>
                  )}
                  {col.sortable && sortBy !== col.key && (
                    <span className="text-gray-300 dark:text-gray-600">↕</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 transition-colors duration-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 font-medium"
              >
                No matching records found.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
