import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createMockReq, createMockRes } from "../../helpers/mocks.js";

const sendResponse = jest.fn();
const handleError = jest.fn();
const userPermissionService = {
  toggle: jest.fn(),
  getUsersModulesPermission: jest.fn(),
  getUserModuleAccess: jest.fn(),
  buildSidebarMenu: jest.fn(),
};

jest.unstable_mockModule("../../../src/utils/response.js", () => ({
  sendResponse,
  handleError,
}));

jest.unstable_mockModule("../../../src/services/userPermission.service.js", () => ({
  userPermissionService,
}));

const {
  toggleUserPermission,
  sidebarMenu,
} = await import("../../../src/controllers/userPermission.controller.js");

describe("userPermission.controller unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("toggleUserPermission should call service with expected payload values", async () => {
    const req = createMockReq({
      body: { user_id: 2, module_permission_id: 3, isChecked: true },
    });
    const res = createMockRes();
    userPermissionService.toggle.mockResolvedValue({ ok: true });

    await toggleUserPermission(req, res);

    expect(userPermissionService.toggle).toHaveBeenCalledWith(2, 3, true);
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "user_permission.update.success",
      { ok: true }
    );
  });

  it("sidebarMenu should return unauthorized if req.user.id missing", async () => {
    const req = createMockReq({ user: null });
    const res = createMockRes();

    await sidebarMenu(req, res);

    expect(sendResponse).toHaveBeenCalledWith(res, 401, false, "auth.unauthorized");
    expect(userPermissionService.buildSidebarMenu).not.toHaveBeenCalled();
  });
});

