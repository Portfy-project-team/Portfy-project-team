import { jest } from "@jest/globals";

const registerUserMock = jest.fn();
const sendVerificationEmailMock = jest.fn();
const loginUserMock = jest.fn();
const refreshTokenServiceMock = jest.fn();
const logoutUserMock = jest.fn();
const verifyEmailServiceMock = jest.fn();
const resendVerificationEmailMock = jest.fn();
const forgotPasswordServiceMock = jest.fn();
const resetPasswordServiceMock = jest.fn();

jest.unstable_mockModule(
  "../../../src/modules/auth/auth.service.js",
  () => ({
    registerUser: registerUserMock,
    sendVerificationEmail: sendVerificationEmailMock,
    loginUser: loginUserMock,
    refreshTokenService: refreshTokenServiceMock,
    logoutUser: logoutUserMock,
    verifyEmailService: verifyEmailServiceMock,
    resendVerificationEmail: resendVerificationEmailMock,
    forgotPasswordService: forgotPasswordServiceMock,
    resetPasswordService: resetPasswordServiceMock,
  })
);

const { registerController } = await import(
  "../../../src/modules/auth/auth.controller.js"
);

describe("registerController", () => {
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 when user registered", async () => {
    const req: any = {
      body: {
        email: "test@test.com",
        password: "Password123!",
        role: "STUDENT",
      },
    };

    const res = mockResponse();

    registerUserMock.mockResolvedValue({
      id: 1,
      email: "test@test.com",
    });

    sendVerificationEmailMock.mockResolvedValue(undefined);

    await registerController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Compte créé avec succès. Vérifiez votre email pour activer votre compte.",
      user: { id: 1, email: "test@test.com" },
    });
  });

  it("should return 400 when body is invalid", async () => {
    const req: any = {
      body: {
        email: "invalid-email",
        password: "123",
        role: "STUDENT",
      },
    };

    const res = mockResponse();

    await registerController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
// import { jest } from "@jest/globals";
// import { registerController } from "../../../src/modules/auth/auth.controller";
// import * as authService from "../../../src/modules/auth/auth.service";

// jest.mock("../../../src/modules/auth/auth.service");

// describe("registerController", () => {

//   const mockResponse = () => {
//     const res: any = {};

//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);

//     return res;
//   };

//   it("should return 201 when user registered", async () => {

//     const req: any = {
//       body: {
//         email: "test@test.com",
//         password: "Password123!",
//         role: "STUDENT",
//       },
//     };

//     const res = mockResponse();

//     jest
//       .mocked(authService.registerUser)
//       .mockResolvedValue({
//         id: 1,
//         email: "test@test.com",
//       } as any);

//     jest
//       .mocked(authService.sendVerificationEmail)
//       .mockResolvedValue(undefined);

//     await registerController(req, res);

//     expect(res.status).toHaveBeenCalledWith(201);

//     expect(res.json).toHaveBeenCalledWith({
//       message:
//         "Compte créé avec succès. Vérifiez votre email pour activer votre compte.",
//       user: {
//         id: 1,
//         email: "test@test.com",
//       },
//     });
//   });

// });
// import { registerController } from "../../../src/modules/auth/auth.controller";
// import * as authService from "../../../src/modules/auth/auth.service";

// jest.mock("../../../src/modules/auth/auth.service");

// describe("registerController", () => {

//   const mockResponse = () => {
//     const res: any = {};

//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);

//     return res;
//   };

//   it("should return 201 when user registered", async () => {

//     const req: any = {
//       body: {
//         email: "test@test.com",
//         password: "Password123!",
//         role: "STUDENT",
//       },
//     };

//     const res = mockResponse();

//     // mock registerUser
//     (authService.registerUser as jest.Mock).mockResolvedValue({
//       id: 1,
//       email: "test@test.com",
//     });

//     // mock sendVerificationEmail
//     (authService.sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);

//     await registerController(req, res);

//     expect(res.status).toHaveBeenCalledWith(201);

//     expect(res.json).toHaveBeenCalledWith({
//       message:
//         "Compte créé avec succès. Vérifiez votre email pour activer votre compte.",
//       user: {
//         id: 1,
//         email: "test@test.com",
//       },
//     });
//   });

// });