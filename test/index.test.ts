import fetchOGP from "../src/index";

describe("test", () => {
  test("fetch ogp", () => {
    return expect(
      fetchOGP(["https://takahirohimi.github.io/ogp-fetcher/"])
    ).resolves.toStrictEqual([
      {
        ["og:title"]: "title",
        ["og:description"]: "description",
        ["og:locale"]: "locale",
        ["og:type"]: "type",
        ["og:url"]: "https://example.com",
        ["og:image:width"]: "200",
        ["og:image:height"]: "100",
        ["og:image"]: "https://example.com/image.png",
      },
    ]);
  });

  test("fetch multiple ogp", () => {
    return expect(
      fetchOGP([
        "https://takahirohimi.github.io/ogp-fetcher/",
        "https://takahirohimi.github.io/ogp-fetcher/foo.html",
      ])
    ).resolves.toStrictEqual([
      {
        ["og:title"]: "title",
        ["og:description"]: "description",
        ["og:locale"]: "locale",
        ["og:type"]: "type",
        ["og:url"]: "https://example.com",
        ["og:image:width"]: "200",
        ["og:image:height"]: "100",
        ["og:image"]: "https://example.com/image.png",
      },
      {
        ["og:title"]: "footitle",
        ["og:description"]: "foodescription",
        ["og:locale"]: "foolocale",
        ["og:type"]: "footype",
        ["og:url"]: "https://example.com/foo",
        ["og:image:width"]: "300",
        ["og:image:height"]: "200",
        ["og:image"]: "https://example.com/foo.png",
      },
    ]);
  });
});
