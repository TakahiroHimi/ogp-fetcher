import axios, { AxiosRequestHeaders } from "axios";
import { JSDOM } from "jsdom";

export type OGPFetchResult = {
  url: string;
  [key: string]: string;
}[];

/**
 *
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
      ...parseOgp([target.html ?? ""])[0],
    };
  });

  return ogps;
};

/**
 *
 * @param htmlList fetch target url text list
 * @returns ogp list
 */
export const parseOgp = (htmlList: string[]) => {
  const ogps = htmlList.map((html) => {
    const dom = new JSDOM(html);
    const meta = dom.window.document.head.querySelectorAll("meta");
    const link = dom.window.document.head.querySelectorAll("link");

    const ogps = ogpFilter([...Array.from(meta), ...Array.from(link)]);

    return ogps;
  });

  return ogps;
};

/**
 *
 * @param metaElements filter target ogp list object
 * @returns ogp object
 */
export const ogpFilter = (elements: (HTMLMetaElement | HTMLLinkElement)[]) => {
  const ogps = [...Array(elements.length).keys()].reduce(
    (prev: { [property: string]: string }, i) => {
      if (elements[i]?.tagName === "META") {
        const property = elements[i]?.getAttribute("property")?.trim();
        if (!property) return prev;
        const content = elements[i]?.getAttribute("content");
        return { ...prev, ...{ [property]: content ?? "" } };
      } else {
        const rel = elements[i]?.getAttribute("rel");
        if (!rel || !["icon", "shortcut icon"].includes(rel)) return prev;
        const href = elements[i]?.getAttribute("href");
        if (!href) return prev;
        return { ...prev, ...{ ["icon"]: href } };
      }
    },
    {}
  );
  return ogps;
};

export default fetchOgp;
