import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/constants";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // USER
        const userRes = await fetch(`${baseUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          localStorage.removeItem("token");
          navigate("/dashboard");
          return;
        }

        const userData = await userRes.json();
        setUser(userData);

        // TRANSACTIONS
        const txRes = await fetch(`${baseUrl}/transaction`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const txData = await txRes.json();
        const latestFive = Array.isArray(txData) ? txData.slice(0, 5) : [];
        setTransactions(latestFive);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* TOTALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-sm text-red-600 font-medium">Total Debit</p>
          <h3 className="text-2xl font-bold text-red-700">₹ {totalDebit}</h3>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-sm text-green-600 font-medium">Total Credit</p>
          <h3 className="text-2xl font-bold text-green-700">₹ {totalCredit}</h3>
        </div>
      </div>

      {/* WELCOME */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 shadow-xl text-center">
        <h2 className="text-3xl font-bold">Welcome, {user?.name}</h2>
        <p className="text-white/80 mt-1 text-lg">
          Here are your latest transactions
        </p>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white mt-8 shadow-lg rounded-2xl p-6 border">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>

        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-5">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.type}</td>
                  <td>₹{t.amount}</td>
                  <td>{t.description || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-10 flex justify-between">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-full"
          onClick={() => navigate("/transactionsView")}
        >
          View All Transactions
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-full"
          onClick={() => navigate("/transactionsForm")}
        >
          Transactions Form
        </button>
      </div>
    </div>
  );
};

export default Dashboard;