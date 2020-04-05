(() => {
    function findHeader(el, start) {
        if(!start) {
            start = 1
        }

        if (start > 6) {
            return;
        }

        var h = el.querySelector('h' + start)

        if(h) {
           return h;
        }

        return findHeader(el, start+1);
    }

    function find_links() {
        var links = document.querySelectorAll('a');
        var regex = /(?:opinions?|editorials?)(?:\/|\.|$)/i;
        var loc = window.location.href;

        loc = loc.split('?')[0]

        if (regex.test(loc)) {
            return;
        }

        links.forEach((link) => {
            var url = link.href.split('?')[0];

            if (regex.test(url) && !/(?:twitter\.com|facebook\.com)/i.test(url) && !/\[OPINIONATED\]/i.test(link.textContent) && !(/OPINION/i.test(link.textContent) || regex.test(link.textContent))) {
                var el = document.createElement('span');
                el.style.color = 'red';
                el.style.fontWeight = 'bold';
                el.textContent = '[OPINIONATED] ';
                var header = findHeader(link);

                if(header) {
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
