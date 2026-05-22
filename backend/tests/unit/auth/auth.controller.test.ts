import { registerController } from "../../../src/modules/auth/auth.controller";
import * as authService from "../../../src/modules/auth/auth.service";

jest.mock("../../../src/modules/auth/auth.service");

describe("registerController", () => {

  const mockResponse = () => {
    const res: any = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
  };

  it("should return 201 when user registered", async () => {

    const req: any = {
      body: {
        email: "test@test.com",
        password: "Password123!",
        role: "STUDENT",
      },
    };

    const res = mockResponse();

    // mock registerUser
    (authService.registerUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@test.com",
    });

    // mock sendVerificationEmail
    (authService.sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);

    await registerController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith({
      message:
        "Compte créé avec succès. Vérifiez votre email pour activer votre compte.",
      user: {
        id: 1,
        email: "test@test.com",
      },
    });
  });

});