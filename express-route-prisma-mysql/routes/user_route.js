const router = require("express").Router();
const { check} = require("../middleware/authmiddleware")
const {
  register,
  login,
  me
} = require("../controllers/user_controller");
const {
  category,
createTransaction,
  transactions,
  gettransaction,
  allCategory,

  updateTransaction,
  getTransactionById,
  deleteTransaction
} = require("../controllers/user_transaction");

const{ forgotPassword, resetPassword} = require("../controllers/user_password")
// Auth
router.post("/register", register);
router.post("/login", login);
router.get("/me", me);
// Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
// category
router.post("/category", check, category);
router.get("/category", check,allCategory);
// transaction
router.post("/transaction", check, createTransaction)
router.get("/transaction", check, transactions)
router.get("/gettransaction",check, gettransaction)

router.put("/transaction/:id",check, updateTransaction)
router.get("/transaction/:id", check, getTransactionById);
router.delete("/transaction/:id", check, deleteTransaction)

module.exports = router;
