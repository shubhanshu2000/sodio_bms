// Table Loader
export const TableLoader = () => {
  const columns = [
    "Title",
    "Author",
    "Genre",
    "Published Year",
    "Status",
    "Actions",
  ];
  const rows = 10;

  return (
    <table className="w-full border shadow rounded-lg animate-pulse bg-white">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="border px-2 py-1 bg-gray-100"></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {columns.map((_, j) => (
              <td key={j} className="border px-2 py-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Add/Edit Form Loader
export const AddEditLoader = () => (
  <form className="flex flex-col w-full max-w-lg gap-y-6 mx-auto mt-24 animate-pulse bg-white p-8 rounded-lg shadow">
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
    <div className="h-10 bg-gray-300 rounded w-1/3 self-end"></div>
  </form>
);
