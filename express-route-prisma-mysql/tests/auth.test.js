const request = require("supertest");
const app = require("../src/app");
const prisma = require("../prisma/client");

describe("Auth API", () => {

  let token;

  const testUser = {
    name: "Test User",
    email: "testuser@test.com",
    password: "123456",
  };

  // Clean DB before tests
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  //REGISTER 

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.password).toBeUndefined();
  });

  it("should not register duplicate email", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send(testUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Email already exists");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({
        email: "abc@test.com",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  //LOGIN

  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe("string");

    token = res.body.token; 
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should fail login with wrong email", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: "wrong@test.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email or password and Invalid user");
  });

  // ME 

  it("should return logged-in user data", async () => {
    const res = await request(app)
      .get("/api/user/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });

});
