import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { createHttpTestClient } from "../../helpers/http.js";

const isAuthenticated = jest.fn((req, res, next) => {
  req.user = { id: 1, role: "admin" };
  next();
});
const validateRequest = jest.fn(() => (req, res, next) => next());

const listCategories = jest.fn((req, res) => res.status(200).json({ ok: "list-category" }));
const createCategory = jest.fn((req, res) => res.status(201).json({ ok: "create-category" }));
const updateCategory = jest.fn((req, res) => res.status(200).json({ ok: "update-category" }));
const deleteCategory = jest.fn((req, res) => res.status(200).json({ ok: "delete-category" }));
const getCategory = jest.fn((req, res) => res.status(200).json({ ok: "get-category" }));
const updateCategoryStatus = jest.fn((req, res) => res.status(200).json({ ok: "status-category" }));
const getCategoryList = jest.fn((req, res) => res.status(200).json({ ok: "getlist-category" }));

jest.unstable_mockModule("../../../src/middlewares/isAuthenticated.js", () => ({
  default: isAuthenticated,
}));

jest.unstable_mockModule("../../../src/middlewares/validateRequest.js", () => ({
  validateRequest,
}));

jest.unstable_mockModule("../../../src/controllers/category.controller.js", () => ({
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  updateCategoryStatus,
  getCategoryList,
}));

const { default: categoryRouter } = await import("../../../src/routes/category.route.js");

describe("category.route integration", () => {
  let client;

  beforeAll(async () => {
    client = await createHttpTestClient(categoryRouter, { basePath: "/api/v1/category" });
  });

  afterAll(async () => {
    await client.close();
  });

  it("GET /api/v1/category/list should hit listCategories", async () => {
    const response = await client.request({
      method: "GET",
      path: "/api/v1/category/list",
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: "list-category" });
    expect(listCategories).toHaveBeenCalled();
  });

  it("DELETE /api/v1/category/delete/:uuid should call deleteCategory with validator", async () => {
    const response = await client.request({
      method: "DELETE",
      path: "/api/v1/category/delete/u-2",
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: "delete-category" });
    expect(deleteCategory).toHaveBeenCalled();
  });
});
