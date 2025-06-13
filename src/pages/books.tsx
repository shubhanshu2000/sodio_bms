import useSWR, { mutate } from "swr";
import { useState } from "react";
import { useNavigate } from "react-router";
import { fetcher, deleteBook, API_BASE } from "../api/booksApi";
import toast from "react-hot-toast";
import { TableLoader } from "../components/loader";
import type { Book } from "../types/book";

const PAGE_SIZE = 10;

const Books = () => {
  const { data, error, isLoading } = useSWR<Book[]>(API_BASE, fetcher);
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    status: "",
    page: 1,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter and search
  const filtered = (data || []).filter((b) => {
    const { search, genre, status } = filters;
    return (
      (!search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())) &&
      (!genre || b.genre === genre) &&
      (!status || b.status === status)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (filters.page - 1) * PAGE_SIZE,
    filters.page * PAGE_SIZE
  );

  const genres = Array.from(new Set((data || []).map((b) => b.genre)));

  const setFilter = (key: keyof typeof filters, value: string | number) => {
    setFilters((f) => ({
      ...f,
      [key]: key === "page" ? Number(value) : value,
      page: key === "page" ? Number(value) : 1,
    }));
  };

  // Delete handler with confirmation
  const handleDelete = (id: string) => setDeletingId(id);

  const confirmDelete = async () => {
    if (!deletingId) return;
    toast.promise(
      deleteBook(deletingId).then(() => {
        mutate(API_BASE);
        setDeletingId(null);
      }),
      {
        loading: "Deleting...",
        success: "Book deleted!",
        error: "Failed to delete book",
      }
    );
  };

  if (error)
    return (
      <div className="text-red-500 text-center font-bold text-2xl mt-10">
        Failed to load books.
      </div>
    );

  return (
    <div className="p-2 sm:p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-2 sm:p-6">
        {/* Responsive filter/search bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 mb-6">
          <input
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-60"
            placeholder="Search by title or author"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
          <select
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-48"
            value={filters.genre}
            onChange={(e) => setFilter("genre", e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-48"
            value={filters.status}
            onChange={(e) => setFilter("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Issued">Issued</option>
          </select>
        </div>
        {isLoading ? (
          <div>
            <TableLoader />
          </div>
        ) : (
          <>
            {/* Responsive table wrapper */}
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full border shadow rounded-lg bg-white">
                <thead>
                  <tr>
                    <th className="border px-2 py-2 bg-blue-100">Title</th>
                    <th className="border px-2 py-2 bg-blue-100">Author</th>
                    <th className="border px-2 py-2 bg-blue-100">Genre</th>
                    <th className="border px-2 py-2 bg-blue-100">
                      Published Year
                    </th>
                    <th className="border px-2 py-2 bg-blue-100">Status</th>
                    <th className="border px-2 py-2 bg-blue-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((b) => (
                    <tr key={b._id} className="hover:bg-blue-50 transition">
                      <td className="border px-2 py-2">{b.title}</td>
                      <td className="border px-2 py-2">{b.author}</td>
                      <td className="border px-2 py-2">{b.genre}</td>
                      <td className="border px-2 py-2">{b.publishedYear}</td>
                      <td className="border px-2 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            b.status === "Available"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="border px-2 py-2 flex gap-2 flex-wrap">
                        <button
                          className="text-blue-600 hover:text-blue-900 underline"
                          onClick={() => navigate(`/book/add-edit/${b._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 underline"
                          onClick={() => handleDelete(b._id!)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No books found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row gap-2 mt-6 justify-center items-center">
              <button
                className="px-4 py-2 border rounded bg-blue-100 hover:bg-blue-200 transition w-full sm:w-auto"
                disabled={filters.page === 1}
                onClick={() => setFilter("page", filters.page - 1)}
              >
                Prev
              </button>
              <span className="px-4 py-2">
                Page {filters.page} of {totalPages || 1}
              </span>
              <button
                className="px-4 py-2 border rounded bg-blue-100 hover:bg-blue-200 transition w-full sm:w-auto"
                disabled={filters.page === totalPages || totalPages === 0}
                onClick={() => setFilter("page", filters.page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
        {/* Confirmation Popup */}
        {deletingId && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backdropFilter: "blur(4px)",
              background: "rgba(255,255,255,0.2)",
            }}
          >
            <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center border">
              <p className="mb-6 text-lg font-semibold text-gray-700">
                Are you sure you want to delete this book?
              </p>
              <div className="flex gap-6 flex-col sm:flex-row">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded transition"
                  onClick={() => setDeletingId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
