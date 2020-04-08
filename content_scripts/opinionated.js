
(() => {
    var allSidesRatings = window.allSidesRatings;
    var swprsRatings = window.swprsRatings;
    var ratings = mergeKeys(swprsRatings, allSidesRatings);
    console.log(ratings);
    var ratingsKeys = Object.keys(ratings);
    var ratingsMap = {
        'Left': '<<',
        'Lean Left': '<',
        'Center': '<>',
        'Mixed': '<~>',
        'Lean Right': '>',
        'Right': '>>'
    };

    function mergeKeys(a, b) {
        var keys = Object.keys(b);
        var out = JSON.parse(JSON.stringify(a));

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];

            out[key] = b[key];
        }

        return out;
    }

    function findHeader(el, start) {
        if (!start) {
            start = 1
        }

        if (start > 6) {
            return;
        }

        var h = el.querySelector('h' + start)

        if (h) {
            return h;
        }

        return findHeader(el, start + 1);
    }

    function find_links() {
        var links = document.querySelectorAll('a');
        var regex = /(?:opinions?|editorials?)(?:[^\/]*)\//i;
        var loc = window.location.href;

        loc = loc.split('?')[0]

        if (regex.test(loc)) {
            return;
        }

        var locParts = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/i.exec(loc);
        var host = locParts[2];

        links.forEach((link) => {
            var url = link.href.split('?')[0];
            var rating = '';
            var urlParts = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/i.exec(url);

            if (!urlParts) {
                return;
            }

            var urlHost = urlParts[2];


            if (urlHost === host) {
                return;
            }

            for (var i = 0; i < ratingsKeys.length; ++i) {
                if (url.toLowerCase().indexOf(ratingsKeys[i].toLowerCase()) > -1) {
                    rating = ratingsMap[ratings[ratingsKeys[i]].rating] || '';
                }
            }

            if (regex.test(url) && !/(?:twitter\.com|facebook\.com)/i.test(url)) {
                if (!/\[OPINIONATED\]/i.test(link.textContent) && !(/OPINION/i.test(link.textContent) || regex.test(link.textContent))) {
                    var el = document.createElement('span');
                    el.style.color = 'red';
                    el.style.fontWeight = 'bold';
                    el.textContent = '[OPINIONATED] ';

                    var header = findHeader(link);

                    if (header) {
                        header.insertBefore(el, header.firstChild);
                    } else {
                        link.insertBefore(el, link.firstChild);
                    }
                }
            } else if (rating && link.textContent.indexOf(rating) === -1) {
                var el = document.createElement('span');
                el.style.color = 'red';
                el.style.fontWeight = 'bold';

                if (rating) {

                } else {

                }
                el.textContent = '[' + rating + '] ';
                var header = findHeader(link);

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
        } catch (e) { }
    }, 5000);

    try {
        find_links();
    } catch (e) { }
})();

var links = [{ href: 'foo', textContent: 'bar' }]

links.reduce((hash, current) => {
    var parts = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/i.exec(current.href);

    hash[parts[2].replace('www.', '')] = {
        title: current.textContent,
        url: current.href,
        rating: ''
    };

    return hash;
}, {})
