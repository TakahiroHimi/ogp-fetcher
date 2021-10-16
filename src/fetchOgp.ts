import axios, { AxiosRequestHeaders } from "axios";
import { JSDOM } from "jsdom";

/**
 *
 * @param targetUrls fetch target url list
 * @returns ogp list
 */
export const fetchOgp = async (targetUrls: string[]) => {
  const headers: AxiosRequestHeaders = { "User-Agent": "bot" };

  const fetches = targetUrls.map((url) => {
    return axios.get(encodeURI(url), { headers: headers });
  });

  const responses = await Promise.all(fetches);
  const htmlList = responses.reduce(
    (prev: { url: string; html: string }[], res) => {
      if (!res.config.url || typeof res.data !== "string") return prev;
      return [...prev, { url: res.config.url, html: res.data }];
    },
    []
  );

  const ogps = htmlList.map((html) => {
    return {
      url: html.url,
      ...parseOgp([html.html])[0],
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

    const ogps = ogpFilter(meta);

    return ogps;
  });

  return ogps;
};

/**
 *
 * @param metaElements filter target ogp list object
 * @returns ogp object
 */
export const ogpFilter = (metaElements: NodeListOf<HTMLMetaElement>) => {
  const ogps = [...Array(metaElements.length).keys()].reduce(
    (prev: { [key: string]: string }, i) => {
      const property = metaElements.item(i).getAttribute("property")?.trim();
      if (!property) return prev;
      const content = metaElements.item(i).getAttribute("content");

      return { ...prev, ...{ [property]: content ?? "" } };
    },
    {}
  );
  return ogps;
};

export default fetchOgp;
