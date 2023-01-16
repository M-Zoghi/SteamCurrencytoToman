// ==UserScript==
// @name               Steam Upcoming Iranian Date
// @version            1.0
// @description        Adds Iranian Date to Upcoming Games in Steam
// @author             M-Zoghi
// @namespace          SteamUpcomingIranianDate
// @icon               http://store.steampowered.com/favicon.ico
// @match              http*://store.steampowered.com/*
// @license            MIT License
// ==/UserScript==

(function () {
    'use strict';
    var re = new RegExp("Coming (.*)");
    var re2 = new RegExp("Planned Release Date: (.*)");
    var checkcomingsoon = document.getElementsByClassName("game_area_comingsoon game_area_bubble");
    if (checkcomingsoon.length > 0) {
        if (re.test(document.getElementsByClassName("game_area_comingsoon game_area_bubble")[0].innerText)) {
            var findreleasedate = re.exec(document.getElementsByClassName("game_area_comingsoon game_area_bubble")[0].innerText)[1];
            if (!/soon|Soon|SOON/.test(findreleasedate)) {
                var convertdate = new Date(findreleasedate).toLocaleDateString('fa-IR-u-nu-latn');
                var appenddate = document.getElementsByClassName("game_area_comingsoon game_area_bubble")[0].innerHTML = (document.getElementsByClassName("game_area_comingsoon game_area_bubble")[0].innerHTML).replace("Coming " + findreleasedate, "Coming " + findreleasedate + " (" + convertdate + ")");
            }
        } else if (re2.test(document.getElementsByClassName("game_area_comingsoon game_area_bubble")[0].innerText)) {
            var findreleasedate2 = re2.exec(document.getElementsByClassName("game_area_comingsoon game_area_bubble")[0].innerText)[1];
            if (!/TBC|TBA|TBD|Q|TO|To|to|soon|Soon|SOON/.test(findreleasedate2)) {
                var convertdate2 = new Date(findreleasedate2).toLocaleDateString('fa-IR-u-nu-latn');
                var appenddate2 = document.getElementsByClassName("game_area_comingsoon game_area_bubble")[0].innerHTML = (document.getElementsByClassName("game_area_comingsoon game_area_bubble")[0].innerHTML).replace("<span>" + findreleasedate2 + "</span>", "<span>" + findreleasedate2 + " (" + convertdate2 + ")</span>");
            }
        }
    }
})();