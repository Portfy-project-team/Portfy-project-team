// tests/unit/portfolio/portfolio.controller.test.ts
import { jest } from "@jest/globals";
 
const getMyPortfolioMock   = jest.fn();
const getPublicPortfolioMock = jest.fn();
const updateSettingsMock   = jest.fn();
 
jest.unstable_mockModule(
  "../../../src/modules/portfolio/portfolio.service.js",
  () => ({
    PortfolioService: {
      getMyPortfolio:    getMyPortfolioMock,
      getPublicPortfolio: getPublicPortfolioMock,
      updateSettings:    updateSettingsMock,
    },
  })
);
 
const { getMyPortfolio, getPublicPortfolio, updateSettings } = await import(
  "../../../src/modules/portfolio/portfolio.controller.js"
);
 
describe("Portfolio Controller", () => {
 
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    return res;
  };
 
  const next = jest.fn() as any;
 
  beforeEach(() => { jest.clearAllMocks(); });
 
  // ── getMyPortfolio ─────────────────────────────────────────────
  describe("getMyPortfolio", () => {
 
    it("should return 200 with enriched portfolio", async () => {
      const req: any = { user: { id: 1, role: "STUDENT" } };
      const res = mockResponse();
 
      getMyPortfolioMock.mockResolvedValue({
        id:      1,
        nom:     "Dupont",
        skills:  [],
        lettres: [],
        activites: [],
        Stage:   [],
        portfolio: { id: 1, visibilite: "PUBLIC", projets: [] },
      });
 
      await getMyPortfolio(req, res, next);
 
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ portfolio: expect.any(Object) })
      );
    });
 
    it("should return 404 if portfolio not found", async () => {
      const req: any = { user: { id: 999, role: "STUDENT" } };
      const res = mockResponse();
 
      getMyPortfolioMock.mockResolvedValue(null);
 
      await getMyPortfolio(req, res, next);
 
      expect(res.status).toHaveBeenCalledWith(404);
    });
 
    it("should call next on error", async () => {
      const req: any = { user: { id: 1, role: "STUDENT" } };
      const res = mockResponse();
 
      getMyPortfolioMock.mockRejectedValue(new Error("DB error"));
 
      await getMyPortfolio(req, res, next);
 
      expect(next).toHaveBeenCalled();
    });
  });
 
  // ── getPublicPortfolio ─────────────────────────────────────────
  describe("getPublicPortfolio", () => {
 
    it("should return 200 with public portfolio", async () => {
      const req: any = { params: { studentId: "1" } };
      const res = mockResponse();
 
      getPublicPortfolioMock.mockResolvedValue({
        id:       1,
        nom:      "Dupont",
        skills:   [],
        stages:   [],
        lettres:  [],
        formations: [],
        portfolio: { visibilite: "PUBLIC", projets: [] },
      });
 
      await getPublicPortfolio(req, res, next);
 
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ portfolio: expect.any(Object) })
      );
    });
 
    it("should return 400 for invalid student id", async () => {
      const req: any = { params: { studentId: "abc" } };
      const res = mockResponse();
 
      await getPublicPortfolio(req, res, next);
 
      expect(res.status).toHaveBeenCalledWith(400);
    });
 
    it("should return 404 if student not found", async () => {
      const req: any = { params: { studentId: "999" } };
      const res = mockResponse();
 
      getPublicPortfolioMock.mockResolvedValue(null);
 
      await getPublicPortfolio(req, res, next);
 
      expect(res.status).toHaveBeenCalledWith(404);
    });
 
    it("should return 403 if portfolio is restricted", async () => {
      const req: any = { params: { studentId: "1" } };
      const res = mockResponse();
 
      getPublicPortfolioMock.mockResolvedValue({ restricted: true });
 
      await getPublicPortfolio(req, res, next);
 
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
 
  // ── updateSettings ─────────────────────────────────────────────
  describe("updateSettings", () => {
 
    it("should return 200 with updated portfolio", async () => {
      const req: any = {
        user: { id: 1, role: "STUDENT" },
        body: { objective: "Mon objectif", visibilite: "PUBLIC" },
      };
      const res = mockResponse();
 
      updateSettingsMock.mockResolvedValue({
        id:         1,
        objective:  "Mon objectif",
        visibilite: "PUBLIC",
      });
 
      await updateSettings(req, res, next);
 
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Portfolio updated" })
      );
    });
 
    it("should call next on error", async () => {
      const req: any = {
        user: { id: 1, role: "STUDENT" },
        body: { objective: "test" },
      };
      const res = mockResponse();
 
      updateSettingsMock.mockRejectedValue(new Error("Student not found"));
 
      await updateSettings(req, res, next);
 
      expect(next).toHaveBeenCalled();
    });
  });
});
// import { jest } from "@jest/globals";

