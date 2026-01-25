import { Link, useNavigate } from "react-router-dom";

const navbar = ({ setAuth }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/");
  };

  return (
    <nav className="h-14 bg-purple-700 text-white flex items-center justify-between px-6 shadow-md">
      
      {/* LEFT */}
      <Link
        to="/dashboard"
        className="text-lg font-semibold tracking-wide"
      >
        Money Transaction Report
      </Link>

      {/* RIGHT */}
      <div className="flex gap-6 items-center">
        <Link
          to="/transactionsForm"
          className="hover:text-purple-200 transition"
        >
          Transaction Form
        </Link>

        <Link
          to="/transactionsView"
          className="hover:text-purple-200 transition"
        >
          View All Transactions
        </Link>

        <button
          onClick={logoutHandler}
          className="bg-white text-purple-700 px-4 py-1 rounded-full text-sm font-medium hover:bg-purple-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default navbar;
