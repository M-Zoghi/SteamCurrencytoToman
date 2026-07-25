// ==UserScript==
// @name               Steam Upcoming Iranian Date
// @version            1.2
// @description        Adds Iranian Date to Upcoming Games in Steam
// @author             EmZi
// @namespace          SteamUpcomingIranianDate
// @icon               http://store.steampowered.com/favicon.ico
// @match              http*://store.steampowered.com/*
// @updateURL          https://raw.githubusercontent.com/M-Zoghi/SteamCurrencytoToman/main/Steam%20Upcoming%20Iranian%20Date.user.js
// @downloadURL        https://raw.githubusercontent.com/M-Zoghi/SteamCurrencytoToman/main/Steam%20Upcoming%20Iranian%20Date.user.js
// @license            MIT License
// ==/UserScript==
(function () {
    'use strict';

    function convertStorePage() {
        var re = new RegExp("Coming (.*)");
        var re2 = new RegExp("Planned Release Date: (.*)");
        var boxes = document.getElementsByClassName("game_area_comingsoon game_area_bubble");
        if (boxes.length > 0) {
            var box = boxes[0];
            if (re.test(box.innerText)) {
                var findreleasedate = re.exec(box.innerText)[1];
                if (!/soon|Soon|SOON/.test(findreleasedate)) {
                    var convertdate = new Date(findreleasedate).toLocaleDateString('fa-IR-u-nu-latn');
                    box.innerHTML = box.innerHTML.replace("Coming " + findreleasedate, "Coming " + findreleasedate + " (" + convertdate + ")");
                }
            } else if (re2.test(box.innerText)) {
                var findreleasedate2 = re2.exec(box.innerText)[1];
                if (!/TBC|TBA|TBD|Q|TO|To|to|soon|Soon|SOON/.test(findreleasedate2)) {
                    var convertdate2 = new Date(findreleasedate2).toLocaleDateString('fa-IR-u-nu-latn');
                    box.innerHTML = box.innerHTML.replace("<span>" + findreleasedate2 + "</span>", "<span>" + findreleasedate2 + " (" + convertdate2 + ")</span>");
                }
            }
        }
    }

    var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    function resolveYear(monthIndex, now) {
        var year = now.getFullYear();
        var curMonth = now.getMonth();
        if (monthIndex < curMonth - 6) year += 1;
        if (monthIndex > curMonth + 6) year -= 1;
        return year;
    }

    var longDateRe = new RegExp("^(\\d{1,2})\\s+(" + MONTHS.join("|") + ")$");

    var shortDateRe = /^(\d{2})\/(\d{2})$/;

    function convertDateLabels() {
        var candidates = document.querySelectorAll('div');
        var now = new Date();

        for (var i = 0; i < candidates.length; i++) {
            var el = candidates[i];
            if (el.children.length > 0) continue;
            if (el.dataset.faDateAdded) continue;
            var text = el.textContent.trim();

            var m = longDateRe.exec(text);
            if (m) {
                var day = parseInt(m[1], 10);
                var monthIndex = MONTHS.indexOf(m[2]);
                var year = resolveYear(monthIndex, now);
                var faDate = new Date(year, monthIndex, day).toLocaleDateString('fa-IR-u-nu-latn');
                el.textContent = text + " (" + faDate + ")";
                el.dataset.faDateAdded = "1";
                continue;
            }

            var m2 = shortDateRe.exec(text);
            if (m2) {
                var day2 = parseInt(m2[1], 10);
                var monthIndex2 = parseInt(m2[2], 10) - 1;
                if (monthIndex2 < 0 || monthIndex2 > 11) continue;
                var year2 = resolveYear(monthIndex2, now);
                var faDate2 = new Date(year2, monthIndex2, day2).toLocaleDateString('fa-IR-u-nu-latn');
                el.textContent = text + " (" + faDate2 + ")";
                el.dataset.faDateAdded = "1";
            }
        }
    }

    function run() {
        convertStorePage();
        convertDateLabels();
    }

    run();

    var observer = new MutationObserver(function () {
        run();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
