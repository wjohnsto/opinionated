(() => {
    function find_links() {
        var links = document.querySelectorAll('a');

        links.forEach((link) => {
            var url = link.href;

            if (/opinions?\//.test(url) && !/\[Opinion\]/.test(link.textContent)) {
                link.textContent = '[Opinion] ' + link.textContent;
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
