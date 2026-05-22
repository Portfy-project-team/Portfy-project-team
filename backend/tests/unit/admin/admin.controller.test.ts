import { createUser } from "../../../src/modules/admin/admin.controller";
import { AdminServices } from "../../../src/modules/admin/admin.service";

jest.mock("../../../src/modules/admin/admin.service", () => ({
  AdminServices: {
    createUser: jest.fn(),
  },
}));

describe("Admin Controller", () => {

  const mockResponse = () => {
    const res: any = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res;
  };

  const next = jest.fn();

  it("should create user successfully", async () => {

    const req: any = {
      body: {
        name: "Kholoud",
        email: "kholoud@test.com",
        password: "Password123!",
        role: "ADMIN",
      },
    };

    const res = mockResponse();

    (AdminServices.createUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "kholoud@test.com",
    });

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

});