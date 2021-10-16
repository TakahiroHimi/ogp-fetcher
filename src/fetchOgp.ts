import axios, { AxiosRequestHeaders } from "axios";
import { JSDOM } from "jsdom";

export const fetchOgp = async (targetUrls: string[]) => {
  const headers: AxiosRequestHeaders = { "User-Agent": "bot" };

  const fetches = targetUrls.map((url) => {
    return axios.get(encodeURI(url), { headers: headers });
  });

  const responses = await Promise.all(fetches);

  const ogpsList = responses.reduce(
    (prev: { [key: string]: string }[], res) => {
      if (typeof res.data !== "string") return prev;
      const dom = new JSDOM(res.data);
      const meta = dom.window.document.head.querySelectorAll("meta");

      const ogps = ogpFilter(meta);

      return [...prev, ogps];
    },
    []
  );

  return ogpsList;
};

const ogpFilter = (metaElements: NodeListOf<HTMLMetaElement>) => {
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
