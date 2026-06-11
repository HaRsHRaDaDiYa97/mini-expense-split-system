import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../index.js";

afterAll(async () => {
  // Close the server and disconnect mongoose to clean up resources
  await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
});

describe("Auth API Validations", () => {
  it("should fail register if fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({});
    
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("should fail register if email is invalid", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "invalid-email-format",
        password: "123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should fail login if password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("Group & Expense Security Check", () => {
  it("should block group retrieval when unauthorized", async () => {
    const res = await request(app)
      .get("/api/groups");
    
    expect(res.statusCode).toBe(401);
  });

  it("should block expense additions when unauthorized", async () => {
    const res = await request(app)
      .post("/api/groups/somegroupid/expenses")
      .send({
        amount: 100,
        description: "Lunch",
        splitType: "equal",
      });
    
    expect(res.statusCode).toBe(401);
  });
});
