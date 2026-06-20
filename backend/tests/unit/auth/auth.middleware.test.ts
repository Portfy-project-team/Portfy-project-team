import { jest } from "@jest/globals";

process.env.JWT_ACCESS_SECRET  = "test_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";

import { verifyToken } from "../../../src/middlewares/auth.middleware";

describe("verifyToken middleware", () => {

  const mockResponse = () => {
    const res: any = {};
    res.status      = jest.fn().mockReturnValue(res);
    res.json        = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn();
    return res;
  };

  let next: any;

  beforeEach(() => { next = jest.fn(); });

  it("MW-01 : should return 401 if no token in cookies", () => {
    const req: any = { cookies: {} };
    const res = mockResponse();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("MW-02 : should return 401 if cookies is undefined", () => {
    const req: any = {};
    const res = mockResponse();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("MW-03 : should return 401 if token is invalid", async () => {
    const req: any = {
      cookies: { access_token: "fake.invalid.token" },
    };
    const res = mockResponse();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
// import { jest } from "@jest/globals";

// process.env.JWT_ACCESS_SECRET = "test_secret";

// import { verifyToken } from "../../../src/middlewares/auth.middleware";

// describe("verifyToken middleware", () => {
//   const mockResponse = () => {
//     const res: any = {};

//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     res.clearCookie = jest.fn();

//     return res;
//   };

//   let next: any;

//   beforeEach(() => {
//     next = jest.fn();
//   });

//   it("should return 401 if no token", () => {
//     const req: any = {
//       cookies: {},
//     };

//     const res = mockResponse();

//     verifyToken(req, res, next);

//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(next).not.toHaveBeenCalled();
//   });
// });
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
