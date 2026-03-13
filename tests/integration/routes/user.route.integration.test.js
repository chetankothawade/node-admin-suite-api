import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { createHttpTestClient } from "../../helpers/http.js";

const isAuthenticated = jest.fn((req, res, next) => {
  req.user = { id: 1, role: "admin" };
  next();
});
const authorizeRoles = jest.fn(() => (req, res, next) => next());
const validateRequest = jest.fn(() => (req, res, next) => next());
const uploadImageSingle = jest.fn(() => (req, res, next) => next());

const getMe = jest.fn((req, res) => res.status(200).json({ ok: "me" }));
const listUser = jest.fn((req, res) => res.status(200).json({ ok: "list" }));
const createUser = jest.fn((req, res) => res.status(201).json({ ok: "create" }));
const updateUser = jest.fn((req, res) => res.status(200).json({ ok: "update" }));
const deleteUser = jest.fn((req, res) => res.status(200).json({ ok: "delete" }));
const getUser = jest.fn((req, res) => res.status(200).json({ ok: "get" }));
const userStatus = jest.fn((req, res) => res.status(200).json({ ok: "status" }));
const getUserList = jest.fn((req, res) => res.status(200).json({ ok: "getList" }));
const exportUsersCSV = jest.fn((req, res) => res.status(200).json({ ok: "csv" }));

jest.unstable_mockModule("../../../src/middlewares/isAuthenticated.js", () => ({
  default: isAuthenticated,
}));

jest.unstable_mockModule("../../../src/middlewares/authorizeRoles.js", () => ({
  default: authorizeRoles,
}));

jest.unstable_mockModule("../../../src/middlewares/validateRequest.js", () => ({
  validateRequest,
}));

jest.unstable_mockModule("../../../src/utils/multer.js", () => ({
  uploadImage: { single: uploadImageSingle },
}));

jest.unstable_mockModule("../../../src/controllers/user.controller.js", () => ({
  getMe,
  listUser,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  userStatus,
  getUserList,
  exportUsersCSV,
}));

const { default: userRouter } = await import("../../../src/routes/user.route.js");

describe("user.route integration", () => {
  let client;

  beforeAll(async () => {
    client = await createHttpTestClient(userRouter, { basePath: "/api/v1/user" });
  });

  afterAll(async () => {
    await client.close();
  });

  it("GET /api/v1/user/me should return getMe response", async () => {
    const response = await client.request({
      method: "GET",
      path: "/api/v1/user/me",
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: "me" });
    expect(isAuthenticated).toHaveBeenCalled();
  });

  it("POST /api/v1/user/create should run upload+validation and call controller", async () => {
    const response = await client.request({
      method: "POST",
      path: "/api/v1/user/create",
      body: { name: "Neo", email: "neo@example.com" },
    });

    expect(response.status).toBe(201);
    expect(response.data).toEqual({ ok: "create" });
    expect(createUser).toHaveBeenCalled();
  });
});
