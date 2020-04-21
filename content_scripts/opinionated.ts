import allSidesData from './data/allsides_data.json';
import allSidesRatings from './data/allSidesRatings';
import swprsRatings from './data/swprsRatings';

function mergeKeys<T, U>(a: T, b: U): T & U {
    const keys = Object.keys(b);
    const out = JSON.parse(JSON.stringify(a));

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];

        out[key] = (b as any)[key];
    }

    return out;
}

function getUrlParts(url: string) {
    return /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/i.exec(url);
}

const ratings = mergeKeys(swprsRatings, allSidesRatings);

type KeysOf<T> = [keyof T];

const ratingsKeys: KeysOf<typeof ratings> = Object.keys(ratings) as any;
const ratingsMap = {
    Left: '<<',
    'Lean Left': '<',
    Center: '<>',
    Mixed: '<~>',
    'Lean Right': '>',
    Right: '>>',
};
const ratingsNumbersMap: { [key: string]: string; } = {
    '71': 'Left',
    '72': 'Lean Left',
    '73': 'Center',
    '74': 'Lean Right',
    '75': 'Right',
    '2707': 'Mixed',
    // 2690: 'Not Yet Rated',
};
const opinionRegex = /(?:opinions?|editorials?)(?:[^\/]*)\//i;

const ignoreUrls = ['dropbox.com', 'docs.google.com', 'sharepoint.com'];
const ignoreLinks = ['twitter.com', 'facebook.com', 'linkedin.com'];

for (let i = 0; i < allSidesData.length; ++i) {
    let dataSource = allSidesData[i];
    let parts = getUrlParts(dataSource.url);

    if (!parts || !parts[2]) {
        continue;
    }

    let shortUrl = parts[2].replace('www.', '');

    if (opinionRegex.test(shortUrl)) {
        continue;
    }

    (ratings as any)[shortUrl] = {
        rating: ratingsNumbersMap[dataSource.bias_rating as any],
        titla: dataSource.news_source,
        url: dataSource.url,
    };
}

function findHeader(
    el: HTMLElement,
    start?: number
): HTMLHeadingElement | void {
    if (!start) {
        start = 1;
    }

    if (start > 6) {
        return;
    }

    const h = el.querySelector('h' + start);

    if (h) {
        return h as HTMLHeadingElement;
    }

    return findHeader(el, start + 1);
}

function contains(arr: string[], str: string) {
    return arr.some((value) => {
        return str.indexOf(value) > -1;
    });
}

function applyBias(rating: string, textContent: string, link: HTMLAnchorElement) {
    if (rating && textContent.indexOf(rating) === -1) {
        const el = document.createElement('span');
        el.style.color = 'red';
        el.style.fontWeight = 'bold';
        if (rating) {
        }
        else {
        }
        el.textContent = '[' + rating + '] ';
        const header = findHeader(link);
        if (header) {
            header.insertBefore(el, header.firstChild);
        }
        else {
            link.insertBefore(el, link.firstChild);
        }
    }
}

function applyOpinionated(textContent: string, link: HTMLAnchorElement) {
    if (!/\[OPINIONATED\]/i.test(textContent) &&
        !(/OPINION/i.test(textContent) ||
            opinionRegex.test(textContent))) {
        const el = document.createElement('span');
        el.style.color = 'red';
        el.style.fontWeight = 'bold';
        el.textContent = '[OPINIONATED] ';
        const header = findHeader(link);
        if (header) {
            header.insertBefore(el, header.firstChild);
        }
        else {
            link.insertBefore(el, link.firstChild);
        }
    }
}

function findLinks() {
    const links = document.querySelectorAll('a');

    let loc = window.location.href;

    loc = loc.split('?')[0];

    if (opinionRegex.test(loc)) {
        return;
    }

    let ignore = contains(ignoreUrls, loc);

    if (ignore) {
        return;
    }

    const locParts = getUrlParts(loc);

    if (!locParts) {
        return;
    }

    const host = locParts[2];

    links.forEach((link) => {
        let textContent = link.textContent;

        if (!textContent) {
            textContent = '';
        }

        const url = link.href.split('?')[0];
        ignore = contains(ignoreLinks, url);

        if (ignore || !!link.querySelector('img')) {
            return;
        }

        let rating = '';
        const urlParts = getUrlParts(url);

        if (!urlParts) {
            return;
        }

        const urlHost = urlParts[2];

        if (urlHost === host) {
            return;
        }

        for (let i = 0; i < ratingsKeys.length; ++i) {
            if (url.toLowerCase().indexOf(ratingsKeys[i].toLowerCase()) > -1) {
                rating =
                    (ratingsMap as any)[ratings[ratingsKeys[i]].rating] || '';
            }
        }

        if (opinionRegex.test(url)) {
            applyOpinionated(textContent, link);

            return;
        } else if (urlHost.indexOf('marketwatch') > -1) {
            fetch(url).then((result) => {
                return result.text();
            }).then((text) => {
                let m = text.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/im);

                if (!m) {
                    applyBias(rating, textContent as string, link);
                    return;
                }

                const ldJson = JSON.parse(m[1]);

                if (!ldJson || !Array.isArray(ldJson.keywords)) {
                    applyBias(rating, textContent as string, link);
                    return;
                }

                const isOpinion = (ldJson.keywords as string[]).some((keyword) => {
                    return /(?:opinions?|editorials?)/.test(keyword);
                });

                if (isOpinion) {
                    applyOpinionated(textContent as string, link);

                    return;
                }
            });

            return;
        }

        applyBias(rating, textContent, link);
    });
}

setInterval(() => {
    try {
        findLinks();
    } catch (e) {}
}, 3000);

try {
    findLinks();
} catch (e) {}
