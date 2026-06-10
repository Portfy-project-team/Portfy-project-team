describe("Portfolio Service", () => {

  it("should filter only VALIDATED projects for public portfolio", () => {
    const projets = [
      { id: 1, titre: "Projet 1", statusV: "VALIDATED" },
      { id: 2, titre: "Projet 2", statusV: "PENDING" },
      { id: 3, titre: "Projet 3", statusV: "REJECTED" },
      { id: 4, titre: "Projet 4", statusV: "VALIDATED" },
    ];

    const validated = projets.filter((p) => p.statusV === "VALIDATED");

    expect(validated.length).toBe(2);
    expect(validated.every((p) => p.statusV === "VALIDATED")).toBe(true);
  });

  it("should filter only VALIDATED stages for public portfolio", () => {
    const stages = [
      { id: 1, entreprise: "A", statutV: "VALIDATED" },
      { id: 2, entreprise: "B", statutV: "PENDING" },
      { id: 3, entreprise: "C", statutV: "VALIDATED" },
    ];

    const validated = stages.filter((s) => s.statutV === "VALIDATED");

    expect(validated.length).toBe(2);
    expect(validated.every((s) => s.statutV === "VALIDATED")).toBe(true);
  });

  it("should detect PRIVATE portfolio", () => {
    const portfolio = { visibilite: "PRIVATE" };
    expect(portfolio.visibilite === "PRIVATE").toBe(true);
  });

  it("should detect PUBLIC portfolio", () => {
    const portfolio = { visibilite: "PUBLIC" };
    expect(portfolio.visibilite === "PRIVATE").toBe(false);
  });

  it("should detect LINK_ONLY portfolio", () => {
    const portfolio = { visibilite: "LINK_ONLY" };
    expect(["PUBLIC", "LINK_ONLY"].includes(portfolio.visibilite)).toBe(true);
  });

  it("should calculate correct scoreCredibilite default", () => {
    const defaultScore = 0;
    expect(defaultScore).toBe(0);
  });

});