// const getMyPortfolioMock = jest.fn();
// const getPublicPortfolioMock = jest.fn();
// const updateSettingsMock = jest.fn();

// jest.unstable_mockModule(
//   "../../../src/modules/portfolio/portfolio.service.js",
//   () => ({
//     PortfolioService: {
//       getMyPortfolio: getMyPortfolioMock,
//       getPublicPortfolio: getPublicPortfolioMock,
//       updateSettings: updateSettingsMock,
//     },
//   })
// );

// const { getMyPortfolio, getPublicPortfolio, updateSettings } = await import(
//   "../../../src/modules/portfolio/portfolio.controller.js"
// );

// describe("Portfolio Controller", () => {

//   const mockResponse = () => {
//     const res: any = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const next = jest.fn() as any;

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getMyPortfolio", () => {

//     it("should return 200 with portfolio", async () => {
//       const req: any = { user: { id: 1, role: "STUDENT" } };
//       const res = mockResponse();

//       getMyPortfolioMock.mockResolvedValue({
//         id: 1,
//         nom: "Test",
//         portfolio: { id: 1, visibilite: "PUBLIC" },
//       });

//       await getMyPortfolio(req, res, next);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({ portfolio: expect.any(Object) })
//       );
//     });

//     it("should return 404 if portfolio not found", async () => {
//       const req: any = { user: { id: 999, role: "STUDENT" } };
//       const res = mockResponse();

//       getMyPortfolioMock.mockResolvedValue(null);

//       await getMyPortfolio(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//   });

//   describe("getPublicPortfolio", () => {

//     it("should return 200 with public portfolio", async () => {
//       const req: any = { params: { studentId: "1" } };
//       const res = mockResponse();

//       getPublicPortfolioMock.mockResolvedValue({
//         id: 1,
//         nom: "Test",
//         portfolio: { visibilite: "PUBLIC", projets: [] },
//       });

//       await getPublicPortfolio(req, res, next);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({ portfolio: expect.any(Object) })
//       );
//     });

//     it("should return 400 for invalid student id", async () => {
//       const req: any = { params: { studentId: "abc" } };
//       const res = mockResponse();

//       await getPublicPortfolio(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("should return 404 if student not found", async () => {
//       const req: any = { params: { studentId: "999" } };
//       const res = mockResponse();

//       getPublicPortfolioMock.mockResolvedValue(null);

//       await getPublicPortfolio(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//     it("should return 403 if portfolio is private", async () => {
//       const req: any = { params: { studentId: "1" } };
//       const res = mockResponse();

//       getPublicPortfolioMock.mockResolvedValue({
//         restricted: true,
//       });

//       await getPublicPortfolio(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(403);
//     });

//   });

//   describe("updateSettings", () => {

//     it("should return 200 with updated portfolio", async () => {
//       const req: any = {
//         user: { id: 1, role: "STUDENT" },
//         body: {
//           objective: "Mon objectif",
//           visibilite: "PUBLIC",
//         },
//       };
//       const res = mockResponse();

//       updateSettingsMock.mockResolvedValue({
//         id: 1,
//         objective: "Mon objectif",
//         visibilite: "PUBLIC",
//       });

//       await updateSettings(req, res, next);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({ message: "Portfolio updated" })
//       );
//     });

//     it("should call next on error", async () => {
//       const req: any = {
//         user: { id: 1, role: "STUDENT" },
//         body: { objective: "test" },
//       };
//       const res = mockResponse();

