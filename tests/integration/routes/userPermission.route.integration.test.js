import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { createHttpTestClient } from "../../helpers/http.js";

const isAuthenticated = jest.fn((req, res, next) => {
  req.user = { id: 1, role: "admin" };
  next();
});

const toggleUserPermission = jest.fn((req, res) => res.status(200).json({ ok: "toggle" }));
const getUsersModulesPermission = jest.fn((req, res) => res.status(200).json({ ok: "matrix" }));
const userModuleAccess = jest.fn((req, res) => res.status(200).json({ ok: "access" }));
const sidebarMenu = jest.fn((req, res) => res.status(200).json({ ok: "sidebar" }));

jest.unstable_mockModule("../../../src/middlewares/isAuthenticated.js", () => ({
  default: isAuthenticated,
}));

jest.unstable_mockModule("../../../src/controllers/userPermission.controller.js", () => ({
  toggleUserPermission,
  getUsersModulesPermission,
  userModuleAccess,
  sidebarMenu,
}));

const { default: userPermissionRouter } = await import("../../../src/routes/userPermission.route.js");

describe("userPermission.route integration", () => {
  let client;

  beforeAll(async () => {
    client = await createHttpTestClient(userPermissionRouter, { basePath: "/api/v1/user-permissions" });
  });

  afterAll(async () => {
    await client.close();
  });

  it("POST /api/v1/user-permissions/toggle should hit toggle controller", async () => {
    const response = await client.request({
      method: "POST",
      path: "/api/v1/user-permissions/toggle",
      body: { user_id: 2, module_permission_id: 3, isChecked: true },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: "toggle" });
    expect(isAuthenticated).toHaveBeenCalled();
    expect(toggleUserPermission).toHaveBeenCalled();
  });

  it("GET /api/v1/user-permissions/side-menu should hit sidebar controller", async () => {
    const response = await client.request({
      method: "GET",
      path: "/api/v1/user-permissions/side-menu",
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: "sidebar" });
    expect(sidebarMenu).toHaveBeenCalled();
  });
});

