import { JSDOM } from "jsdom";
import fetchOgp, {
  createFaviconSrcURL,
  fetchOgpFromMd,
  ogpFilter,
  parseOgp,
} from "../src/fetchOgp";

describe("src/fetchOgp", () => {
  test("fetchOgpFromMd", () => {
    return expect(fetchOgpFromMd(testMdText)).resolves.toStrictEqual([
      {
        url: "https://takahirohimi.github.io/ogp-fetcher/",
        ["icon"]: "https://takahirohimi.github.io/image/favicon.ico",
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
        ["icon"]: "https://takahirohimi.github.io/image/favicon.ico",
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

  test("fetchOgp", () => {
    return expect(
      fetchOgp(["https://takahirohimi.github.io/ogp-fetcher/"])
    ).resolves.toStrictEqual([
      {
        url: "https://takahirohimi.github.io/ogp-fetcher/",
        ["icon"]: "https://takahirohimi.github.io/image/favicon.ico",
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

  test("fetchOgp-non-existent-URL", () => {
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

  test("fetchOgp-multiple", () => {
    return expect(
      fetchOgp([
        "https://takahirohimi.github.io/ogp-fetcher/",
        "https://takahirohimi.github.io/ogp-fetcher/foo.html",
      ])
    ).resolves.toStrictEqual([
      {
        url: "https://takahirohimi.github.io/ogp-fetcher/",
        ["icon"]: "https://takahirohimi.github.io/image/favicon.ico",
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
        ["icon"]: "https://takahirohimi.github.io/image/favicon.ico",
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

  test("fetchOgp-multiple-contains-non-existent-URL", () => {
    return expect(
      fetchOgp([
        "https://takahirohimi.github.io/ogp-fetcher/",
        "https://takahirohimi.github.io/ogp-fetcher/foo.html",
        "https://takahirohimi.github.io/ogp-fetcher/non-existent-page.html",
      ])
    ).resolves.toStrictEqual([
      {
        url: "https://takahirohimi.github.io/ogp-fetcher/",
        ["icon"]: "https://takahirohimi.github.io/image/favicon.ico",
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
        ["icon"]: "https://takahirohimi.github.io/image/favicon.ico",
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

  test("parseOgp", () => {
    return expect(
      parseOgp([{ url: "https://example.com", html: testHtmlTextIndex }])
    ).toStrictEqual([
      {
        ["icon"]: "https://example.com/image/favicon.ico",
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

  test("parseOgp-multiple", () => {
    return expect(
      parseOgp([
        { url: "https://example.com", html: testHtmlTextIndex },
        { url: "", html: testHtmlTextFoo },
      ])
    ).toStrictEqual([
      {
        ["icon"]: "https://example.com/image/favicon.ico",
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
        ["icon"]: "/image/favicon.ico",
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

  test("ogpFilter", () => {
    const dom = new JSDOM(testHtmlTextIndex);
    const meta = dom.window.document.head.querySelectorAll("meta");

    return expect(
      ogpFilter({ url: "https://example.com", elements: Array.from(meta) })
    ).toStrictEqual({
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

  test("createURL", () => {
    return expect(
      createFaviconSrcURL("https://example.com/foo/bar", "/image/icon.png")
    ).toBe("https://example.com/image/icon.png");
  });

  test("createURL", () => {
    return expect(
      createFaviconSrcURL("https://example.com/foo/bar", "image/icon.png")
    ).toBe("https://example.com/foo/image/icon.png");
  });

  test("createURL", () => {
    return expect(
      createFaviconSrcURL("https://example.com/foo/bar", "icon.png")
    ).toBe("https://example.com/foo/icon.png");
  });

  test("createURL", () => {
    return expect(
      createFaviconSrcURL(
        "https://example.com/foo/bar",
        "https://example.hoge.com/image/icon.png"
      )
    ).toBe("https://example.hoge.com/image/icon.png");
  });

  test("createURL", () => {
    return expect(
      createFaviconSrcURL(
        "https://example.com/foo/bar",
        "//example.hoge.com/image/icon.png"
      )
    ).toBe("https://example.hoge.com/image/icon.png");
  });

  test("createURL", () => {
    return expect(createFaviconSrcURL("", "foo")).toBe("foo");
  });
});

const testMdText = `
# Test

## Index

<https://takahirohimi.github.io/ogp-fetcher/>  

**Foo**
<https://takahirohimi.github.io/ogp-fetcher/foo.html>

`;

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
    <link rel="icon" href="/image/favicon.ico">
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
    <link rel="shortcut icon" href="/image/favicon.ico">
    <title>foo</title>
  </head>
  <body>
    <h1>foo</h1>
  </body>
</html>
`;
