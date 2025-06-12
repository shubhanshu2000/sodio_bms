import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { addBook, updateBook, fetcher, API_BASE } from "../api/booksApi";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import { AddEditLoader } from "../components/loader";
import type { BookFormInputs, BookStatus } from "../types/book";

const AddEditBooks = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<BookFormInputs>();

  // Fetch book for edit mode
  const { data, isLoading } = useSWR(id ? `${API_BASE}/${id}` : null, fetcher);

  useEffect(() => {
    if (data && id) {
      reset({
        title: data.title,
        author: data.author,
        genre: data.genre,
        published_year: data.publishedYear,
        status: data.status,
      });
    }
  }, [data, id, reset]);

  useEffect(() => {
    if (!id) {
      reset({
        title: "",
        author: "",
        genre: "",
        published_year: "",
        status: "",
      });
    }
  }, [id, reset]);

  const onSubmit = async (formData: BookFormInputs) => {
    setSubmitting(true);
    // Only send correct types to API
    const payload = {
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      publishedYear: Number(formData.published_year),
      status: formData.status as BookStatus,
    };
    try {
      if (id) {
        await updateBook(id, payload);
        toast.success("Book updated!");
      } else {
        await addBook(payload);
        toast.success("Book added!");
        reset();
      }
      mutate(API_BASE); // revalidate books list
      navigate("/");
    } catch (err) {
      toast.error("Something went wrong!");
      setFetchError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div>
        <AddEditLoader />
      </div>
    );
  if (fetchError) return <div className="text-red-500">{fetchError}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <form
        className="flex flex-col w-full max-w-lg gap-y-6 bg-white p-10 rounded-xl shadow-lg border"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
          {id ? "Edit Book" : "Add Book"}
        </h2>
        <label className="font-semibold text-gray-700">
          Title
          <input
            className="mt-1 border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter Book Title"
          />
        </label>
        <label className="font-semibold text-gray-700">
          Author
          <input
            className="mt-1 border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="text"
            {...register("author", { required: true })}
            placeholder="Enter Author"
          />
        </label>
        <label className="font-semibold text-gray-700">
          Genre
          <input
            className="mt-1 border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="text"
            {...register("genre", { required: true })}
            placeholder="Enter Genre"
          />
        </label>
        <label className="font-semibold text-gray-700">
          Published Year
          <input
            className="mt-1 border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="number"
            {...register("published_year", { required: true })}
            placeholder="Enter Published Year"
          />
        </label>
        <label className="font-semibold text-gray-700">
          Status
          <select
            className="mt-1 border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            {...register("status", { required: true })}
            defaultValue=""
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Available">Available</option>
            <option value="Issued">Issued</option>
          </select>
        </label>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition mt-4"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : id ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddEditBooks;
