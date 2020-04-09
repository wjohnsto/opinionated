import allSidesRatings from './data/allSidesRatings';
import swprsRatings from './data/swprsRatings';

let ratings = mergeKeys(swprsRatings, allSidesRatings);
type KeysOf<T> = [keyof T];

let ratingsKeys: KeysOf<typeof ratings> = <any>Object.keys(ratings);
let ratingsMap = {
    Left: '<<',
    'Lean Left': '<',
    Center: '<>',
    Mixed: '<~>',
    'Lean Right': '>',
    Right: '>>',
};

function mergeKeys<T, U>(a: T, b: U): T & U {
    let keys = Object.keys(b);
    let out = JSON.parse(JSON.stringify(a));

    for (let i = 0; i < keys.length; ++i) {
        let key = keys[i];

        out[key] = (<any>b)[key];
    }

    return out;
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

    let h = el.querySelector('h' + start);

    if (h) {
        return <HTMLHeadingElement>h;
    }

    return findHeader(el, start + 1);
}

function find_links() {
    let links = document.querySelectorAll('a');
    let regex = /(?:opinions?|editorials?)(?:[^\/]*)\//i;
    let urlPartRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/i;
    let loc = window.location.href;

    loc = loc.split('?')[0];

    if (regex.test(loc)) {
        return;
    }
    let locParts = urlPartRegex.exec(loc);

    if (!locParts) {
        return;
    }

    let host = locParts[2];

    links.forEach((link) => {
        if (!link.textContent) {
            link.textContent = '';
        }

        let url = link.href.split('?')[0];
        let rating = '';
        let urlParts = urlPartRegex.exec(url);

        if (!urlParts) {
            return;
        }

        let urlHost = urlParts[2];

        if (urlHost === host) {
            return;
        }

        for (let i = 0; i < ratingsKeys.length; ++i) {
            if (url.toLowerCase().indexOf(ratingsKeys[i].toLowerCase()) > -1) {
                rating =
                    (<any>ratingsMap)[ratings[ratingsKeys[i]].rating] || '';
            }
        }

        if (regex.test(url) && !/(?:twitter\.com|facebook\.com)/i.test(url)) {
            if (
                !/\[OPINIONATED\]/i.test(link.textContent) &&
                !(
                    /OPINION/i.test(link.textContent) ||
                    regex.test(link.textContent)
                )
            ) {
                let el = document.createElement('span');
                el.style.color = 'red';
                el.style.fontWeight = 'bold';
                el.textContent = '[OPINIONATED] ';

                let header = findHeader(link);

                if (header) {
                    header.insertBefore(el, header.firstChild);
                } else {
                    link.insertBefore(el, link.firstChild);
                }
            }
        } else if (rating && link.textContent.indexOf(rating) === -1) {
            let el = document.createElement('span');
            el.style.color = 'red';
            el.style.fontWeight = 'bold';

            if (rating) {
            } else {
            }
            el.textContent = '[' + rating + '] ';
            let header = findHeader(link);

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
        find_links();
    } catch (e) {}
}, 5000);

try {
    find_links();
} catch (e) {}
