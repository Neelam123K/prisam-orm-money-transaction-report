// ResetPassword.jsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const resetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/user/reset-password",
        { token, newPassword }
      );

      setMessage(res.data.message);
      setNewPassword("");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Reset your password
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          Enter a new password for your account
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-green-600 text-center">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default resetPassword;