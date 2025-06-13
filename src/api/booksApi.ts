import type { Book } from "../types/book";

export const API_BASE =
  "https://crudcrud.com/api/4a3826cd54ec464ab8bee9c4f9758971/books";

// SWR fetcher
export const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Network error");
    return res.json();
  });

// Add a new book
export async function addBook(book: Omit<Book, "_id">): Promise<Book> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
}

// Update a book by ID
export async function updateBook(
  id: string,
  book: Omit<Book, "_id">
): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to update book");
}

// Delete a book by ID
export async function deleteBook(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete book");
}
