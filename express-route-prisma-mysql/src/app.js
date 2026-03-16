require("dotenv").config();
const express = require("express");
const cors = require("cors");
const UserRoute = require("../routes/user_route");
const {auth_middleware} = require("../middleware/authmiddleware");

const app = express();

app.use(express.json());
app.use(cors({
    origin: [
    "http://localhost:5173",
    "https://prisam-orm-money-transaction-report-5mx0.onrender.com"
  ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
}));
app.use(auth_middleware);
app.use("/api/user", UserRoute);


module.exports = app

