import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { baseUrl } from "../utils/constants";


const ViewTransaction = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // DATA STATE
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // FILTERS
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(10000000);

  // FETCH TRANSACTIONS (SERVER SIDE)
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit,
        search: debouncedSearch,
        type: typeFilter,
        minAmount,
        maxAmount,
      });

      const res = await fetch(
        `${baseUrl}/gettransaction?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();

      setTransactions(result?.data || []);
      setPage(result?.pagination?.page || 1);
      setTotalPages(result?.pagination?.totalPages || 1);
      setTotalCount(result?.pagination?.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // INITIAL + FILTER CHANGE
  useEffect(() => {
    fetchTransactions();
  }, [page, debouncedSearch, limit, typeFilter, minAmount, maxAmount]);

  // DEBOUNCE SEARCH
  useEffect(() => {
  const timer = setTimeout(() => {
    if (search.length >= 2) {
      setDebouncedSearch(search.trim());
    } else {
      setDebouncedSearch("");
    }
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

  const handleSearch = () => {
    setPage(1);
    fetchTransactions(1, debouncedSearch);
  }

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await fetch(`${baseUrl}/transaction/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transaction deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // EDIT
  const handleEdit = (id) => {
    navigate(`/transactionsForm/${id}`);
  };

  // PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 10);

    const rows = transactions.map((t, i) => [
      i + 1,
      t.name,
      t.type,
      t.category?.name || "-",
      t.amount,
      t.description || "-",
    ]);

    autoTable(doc, {
      head: [["S.No", "Name", "Type", "Category", "Amount", "Description"]],
      body: rows,
      startY: 20,
    });

    doc.save("transactions.pdf");
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

    {/* 🔹 LEFT SIDEBAR */}
    <div className="md:col-span-1 bg-white p-5 rounded-xl shadow space-y-6">

      <h2 className="text-lg font-semibold">Filters</h2>

      {/* SEARCH */}
      <div className="flex gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="border px-3 rounded bg-gray-100"
        >
          <CiSearch />
        </button>
      </div>

      {/* TYPE */}
      <select
        className="border p-2 rounded w-full"
        value={typeFilter}
        onChange={(e) => {
          setTypeFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="all">All Types</option>
        <option value="credit">Credit</option>
        <option value="debit">Debit</option>
      </select>

      {/* AMOUNT RANGE */}
      <div className="space-y-3">
        <div>
          <label className="text-sm">Min Amount: ₹{minAmount}</label>
          <input
            type="range"
            min={0}
            max={100000}
            step={100}
            value={minAmount}
            onChange={(e) => setMinAmount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm">Max Amount: ₹{maxAmount}</label>
          <input
            type="range"
            min={0}
            max={100000}
            step={100}
            value={maxAmount}
            onChange={(e) => setMaxAmount(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* PAGE SIZE */}
      <select
        className="border p-2 rounded w-full"
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      >
        <option value={5}>5 per page</option>
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
      </select>

      {/* DOWNLOAD */}
      <button
        onClick={downloadPDF}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Download PDF
      </button>
    </div>

    {/* 🔹 RIGHT CONTENT */}
    <div className="md:col-span-3 bg-white p-6 rounded-xl shadow">

      <div className="mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-sm text-gray-500">
          Showing {transactions.length} of {totalCount} transactions
        </p>
      </div>

      {/* LIST */}
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="border p-4 rounded-lg bg-gray-50 hover:shadow transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{t.name}</h3>
                <span
                  className={`text-sm font-medium ${
                    t.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.type}
                </span>
              </div>

              <p className="text-lg font-bold mt-1">₹ {t.amount}</p>
              <p className="text-sm text-gray-500">
                {t.description || "No description"}
              </p>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => handleEdit(t.id)}
                  className="text-blue-600 flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600 flex items-center gap-1"
                >
                  <MdDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page <b>{page}</b> of <b>{totalPages}</b>
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default ViewTransaction;