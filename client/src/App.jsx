import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/navbar.jsx";
import Auth from "./components/Auth.jsx";
import Dashboard from "./components/dashboard.jsx";
import TransactionForm from "./components/transactionFrom.jsx";
import ViewTransaction from "./components/viewTransaction.jsx";
import ForgotPassword from "./components/forgotPassword.jsx";
import ResetPassword from "./components/resetPassword.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= Protected Route ================= */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

/* ================= App ================= */
const App = () => {
  const [isAuth, setAuth] = React.useState(
    !!localStorage.getItem("token")
  );

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        pauseOnHover
        closeOnClick
        theme="light"
      />

      {isAuth && <Navbar setAuth={setAuth} />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Auth setAuth={setAuth} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactionsView"
          element={
            <ProtectedRoute>
              <ViewTransaction />
            </ProtectedRoute>
          }
        />

        {/* ADD */}
        <Route
          path="/transactionsForm"
          element={
            <ProtectedRoute>
              <TransactionForm />
            </ProtectedRoute>
          }
        />

        {/* EDIT */}
        <Route
          path="/transactionsForm/:id"
          element={
            <ProtectedRoute>
              <TransactionForm />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-3xl">
              404 Not Found
            </h1>
          }
        />
      </Routes>
    </>
  );
};

export default App;
