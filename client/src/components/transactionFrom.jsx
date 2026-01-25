import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../utils/constants";

const TransactionForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    type: "",
    categoryId: "",
    amount: "",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const [loading, setLoading] = useState(false);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseUrl}/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch {
        toast.error("Failed to load categories");
      }
    };

    if (token) fetchCategories();
  }, [token]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      return toast.error("Category name required");
    }

    try {
      setAddingCategory(true);

      await axios.post(
        `${baseUrl}/category`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Category added");
      setNewCategory("");
      getCategory();
    } catch {
      toast.error("Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  };

  // FETCH TRANSACTION (EDIT MODE)
  useEffect(() => {
    if (!id || id === "undefined" || id.includes("$")) {
      console.log("Invalid ID:", id);
      return;
    }

    const fetchTransaction = async () => {
      const res = await axios.get(`${baseUrl}/transaction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        name: res.data.name,
        type: res.data.type,
        categoryId: String(res.data.categoryId),
        amount: String(res.data.amount),
        description: res.data.description,
      });
    };

    fetchTransaction();
  }, [id]);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, type, categoryId, amount, description } = form;

    if (!name || !type || !categoryId || !amount || !description) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      if (isEdit) {
        await axios.put(
          `${baseUrl}/transaction/${id}`,
          { ...form, categoryId: Number(categoryId), amount: Number(amount) },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Transaction updated");
      } else {
        await axios.post(
          `${baseUrl}/transaction`,
          { ...form, categoryId: Number(categoryId), amount: Number(amount) },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        toast.success("Transaction added");
      }

      navigate("/transactionsview");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {isEdit ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <input
          placeholder="Transaction name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          className="w-full border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Select Type</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>

        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            disabled={addingCategory}
            className="bg-blue-600 text-white px-4 rounded"
          >
            {addingCategory ? "Adding..." : "Add"}
          </button>
        </div>

        <input
          type="number"
          placeholder="Amount"
          className="w-full border p-2 rounded"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading
            ? "Saving..."
            : isEdit
              ? "Update Transaction"
              : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
