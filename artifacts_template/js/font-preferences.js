/* Allow visitors to replace the IPA-derived Song face with a local original. */
(function () {
    'use strict';
    var key = 'prompt-song-font';
    var choice = 'lxgw';
    try { choice = localStorage.getItem(key) === 'ipa' ? 'ipa' : 'lxgw'; } catch (_) {}
    document.documentElement.dataset.songFont = choice;
    document.addEventListener('DOMContentLoaded', function () {
        var select = document.getElementById('songFontPreference');
        if (!select) { return; }
        select.value = choice;
        select.addEventListener('change', function () {
            document.documentElement.dataset.songFont = select.value;
            try { localStorage.setItem(key, select.value); } catch (_) {}
        });
    });
}());
