import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createMockReq, createMockRes } from "../../helpers/mocks.js";

const sendResponse = jest.fn();
const handleError = jest.fn();
const authService = {
  register: jest.fn(),
  login: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  verifyEmail: jest.fn(),
  logout: jest.fn(),
};

jest.unstable_mockModule("../../../src/utils/response.js", () => ({
  sendResponse,
  handleError,
}));

jest.unstable_mockModule("../../../src/services/auth.service.js", () => ({
  authService,
}));

const { register, login, logout } = await import("../../../src/controllers/auth.controller.js");

describe("auth.controller unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("register should call service and send response", async () => {
    const req = createMockReq({ body: { name: "A", email: "a@a.com", password: "secret" } });
    const res = createMockRes();
    authService.register.mockResolvedValue({ user: { id: 1 } });

    await register(req, res);

    expect(authService.register).toHaveBeenCalledWith(req.body);
    expect(sendResponse).toHaveBeenCalledWith(res, 201, true, "auth.register.success", { user: { id: 1 } });
  });

  it("login should route errors to handleError", async () => {
    const req = createMockReq({ body: { email: "a@a.com", password: "bad" } });
    const res = createMockRes();
    const error = new Error("bad creds");
    authService.login.mockRejectedValue(error);

    await login(req, res);

    expect(handleError).toHaveBeenCalledWith(
      req,
      res,
      error,
      expect.objectContaining({ logPrefix: "Login error:" })
    );
  });

  it("logout should clear admin cookie and send response", async () => {
    const req = createMockReq({ user: { id: 1, role: "admin" } });
    const res = createMockRes();
    authService.logout.mockReturnValue({ role: "admin" });

    await logout(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith("admin_token");
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "auth.logout.success",
      expect.objectContaining({ role: "admin" })
    );
  });
});

