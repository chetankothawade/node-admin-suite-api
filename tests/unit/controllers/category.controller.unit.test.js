import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createMockReq, createMockRes } from "../../helpers/mocks.js";

const sendResponse = jest.fn();
const handleError = jest.fn();
const categoryService = {
  listCategories: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
  getCategory: jest.fn(),
  updateCategoryStatus: jest.fn(),
  getCategoryList: jest.fn(),
};

jest.unstable_mockModule("../../../src/utils/response.js", () => ({
  sendResponse,
  handleError,
}));

jest.unstable_mockModule("../../../src/services/category.service.js", () => ({
  categoryService,
}));

const { listCategories, updateCategoryStatus } = await import("../../../src/controllers/category.controller.js");

describe("category.controller unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("listCategories should pass params/query to service", async () => {
    const req = createMockReq({ params: { id: "10" }, query: { search: "food" } });
    const res = createMockRes();
    categoryService.listCategories.mockResolvedValue({ categories: [] });

    await listCategories(req, res);

    expect(categoryService.listCategories).toHaveBeenCalledWith({
      params: req.params,
      query: req.query,
    });
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "category.list.success",
      expect.objectContaining({ categories: [] })
    );
  });

  it("updateCategoryStatus should return updated entity", async () => {
    const req = createMockReq({ params: { uuid: "u1" }, body: { status: "active" } });
    const res = createMockRes();
    categoryService.updateCategoryStatus.mockResolvedValue({ id: 1, status: "active" });

    await updateCategoryStatus(req, res);

    expect(categoryService.updateCategoryStatus).toHaveBeenCalledWith("u1", "active");
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "category.status.success",
      { category: { id: 1, status: "active" } }
    );
  });
});

