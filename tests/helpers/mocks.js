import { jest } from "@jest/globals";

export function createMockReq(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    user: { id: 1, role: "admin" },
    __: (key) => key,
    ...overrides,
  };
}

export function createMockRes() {
  const res = {};
  res.req = { __: (key) => key };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  res.attachment = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
}
