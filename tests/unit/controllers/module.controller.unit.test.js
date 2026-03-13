import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createMockReq, createMockRes } from "../../helpers/mocks.js";

const sendResponse = jest.fn();
const handleError = jest.fn();
const moduleService = {
  listModule: jest.fn(),
  createModule: jest.fn(),
  updateModule: jest.fn(),
  deleteModule: jest.fn(),
  getModule: jest.fn(),
  moduleStatus: jest.fn(),
  getModuleList: jest.fn(),
};

jest.unstable_mockModule("../../../src/utils/response.js", () => ({
  sendResponse,
  handleError,
}));

jest.unstable_mockModule("../../../src/services/module.service.js", () => ({
  moduleService,
}));

const { listModule, createModule } = await import("../../../src/controllers/module.controller.js");

describe("module.controller unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("listModule should call moduleService with params/query", async () => {
    const req = createMockReq({ params: { id: "1" }, query: { search: "adm" } });
    const res = createMockRes();
    moduleService.listModule.mockResolvedValue({ module: [] });

    await listModule(req, res);

    expect(moduleService.listModule).toHaveBeenCalledWith({
      params: req.params,
      query: req.query,
    });
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "module.list.success",
      expect.objectContaining({ module: [] })
    );
  });

  it("createModule should route errors through handleError", async () => {
    const req = createMockReq({ body: { name: "users" } });
    const res = createMockRes();
    const error = new Error("bad");
    moduleService.createModule.mockRejectedValue(error);

    await createModule(req, res);

    expect(handleError).toHaveBeenCalledWith(
      req,
      res,
      error,
      expect.objectContaining({ logPrefix: "Create module error:" })
    );
  });
});

