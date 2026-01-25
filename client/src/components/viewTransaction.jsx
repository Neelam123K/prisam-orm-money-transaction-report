import React, { useEffect, useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { baseUrl } from "../utils/constants";

const ViewTransaction = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // FETCH TRANSACTIONS 
  const fetchTransactions = async (pageNo = 1) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${baseUrl}/gettransaction?page=${pageNo}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();

      setTransactions(result?.data || []);
      setPage(result?.pagination?.page || 1);
      setTotalPages(result?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  // FILTER
  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      const text = `${t?.name ?? ""} ${t?.description ?? ""}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      const matchType = typeFilter === "all" || t.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [transactions, search, typeFilter]);

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
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // EDIT 
  const handleEdit = (id) => {
    navigate(`/transactionsForm/${id}`);
  };

  // DOWNLOAD PDF 
  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text(`Transaction Report (Page ${page})`, 14, 10);

      const rows = filteredData.map((t, index) => [
        index + 1,
        t.name,
        t.type,
        t.category?.name || "-",
        t.amount,
        t.description || "-",
      ]);

      autoTable(doc, {
        head: [["#", "Name", "Type", "Category", "Amount", "Description"]],
        body: rows,
        startY: 20,
      });

      doc.save(`transactions_page_${page}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("PDF generation failed");
    }
  };

  // LOADING
  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading transactions...
      </p>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6">Transactions</h1>

        {/* FILTERS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            className="border p-3 rounded"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-3 rounded"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>

          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>

        {/* LIST */}
        {filteredData.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found</p>
        ) : (
          <div className="space-y-4">
            {filteredData.map((t) => (
              <div
                key={t.id}
                className="border p-4 rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{t.name}</h3>
                  <span
                    className={
                      t.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {t.type}
                  </span>
                </div>

                <p className="font-bold mt-1">₹ {t.amount}</p>
                <p className="text-sm text-gray-500">
                  {t.description || "No description"}
                </p>

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => handleEdit(t.id)}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="flex items-center gap-2 text-red-600"
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
  );
};

export default ViewTransaction;