import { Link, useLocation } from "react-router";

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-700 to-blue-400 shadow-lg text-white">
      <h1 className="text-2xl font-extrabold tracking-wide drop-shadow">
        Book Management
      </h1>
      <div className="flex gap-6">
        <Link
          to="/"
          className={`transition-all px-3 py-1 rounded hover:bg-blue-800/60 ${
            location.pathname === "/"
              ? "bg-blue-900/70 font-bold underline"
              : ""
          }`}
        >
          Books
        </Link>
        <Link
          to="/book/add-edit"
          className={`transition-all px-3 py-1 rounded hover:bg-blue-800/60 ${
            location.pathname === "/book/add-edit"
              ? "bg-blue-900/70 font-bold underline"
              : ""
          }`}
        >
          Add Book
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
