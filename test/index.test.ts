import hello from "../src/index";

describe("test", () => {
  test("test", () => {
    expect(hello("test")).toBe(true);
  });
});
