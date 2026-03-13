import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { createHttpTestClient } from "../../helpers/http.js";

const validateRequest = jest.fn(() => (req, res, next) => next());
const register = jest.fn((req, res) => res.status(201).json({ ok: "register" }));
const login = jest.fn((req, res) => res.status(200).json({ ok: "login" }));
const logout = jest.fn((req, res) => res.status(200).json({ ok: "logout" }));
const forgotPassword = jest.fn((req, res) => res.status(200).json({ ok: "forgot" }));
const resetPassword = jest.fn((req, res) => res.status(200).json({ ok: "reset" }));
const sendEmailVerification = jest.fn((req, res) => res.status(200).json({ ok: "send-verify" }));
const verifyEmail = jest.fn((req, res) => res.status(200).json({ ok: "verify-email" }));

jest.unstable_mockModule("../../../src/middlewares/validateRequest.js", () => ({
  validateRequest,
}));

jest.unstable_mockModule("../../../src/controllers/auth.controller.js", () => ({
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
}));

const { default: authRouter } = await import("../../../src/routes/auth.route.js");

describe("auth.route integration", () => {
  let client;

  beforeAll(async () => {
    client = await createHttpTestClient(authRouter, { basePath: "/api/v1" });
  });

  afterAll(async () => {
    await client.close();
  });

  it("POST /api/v1/register should hit register controller", async () => {
    const response = await client.request({
      method: "POST",
      path: "/api/v1/register",
      body: { name: "A", email: "a@a.com", password: "secret", role: "user" },
    });

    expect(response.status).toBe(201);
    expect(response.data).toEqual({ ok: "register" });
    expect(register).toHaveBeenCalled();
  });

  it("GET /api/v1/verify-email/:token should hit verifyEmail controller", async () => {
    const response = await client.request({
      method: "GET",
      path: "/api/v1/verify-email/token-123",
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: "verify-email" });
    expect(verifyEmail).toHaveBeenCalled();
  });
});
