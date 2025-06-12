export type BookStatus = "Available" | "Issued";

export type Book = {
  _id?: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: BookStatus;
};

export type BookFormInputs = {
  title: string;
  author: string;
  genre: string;
  published_year: number | "";
  status: "" | BookStatus;
};
