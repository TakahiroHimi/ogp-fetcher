import fetchOGP from "../src/index";

describe("test", () => {
  test("test", () => {
    return expect(fetchOGP(["https://shs.sh/"])).resolves.toBe(true);
  });
});
