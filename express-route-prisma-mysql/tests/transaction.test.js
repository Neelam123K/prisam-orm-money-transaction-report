const request = require("supertest");
const app = require("../src/app");
const prisma = require("../prisma/client");

describe("Category & Transaction API", () => {

  let token;
  let categoryId;
  let transactionId;

  const testUser = {
    name: "Test User",
    email: "testuser@test.com",
    password: "123456",
  };

  const testCategory = {
    name: "Food",
  };

  beforeAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    await request(app)
      .post("/api/user/register")
      .send(testUser);

    const loginRes = await request(app)
      .post("/api/user/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // CATEGORY 

  it("should create a new category", async () => {
    const res = await request(app)
      .post("/api/user/category")
      .set("Authorization", `Bearer ${token}`)
      .send(testCategory);
    categoryId = res.body.id;
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Food");
  });

  it("should not create duplicate category", async () => {
    const res = await request(app)
      .post("/api/user/category")
      .set("Authorization", `Bearer ${token}`)
      .send(testCategory);

    expect(res.statusCode).toBe(400);
  });

  it("should get all categories", async () => {
    const res = await request(app)
      .get("/api/user/category")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // TRANSACTION 

  it("should create a transaction", async () => {
    const res = await request(app)
      .post("/api/user/transaction")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Lunch",
        type: "debit",
        categoryId: categoryId,
        amount: 200,
        description: "Lunch payment",
      });
    transactionId = res.body.transaction.id;
    expect(res.statusCode).toBe(201);
    expect(res.body.transaction.name).toBe("Lunch");
  });

  it("should get all transactions", async () => {
    const res = await request(app)
      .get("/api/user/transaction")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a transaction", async () => {
    const res = await request(app)
      .put(`/api/user/transaction/${transactionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Dinner",
        type: "debit",
        categoryId: categoryId,
        amount: 300,
        description: "Dinner payment",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Dinner");
    expect(Number(res.body.data.amount)).toBe(300);
  });

  it("shoult delete a transaction", async () => {
    const res = await request(app)
    
  })

});
