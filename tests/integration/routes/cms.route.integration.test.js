import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { createHttpTestClient } from "../../helpers/http.js";

const isAuthenticated = jest.fn((req, res, next) => {
  req.user = { id: 1, role: "admin" };
  next();
});
const validateRequest = jest.fn(() => (req, res, next) => next());

const listCms = jest.fn((req, res) => res.status(200).json({ ok: "list-cms" }));
const createCms = jest.fn((req, res) => res.status(201).json({ ok: "create-cms" }));
const updateCms = jest.fn((req, res) => res.status(200).json({ ok: "update-cms" }));
const deleteCms = jest.fn((req, res) => res.status(200).json({ ok: "delete-cms" }));
const getCms = jest.fn((req, res) => res.status(200).json({ ok: "get-cms" }));
const cmsStatus = jest.fn((req, res) => res.status(200).json({ ok: "status-cms" }));

jest.unstable_mockModule("../../../src/middlewares/isAuthenticated.js", () => ({
  default: isAuthenticated,
}));

jest.unstable_mockModule("../../../src/middlewares/validateRequest.js", () => ({
  validateRequest,
}));

jest.unstable_mockModule("../../../src/controllers/cms.controller.js", () => ({
  listCms,
  createCms,
  updateCms,
  deleteCms,
  getCms,
  cmsStatus,
}));

const { default: cmsRouter } = await import("../../../src/routes/cms.route.js");

describe("cms.route integration", () => {
  let client;

  beforeAll(async () => {
    client = await createHttpTestClient(cmsRouter, { basePath: "/api/v1/cms" });
  });

  afterAll(async () => {
    await client.close();
  });

  it("GET /api/v1/cms/list should call listCms", async () => {
    const response = await client.request({
      method: "GET",
      path: "/api/v1/cms/list",
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: "list-cms" });
    expect(listCms).toHaveBeenCalled();
    expect(isAuthenticated).toHaveBeenCalled();
  });

  it("PUT /api/v1/cms/status/:uuid should call cmsStatus with validation middleware", async () => {
    const response = await client.request({
      method: "PUT",
      path: "/api/v1/cms/status/u-1",
      body: { status: "active" },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: "status-cms" });
    expect(cmsStatus).toHaveBeenCalled();
  });
});
