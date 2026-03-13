import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { createMockReq, createMockRes } from "../../helpers/mocks.js";

const sendResponse = jest.fn();
const sendListResponse = jest.fn();
const handleError = jest.fn();

const userServiceMethods = {
  createUser: jest.fn(),
  getUsers: jest.fn(),
  getUserByUuid: jest.fn(),
  updateUserByUuid: jest.fn(),
  deleteUserByUuid: jest.fn(),
  updateUserStatusByUuid: jest.fn(),
  getMe: jest.fn(),
  getAdminUsers: jest.fn(),
  getUsersForCsv: jest.fn(),
};

const UserService = jest.fn(() => userServiceMethods);
const UserRepository = jest.fn();

jest.unstable_mockModule("../../../src/utils/response.js", () => ({
  sendResponse,
  sendListResponse,
  handleError,
}));

jest.unstable_mockModule("../../../src/services/user.service.js", () => ({
  UserService,
  userCsvFields: [
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
  ],
}));

jest.unstable_mockModule("../../../src/repositories/user.repository.js", () => ({
  UserRepository,
}));

const { createUser, exportUsersCSV } = await import("../../../src/controllers/user.controller.js");

describe("user.controller unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createUser should delegate to service and send success response", async () => {
    const req = createMockReq({ body: { name: "Neo" }, file: null });
    const res = createMockRes();
    userServiceMethods.createUser.mockResolvedValue({ id: 10, name: "Neo" });

    await createUser(req, res);

    expect(userServiceMethods.createUser).toHaveBeenCalledWith({ body: req.body, file: req.file, req });
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      201,
      true,
      "user.create.success",
      { id: 10, name: "Neo" }
    );
  });

  it("exportUsersCSV should sanitize dangerous CSV cell prefixes", async () => {
    const req = createMockReq();
    const res = createMockRes();
    userServiceMethods.getUsersForCsv.mockResolvedValue([
      { name: "=CMD()", email: "safe@example.com" },
    ]);

    await exportUsersCSV(req, res);

    expect(res.header).toHaveBeenCalledWith("Content-Type", "text/csv");
    expect(res.attachment).toHaveBeenCalledWith("users_export.csv");
    expect(res.send).toHaveBeenCalled();
    const csvOutput = res.send.mock.calls[0][0];
    expect(csvOutput).toContain("'=CMD()");
  });
});
