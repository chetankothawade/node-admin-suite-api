import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createMockReq, createMockRes } from "../../helpers/mocks.js";

const sendResponse = jest.fn();
const sendListResponse = jest.fn();
const handleError = jest.fn();
const cmsService = {
  listCms: jest.fn(),
  createCms: jest.fn(),
  updateCms: jest.fn(),
  deleteCms: jest.fn(),
  getCms: jest.fn(),
  cmsStatus: jest.fn(),
};

jest.unstable_mockModule("../../../src/utils/response.js", () => ({
  sendResponse,
  sendListResponse,
  handleError,
}));

jest.unstable_mockModule("../../../src/services/cms.service.js", () => ({
  cmsService,
}));

const { listCms, createCms } = await import("../../../src/controllers/cms.controller.js");

describe("cms.controller unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("listCms should return list response", async () => {
    const req = createMockReq({ query: { page: 1 } });
    const res = createMockRes();
    cmsService.listCms.mockResolvedValue({ cms: [], pagination: { total: 0 } });

    await listCms(req, res);

    expect(cmsService.listCms).toHaveBeenCalledWith(req.query);
    expect(sendListResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "cms.list.success",
      [],
      { total: 0 }
    );
  });

  it("createCms should handle service errors", async () => {
    const req = createMockReq({ body: { title: "Policy", content: "..." } });
    const res = createMockRes();
    const error = new Error("boom");
    cmsService.createCms.mockRejectedValue(error);

    await createCms(req, res);

    expect(handleError).toHaveBeenCalledWith(
      req,
      res,
      error,
      expect.objectContaining({ logPrefix: "CMS Create Error:" })
    );
  });
});
