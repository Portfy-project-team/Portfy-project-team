import { jest } from "@jest/globals";

// Mock du service AVANT l'import du controller
jest.unstable_mockModule("../../../src/modules/admin/admin.service.js", () => ({
  AdminServices: {
    AjouterUser: jest.fn(),
    getAllUsers:  jest.fn(),
    deleteUser:  jest.fn(),
    updateUser:  jest.fn(),
    updateUserStatus: jest.fn(),
    approveUser: jest.fn(),
    rejectUser:  jest.fn(),
  },
}));

// Mock de prisma pour éviter les appels DB
jest.unstable_mockModule("../../../src/utils/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create:     jest.fn(),
      update:     jest.fn(),
      delete:     jest.fn(),
    },
  },
}));

const { AjouterUser, listUsers, deleteUser, updateUser } = await import(
  "../../../src/modules/admin/admin.controller.js"
);

const { AdminServices } = await import(
  "../../../src/modules/admin/admin.service.js"
);

const { prisma } = await import("../../../src/utils/prisma.js");

describe("Admin Controller", () => {

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    return res;
  };

  const next = jest.fn() as any;

  beforeEach(() => { jest.clearAllMocks(); });

  // ── AjouterUser ───────────────────────────────────────────────

  describe("AjouterUser", () => {

    it("AC-01 : should create user and return 201", async () => {
      const req: any = {
        body: {
          email:    "kholoud@test.com",
          password: "Password123!",
          role:     "ADMIN",
        },
      };
      const res = mockResponse();

      // L'utilisateur n'existe pas encore
      (prisma.user.findUnique as any).mockResolvedValue(null);
      (AdminServices.AjouterUser as any).mockResolvedValue({
        id:    1,
        email: "kholoud@test.com",
      });

      await AjouterUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User created successfully" })
      );
    });

    it("AC-02 : should return 409 if email already exists", async () => {
      const req: any = {
        body: {
          email:    "existing@test.com",
          password: "Password123!",
          role:     "STUDENT",
        },
      };
      const res = mockResponse();

      // L'utilisateur existe déjà
      (prisma.user.findUnique as any).mockResolvedValue({ id: 99 });

      await AjouterUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("AC-03 : should return 400 on invalid payload (zod)", async () => {
      const req: any = {
        body: { email: "bad-email", password: "123", role: "ADMIN" },
      };
      const res = mockResponse();

      await AjouterUser(req, res, next);

      // Zod throw → next() appelé avec l'erreur
      expect(next).toHaveBeenCalled();
    });
  });

  // ── listUsers ─────────────────────────────────────────────────

  describe("listUsers", () => {

    it("AC-04 : should return users list", async () => {
      const req: any = { query: {} };
      const res = mockResponse();

      (AdminServices.getAllUsers as any).mockResolvedValue([
        { id: 1, email: "a@test.com", role: "STUDENT" },
      ]);

      await listUsers(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ users: expect.any(Array) })
      );
    });
  });
});

// import { jest } from "@jest/globals";
// import { createUser } from "../../../src/modules/admin/admin.controller";
// import { AdminServices } from "../../../src/modules/admin/admin.service";

// jest.mock("../../../src/modules/admin/admin.service", () => ({
//   AdminServices: {
//     createUser: jest.fn(),
//   },
// }));

// describe("Admin Controller", () => {
//   const mockResponse = () => {
//     const res: any = {};

//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);

//     return res;
//   };

//   const next = jest.fn();

//   it("should create user successfully", async () => {
//     const req: any = {
//       body: {
//         name: "Kholoud",
//         email: "kholoud@test.com",
//         password: "Password123!",
//         role: "ADMIN",
//       },
//     };

//     const res = mockResponse();

//     (AdminServices.createUser as any) = jest.fn().mockResolvedValue({
//       id: 1,
//       email: "kholoud@test.com",
//     });

//     await createUser(req, res, next);

//     expect(res.status).toHaveBeenCalledWith(201);
//   });
// });
// import { jest } from "@jest/globals";
// import { createUser } from "../../../src/modules/admin/admin.controller";
// import { AdminServices } from "../../../src/modules/admin/admin.service";

// jest.mock("../../../src/modules/admin/admin.service", () => ({
//   AdminServices: {
//     createUser: jest.fn(),
//   },
// }));

// describe("Admin Controller", () => {

//   const mockResponse = () => {
//     const res: any = {};

//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);

//     return res;
//   };

//   const next = jest.fn();

//   it("should create user successfully", async () => {

//     const req: any = {
//       body: {
//         name: "Kholoud",
//         email: "kholoud@test.com",
//         password: "Password123!",
//         role: "ADMIN",
//       },
//     };

//     const res = mockResponse();

//     jest
//       .mocked(AdminServices.createUser)
//       .mockResolvedValue({
//         id: 1,
//         email: "kholoud@test.com",
//       } as any);

//     await createUser(req, res, next);

//     expect(res.status).toHaveBeenCalledWith(201);
//   });

// });
// import { jest } from "@jest/globals";
// import { createUser } from "../../../src/modules/admin/admin.controller";
// import { AdminServices } from "../../../src/modules/admin/admin.service";

// jest.mock("../../../src/modules/admin/admin.service", () => ({
//   AdminServices: {
//     createUser: jest.fn(),
//   },
// }));

// describe("Admin Controller", () => {

//   const mockResponse = () => {
//     const res: any = {};

//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);

//     return res;
//   };

//   const next = jest.fn();

//   it("should create user successfully", async () => {

//     const req: any = {
//       body: {
//         name: "Kholoud",
//         email: "kholoud@test.com",
//         password: "Password123!",
//         role: "ADMIN",
//       },
//     };

//     const res = mockResponse();

//     (AdminServices.createUser as jest.Mock).mockResolvedValue({
//   id: 1,
//   email: "kholoud@test.com",
// });

//     // (AdminServices.createUser as jest.Mock).mockResolvedValue({
//     //   id: 1,
//     //   email: "kholoud@test.com",
//     // });

//     await createUser(req, res, next);

//     expect(res.status).toHaveBeenCalledWith(201);
//   });

// });
