import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import NavBar from "./components/navBar";
import Books from "./pages/books";
import { Toaster } from "react-hot-toast";

const AddEditBook = lazy(() => import("./pages/add_edit_book"));

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <NavBar />
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/book/add-edit/:id?" element={<AddEditBook />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
