import { jest } from "@jest/globals";

process.env.JWT_ACCESS_SECRET = "test_secret";

import { verifyToken } from "../../../src/middlewares/auth.middleware";

describe("verifyToken middleware", () => {
  const mockResponse = () => {
    const res: any = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn();

    return res;
  };

  let next: any;

  beforeEach(() => {
    next = jest.fn();
  });

  it("should return 401 if no token", () => {
    const req: any = {
      cookies: {},
    };

    const res = mockResponse();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
// process.env.JWT_ACCESS_SECRET = "test_secret";
// import jwt from "jsonwebtoken";
// import { verifyToken } from "../../../src/middlewares/auth.middleware";

// describe("verifyToken middleware", () => {

//   const mockResponse = () => {
//     const res: any = {};

//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     res.clearCookie = jest.fn();

//     return res;
//   };

//   const next = jest.fn();

//   it("should return 401 if no token", () => {

//     const req: any = {
//       cookies: {},
//     };

//     const res = mockResponse();

//     verifyToken(req, res, next);

//     expect(res.status).toHaveBeenCalledWith(401);
//   });

// });
