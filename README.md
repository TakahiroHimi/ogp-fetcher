# ogp-fetcher

**A simple library for OGP fetching**

## Install

```bash
npm install ogp-fetcher
# or
yarn add ogp-fetcher
```

## Use

### Fetch and parse

```ts
import { fetchOgp } from "ogp-fetcher";

const fetch = async () => {
  const ogp = await fetchOgp(["https://github.com/", "https://facebook.com"]);
  console.log(ogp);
};

fetch();

//console
// [
//   {
//     url: 'https://github.com/',
//     'fb:app_id': '1401488693436528',
//     'og:image': 'https://github.githubassets.com/images/modules/site/social-cards/github-social.png',
//     'og:image:alt': 'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and feat...',
//     'og:site_name': 'GitHub',
//     'og:type': 'object',
//     'og:title': 'GitHub: Where the world builds software',
//     'og:url': 'https://github.com/',
//     'og:description': 'GitHub is where over 65 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories, review code like a pro, track bugs and feat...',
//     'og:image:type': 'image/png',
//     'og:image:width': '1200',
//     'og:image:height': '620'
//   },
//   {
//     url: 'https://facebook.com',
//     'og:site_name': 'Facebook',
//     'og:url': 'https://www.facebook.com/',
//     'og:image': 'https://www.facebook.com/images/fb_icon_325x325.png',
//     'og:locale': 'ja_JP'
//   }
// ]
```

### Parse only

```ts
import { parseOgp } from "ogp-fetcher";

const html = `
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

const ogp = parseOgp([html]);

console.log(ogp);

// console
// [
//   {
//     'og:title': 'title',
//     'og:description': 'description',
//     'og:locale': 'locale',
//     'og:type': 'type',
//     'og:url': 'https://example.com',
//     'og:image:width': '200',
//     'og:image:height': '100',
//     'og:image': 'https://example.com/image.png'
//   }
// ]
```
