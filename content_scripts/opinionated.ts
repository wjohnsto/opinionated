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
const ignoreUrls = ['dropbox.com', 'docs.google.com', 'sharepoint.com'];
const ignoreLinks = ['twitter.com', 'facebook.com', 'linkedin.com'];

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

function findLinks() {
    const links = document.querySelectorAll('a');
    const regex = /(?:opinions?|editorials?)(?:[^\/]*)\//i;
    const urlPartRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/i;
    let loc = window.location.href;

    loc = loc.split('?')[0];

    if (regex.test(loc)) {
        return;
    }

    let ignore = contains(ignoreUrls, loc);

    if (ignore) {
        return;
    }

    const locParts = urlPartRegex.exec(loc);

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
        const urlParts = urlPartRegex.exec(url);

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

        if (regex.test(url)) {
            if (
                !/\[OPINIONATED\]/i.test(textContent) &&
                !(
                    /OPINION/i.test(textContent) ||
                    regex.test(textContent)
                )
            ) {
                const el = document.createElement('span');
                el.style.color = 'red';
                el.style.fontWeight = 'bold';
                el.textContent = '[OPINIONATED] ';

                const header = findHeader(link);

                if (header) {
                    header.insertBefore(el, header.firstChild);
                } else {
                    link.insertBefore(el, link.firstChild);
                }
            }
        } else if (rating && textContent.indexOf(rating) === -1) {
            const el = document.createElement('span');
            el.style.color = 'red';
            el.style.fontWeight = 'bold';

            if (rating) {
            } else {
            }
            el.textContent = '[' + rating + '] ';
            const header = findHeader(link);

            if (header) {
                header.insertBefore(el, header.firstChild);
            } else {
                link.insertBefore(el, link.firstChild);
            }
        }
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
