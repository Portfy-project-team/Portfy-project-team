import { jest } from "@jest/globals";
import { getSkills } from "../../../src/modules/user/user.controller.js";

describe("User Controller", () => {

  const mockResponse = () => {
    const res: any = {};

    res.json = jest.fn().mockReturnValue(res);

    return res;
  };

  it("should return skills", async () => {

    const req: any = {};

    const res = mockResponse();

    await getSkills(req, res);

    expect(res.json).toHaveBeenCalled();
  });

});
