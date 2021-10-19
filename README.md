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
  const ogp = await fetchOgp(["https://github.com", "https://facebook.com"]);
  console.log(ogp);
};

fetch();
//console
// [
//   {
//     url: 'https://github.com',
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
//     'og:image:height': '620',
//     icon: 'https://github.githubassets.com/favicons/favicon.svg'
//   },
//   {
//     url: 'https://facebook.com',
//     'og:site_name': 'Facebook',
//     'og:url': 'https://www.facebook.com/',
//     'og:image': 'https://www.facebook.com/images/fb_icon_325x325.png',
//     'og:locale': 'ja_JP',
//     icon: 'https://static.xx.fbcdn.net/rsrc.php/yv/r/B8BxsscfVBr.ico'
//   }
// ]
```

### Parse only

By default, the URL of the favicon is retrieved as a relative path, but you can retrieve it as an absolute path by setting the URL.

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
    <link rel="icon" href="/image/favicon.ico">
    <title>Hello World</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
`;

const withRelativeIconPath = parseOgp([{ html: html }]);
console.log(withRelativeIconPath);
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
//     'og:image': 'https://example.com/image.png',
//     icon: '/image/favicon.ico'
//   }
// ]

const withAbsoluteIconPath = parseOgp([
  { url: "https://example.com", html: html },
]);
console.log(withAbsoluteIconPath);
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
//     'og:image': 'https://example.com/image.png',
//     icon: 'https://example.com/image/favicon.ico'
//   }
// ]
```

### Fetch and parse from Md

By default, the regular expression `/^<(https:\/\/.*?)> *?$/gims`, but you can also customize the regular expression.

```ts
import { fetchOgpFromMd } from "ogp-fetcher";

const md = `
# TestMd

## GitHub
<https://github.com>  

**Facebook**
<https://facebook.com>

### npm
@https://www.npmjs.com/

`;

const fetch = async () => {
  const ogp = await fetchOgpFromMd(md);
  console.log(ogp);
};

fetch();
// console
// [
//   {
//     url: 'https://github.com',
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
//     'og:image:height': '620',
//     icon: 'https://github.githubassets.com/favicons/favicon.svg'
//   },
//   {
//     url: 'https://facebook.com',
//     'og:site_name': 'Facebook',
//     'og:url': 'https://www.facebook.com/',
//     'og:image': 'https://www.facebook.com/images/fb_icon_325x325.png',
//     'og:locale': 'ja_JP',
//     icon: 'https://static.xx.fbcdn.net/rsrc.php/yv/r/B8BxsscfVBr.ico'
//   }
// ]

const fetchCustomReg = async () => {
  const ogp = await fetchOgpFromMd(md, /^@(https:\/\/.*?) *?$/gims);
  console.log(ogp);
};

fetchCustomReg();
// console
// [
//   {
//     url: 'https://www.npmjs.com/',
//     'og:image': 'https://static.npmjs.com/338e4905a2684ca96e08c7780fc68412.png',
//     icon: 'https://static.npmjs.com/da3ab40fb0861d15c83854c29f5f2962.png'
//   }
// ]
```
