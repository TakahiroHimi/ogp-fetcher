import { JSDOM } from "jsdom";
import fetchOgp, { ogpFilter, parseOgp } from "../src/fetchOgp";

describe("test", () => {
  test("fetch ogp", () => {
    return expect(
      fetchOgp(["https://takahirohimi.github.io/ogp-fetcher/"])
    ).resolves.toStrictEqual([
      {
        url: "https://takahirohimi.github.io/ogp-fetcher/",
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

  test("fetch ogp　non-existent URL", () => {
    return expect(
      fetchOgp([
        "https://takahirohimi.github.io/ogp-fetcher/non-existent-page.html",
      ])
    ).resolves.toStrictEqual([
      {
        url: "https://takahirohimi.github.io/ogp-fetcher/non-existent-page.html",
      },
    ]);
  });

  test("fetch multiple ogp", () => {
    return expect(
      fetchOgp([
        "https://takahirohimi.github.io/ogp-fetcher/",
        "https://takahirohimi.github.io/ogp-fetcher/foo.html",
      ])
    ).resolves.toStrictEqual([
      {
        url: "https://takahirohimi.github.io/ogp-fetcher/",
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
        url: "https://takahirohimi.github.io/ogp-fetcher/foo.html",
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

  test("fetch multiple ogp contains a non-existent URL", () => {
    return expect(
      fetchOgp([
        "https://takahirohimi.github.io/ogp-fetcher/",
        "https://takahirohimi.github.io/ogp-fetcher/foo.html",
        "https://takahirohimi.github.io/ogp-fetcher/non-existent-page.html",
      ])
    ).resolves.toStrictEqual([
      {
        url: "https://takahirohimi.github.io/ogp-fetcher/",
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
        url: "https://takahirohimi.github.io/ogp-fetcher/foo.html",
        ["og:title"]: "footitle",
        ["og:description"]: "foodescription",
        ["og:locale"]: "foolocale",
        ["og:type"]: "footype",
        ["og:url"]: "https://example.com/foo",
        ["og:image:width"]: "300",
        ["og:image:height"]: "200",
        ["og:image"]: "https://example.com/foo.png",
      },
      {
        url: "https://takahirohimi.github.io/ogp-fetcher/non-existent-page.html",
      },
    ]);
  });

  test("parse ogp", () => {
    return expect(parseOgp([testHtmlTextIndex])).toStrictEqual([
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

  test("parse multiple ogp", () => {
    return expect(parseOgp([testHtmlTextIndex, testHtmlTextFoo])).toStrictEqual(
      [
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
      ]
    );
  });

  test("ogp filter", () => {
    const dom = new JSDOM(testHtmlTextIndex);
    const meta = dom.window.document.head.querySelectorAll("meta");

    return expect(ogpFilter(meta)).toStrictEqual({
      ["og:title"]: "title",
      ["og:description"]: "description",
      ["og:locale"]: "locale",
      ["og:type"]: "type",
      ["og:url"]: "https://example.com",
      ["og:image:width"]: "200",
      ["og:image:height"]: "100",
      ["og:image"]: "https://example.com/image.png",
    });
  });
});

const testHtmlTextIndex = `
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta property="og:title" content="title" />
    <meta property="og:description" content="description" />
    <meta property="og:locale" content="locale" />
    <meta property="og:type" content="type" />
    <meta property="og:url" content="https://example.com" />
    <meta property="og:image:width" content="200" />
    <meta property="og:image:height" content="100" />
    <meta property="og:image" content="https://example.com/image.png" />
    <title>Hello World</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
`;

const testHtmlTextFoo = `
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta property="og:title" content="footitle" />
    <meta property="og:description" content="foodescription" />
    <meta property="og:locale" content="foolocale" />
    <meta property="og:type" content="footype" />
    <meta property="og:url" content="https://example.com/foo" />
    <meta property="og:image:width" content="300" />
    <meta property="og:image:height" content="200" />
    <meta property="og:image" content="https://example.com/foo.png" />
    <title>foo</title>
  </head>
  <body>
    <h1>foo</h1>
  </body>
</html>
`;
