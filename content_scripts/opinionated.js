(() => {
    function find_links() {
        var links = document.querySelectorAll('a');

        links.forEach((link) => {
            var url = link.href;

            if (/opinions?\//.test(url)) {
                link.textContent = '[Opinion] ' + link.textContent;
            }
        });
    }

    try {
        find_links();
    } catch (e) { }
})()
