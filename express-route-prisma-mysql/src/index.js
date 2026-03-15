const app = require("./app");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.listen(3000, () => {
  console.log(`
🚀 Server ready at: https://prisam-orm-money-transaction-report.onrender.com
⭐️ See sample requests: http://pris.ly/e/js/rest-express#3-using-the-rest-api
`);
});
