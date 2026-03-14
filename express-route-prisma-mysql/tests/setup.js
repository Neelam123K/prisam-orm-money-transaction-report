require("dotenv").config({
  path: ".env.test",
});

console.log("TEST DB:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL.includes("test")) {
  throw new Error("❌ Tests are running on NON-test database");
}
