import axios, { AxiosRequestHeaders } from "axios";
import { JSDOM } from "jsdom";

export type OGPFetchResult = {
  url: string;
  [key: string]: string;
}[];

/**
 * fetch and parse ogp from targetUrls
 * @param targetUrls fetch target url list
 * @returns ogp list
 */
export const fetchOgp = async (
  targetUrls: string[]
): Promise<OGPFetchResult> => {
  const headers: AxiosRequestHeaders = { "User-Agent": "bot" };

  const fetches = targetUrls.map((url) => {
    return axios
      .get<{ data: string }>(encodeURI(url), {
        headers: headers,
      })
      .catch(() => {
        return undefined;
      });
  });

  const responses = await Promise.all(fetches);

  const targets = responses.reduce(
    (prev: { url: string; html?: string }[], res, i) => {
      const url = targetUrls[i] ?? "";
      if (!res?.data || typeof res?.data !== "string")
        return [...prev, { url: url }];
      return [...prev, { url: url, html: res.data }];
    },
    []
  );

  const ogps = targets.map((target) => {
    return {
      url: target.url,
      ...parseOgp([{ url: target.url, html: target.html ?? "" }])[0],
    };
  });

  return ogps;
};

/**
 * parse ogp from targets
 * @param targets List of html to parse. If you want to get the URL of the icon as an absolute path, set url.
 * @returns ogp list
 */
export const parseOgp = (targets: { url?: string; html: string }[]) => {
  const ogps = targets.map((target) => {
    const dom = new JSDOM(target.html);
    const meta = dom.window.document.head.querySelectorAll("meta");
    const link = dom.window.document.head.querySelectorAll("link");

    const ogps = ogpFilter({
      url: target.url,
      elements: [...Array.from(meta), ...Array.from(link)],
    });

    return ogps;
  });

  return ogps;
};

/**
 * return ogp object
 * @param target filter target ogp list object
 * @returns ogp object
 */
export const ogpFilter = (target: {
  url?: string;
  elements: (HTMLMetaElement | HTMLLinkElement)[];
}) => {
  const ogps = [...Array(target.elements.length).keys()].reduce(
    (prev: { [property: string]: string }, i) => {
      const element = target.elements[i];
      if (!element) return prev;

      if (element.tagName === "META") {
        const property = element.getAttribute("property")?.trim();
        if (!property) return prev;
        const content = element.getAttribute("content");
        return { ...prev, ...{ [property]: content ?? "" } };
      } else if (element.tagName === "LINK") {
        const rel = element.getAttribute("rel");
        if (!rel || !["icon", "shortcut icon"].includes(rel)) return prev;
        const href = element.getAttribute("href");
        if (!href) return prev;
        return {
          ...prev,
          ...{
            ["icon"]: target.url ? createFaviconSrcURL(target.url, href) : href,
          },
        };
      }

      return prev;
    },
    {}
  );
  return ogps;
};

/**
 * create url for favicon src
 * @param url target url
 * @param href favicon link tag's href
 * @returns url for favicon image src
 */
export const createFaviconSrcURL = (url: string, href: string) => {
  try {
    const result = new URL(href, url);
    return result.toString();
  } catch {
    return href;
  }
};

export default fetchOgp;