//       updateSettingsMock.mockRejectedValue(new Error("Student not found"));

//       await updateSettings(req, res, next);

//       expect(next).toHaveBeenCalled();
//     });

//   });

// });
// import { jest } from "@jest/globals";
// import { getMyPortfolio, getPublicPortfolio, updateSettings } from "../../../src/modules/portfolio/portfolio.controller";

// jest.mock("../../../src/modules/portfolio/portfolio.service", () => ({
//   PortfolioService: {
//     getMyPortfolio: jest.fn(),
//     getPublicPortfolio: jest.fn(),
//     updateSettings: jest.fn(),
//   },
// }));

// import { PortfolioService } from "../../../src/modules/portfolio/portfolio.service";

// describe("Portfolio Controller", () => {

//   const mockResponse = () => {
//     const res: any = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     return res;
//   };

//   const next = jest.fn() as any;

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getMyPortfolio", () => {

//     it("should return 200 with portfolio", async () => {
//       const req: any = { user: { id: 1, role: "STUDENT" } };
//       const res = mockResponse();

//       (PortfolioService.getMyPortfolio as any).mockResolvedValue({
//         id: 1,
//         nom: "Test",
//         portfolio: { id: 1, visibilite: "PUBLIC" },
//       });

//       await getMyPortfolio(req, res, next);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({ portfolio: expect.any(Object) })
//       );
//     });

//     it("should return 404 if portfolio not found", async () => {
//       const req: any = { user: { id: 999, role: "STUDENT" } };
//       const res = mockResponse();

//       (PortfolioService.getMyPortfolio as any).mockResolvedValue(null);

//       await getMyPortfolio(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//   });

//   describe("getPublicPortfolio", () => {

//     it("should return 200 with public portfolio", async () => {
//       const req: any = { params: { studentId: "1" } };
//       const res = mockResponse();

//       (PortfolioService.getPublicPortfolio as any).mockResolvedValue({
//         id: 1,
//         nom: "Test",
//         portfolio: { visibilite: "PUBLIC", projets: [] },
//       });

//       await getPublicPortfolio(req, res, next);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({ portfolio: expect.any(Object) })
//       );
//     });

//     it("should return 400 for invalid student id", async () => {
//       const req: any = { params: { studentId: "abc" } };
//       const res = mockResponse();

//       await getPublicPortfolio(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(400);
//     });

//     it("should return 404 if student not found", async () => {
//       const req: any = { params: { studentId: "999" } };
//       const res = mockResponse();

//       (PortfolioService.getPublicPortfolio as any).mockResolvedValue(null);

//       await getPublicPortfolio(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(404);
//     });

//     it("should return 403 if portfolio is private", async () => {
//       const req: any = { params: { studentId: "1" } };
//       const res = mockResponse();

//       (PortfolioService.getPublicPortfolio as any).mockResolvedValue({
//         restricted: true,
//       });

//       await getPublicPortfolio(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(403);
//     });

//   });

//   describe("updateSettings", () => {

//     it("should return 200 with updated portfolio", async () => {
//       const req: any = {
//         user: { id: 1, role: "STUDENT" },
//         body: {
//           objective: "Mon objectif",
//           visibilite: "PUBLIC",
//         },
//       };
//       const res = mockResponse();

//       (PortfolioService.updateSettings as any).mockResolvedValue({
//         id: 1,
//         objective: "Mon objectif",
//         visibilite: "PUBLIC",
//       });

//       await updateSettings(req, res, next);

//       expect(res.json).toHaveBeenCalledWith(
//         expect.objectContaining({ message: "Portfolio updated" })
//       );
//     });

//     it("should call next on error", async () => {
//       const req: any = {
//         user: { id: 1, role: "STUDENT" },
//         body: { objective: "test" },
//       };
//       const res = mockResponse();

//       (PortfolioService.updateSettings as any).mockRejectedValue(
//         new Error("Student not found")
//       );

//       await updateSettings(req, res, next);

//       expect(next).toHaveBeenCalled();
//     });

//   });

// });
