require("dotenv").config();
const express = require("express");
const cors = require("cors");
const UserRoute = require("../routes/user_route");
const {auth_middleware} = require("../middleware/authmiddleware");

const app = express();

app.use(express.json());
app.use(cors());
app.use(auth_middleware);
app.use("/api/user", UserRoute);


module.exports = app

