import React from "react";

const Table = ({ columns, data, onSort, sortBy, order }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                onClick={() => col.sortable && onSort(col.key)}
                className={`px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${col.sortable ? "cursor-pointer hover:bg-gray-200 transition-colors" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span className="text-indigo-500 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-md">
                      {order === "ASC" ? "↑" : "↓"}
                    </span>
                  )}
                  {col.sortable && sortBy !== col.key && (
                    <span className="text-gray-300">↕</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500 font-medium"
              >
                No matching records found.
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50/50 transition-colors duration-150"
              >
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
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
