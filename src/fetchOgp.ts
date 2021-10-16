import axios, { AxiosRequestHeaders } from "axios";
import { JSDOM } from "jsdom";

/**
 *
 * @param targetUrls
 * @returns ogp list
 */
export const fetchOgp = async (targetUrls: string[]) => {
  const headers: AxiosRequestHeaders = { "User-Agent": "bot" };

  const fetches = targetUrls.map((url) => {
    return axios.get(encodeURI(url), { headers: headers });
  });

  const responses = await Promise.all(fetches);
  const htmlList = responses.reduce((prev: string[], res) => {
    if (typeof res.data !== "string") return prev;
    return [...prev, res.data];
  }, []);

  const ogps = parseOgp(htmlList);

  return ogps;
};

/**
 *
 * @param htmlList
 * @returns ogp list
 */
export const parseOgp = (htmlList: string[]) => {
  const ogps = htmlList.reduce((prev: { [key: string]: string }[], html) => {
    const dom = new JSDOM(html);
    const meta = dom.window.document.head.querySelectorAll("meta");

    const ogps = ogpFilter(meta);

    return [...prev, ogps];
  }, []);

  return ogps;
};

/**
 *
 * @param metaElements
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
