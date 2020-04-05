(() => {
    function find_links() {
        var links = document.querySelectorAll('a');
        var regex = /(?:opinions?|editorials?)(?:\/|\.|$)/i;
        var location = window.location.href;

        if (regex.test(location)) {
            return;
        }

        links.forEach((link) => {
            var url = link.href;

            if (regex.test(url) && !(/OPINION/i.test(link.textContent) && !regex.test(link.textContent)) {
                var el = document.createElement('span');
                el.style.color = 'red';
                el.style.fontWeight = 'bold';
                el.textContent = '[OPINIONATED] ';
                link.insertBefore(el, link.firstChild);
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
