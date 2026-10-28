/* The header's only action opens an outline of the actual H2/H3 headings. */
(function () {
    'use strict';
    var popover = document.getElementById('contents-popover');
    var list = popover;
    var button = document.querySelector('.contents-button');
    if (!popover || !list || !button) { return; }
    var headings = document.querySelectorAll('main h2, main h3');
    var fragment = document.createDocumentFragment();
    headings.forEach(function (heading, index) {
        if (!heading.id) {
            var id = 'section-' + (index + 1);
            while (document.getElementById(id)) { id += '-heading'; }
            heading.id = id;
        }
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        item.appendChild(link);
        fragment.appendChild(item);
    });
    list.replaceChildren(fragment);
    button.setAttribute('aria-disabled', String(!headings.length));
    function positionPopover() {
        var header = document.getElementById('mainNav').getBoundingClientRect();
        popover.style.setProperty('--contents-top', header.bottom + 'px');
        popover.style.setProperty('--contents-right', Math.max(0, innerWidth - button.getBoundingClientRect().right) + 'px');
    }
    button.addEventListener('click', function (event) {
        event.preventDefault();
        if (headings.length) { positionPopover(); popover.togglePopover(); }
    });
    window.addEventListener('resize', positionPopover);
    button.addEventListener('keydown', function (event) {
        if (event.key === ' ') { event.preventDefault(); button.click(); }
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && popover.matches(':popover-open')) {
            event.preventDefault();
            popover.hidePopover();
            button.focus();
        }
    });
    popover.addEventListener('toggle', function (event) {
        button.setAttribute('aria-expanded', String(event.newState === 'open'));
    });
    list.addEventListener('click', function (event) {
        var link = event.target.closest('a');
        if (!link) { return; }
        var heading = document.getElementById(link.hash.slice(1));
        if (!heading) { return; }
        event.preventDefault();
        popover.hidePopover();
        var headerHeight = document.getElementById('mainNav').getBoundingClientRect().height;
        window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top - headerHeight });
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
        history.replaceState(null, '', link.hash);
    });
}());
