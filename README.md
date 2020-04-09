The purpose of this addon is to inform you when a link location is an opinion article. Most popular news sites have opinion blogs, and you don't want to confuse those articles with reporting articles. The addon will add "[OPINIONATED]" to the text content of every identified URL that links to an opinion article.

Alternatively if an opinion article is not linked, this addon will use a curated list from https://www.allsides.com to indicate the bias of a news source:

    1. "[<<]" = Left
    2. "[<]"  = Lean Left
    3. "[<>]" = Center
    3. "[<~>]" = Mixed
    4. "[>]"  = Lean Right
    5. "[>>]" = Right

The final place where this addon will look is from [Swiss Propaganda Research](https://swprs.org/media-navigator/). [This image](https://imgur.com/yp4Qtwz) contains the breakdown from SWPRS, and is merged into the AllSides ratings to fill in blanks.

# Instructions

## Installation

```
npm install
```

## Scripts

- `npm test`: Build files and run `web-ext run`
- `npm build`: Build files and run `web-ext build`

## Contributors

- [freeAgent85](https://github.com/freeAgent85)
