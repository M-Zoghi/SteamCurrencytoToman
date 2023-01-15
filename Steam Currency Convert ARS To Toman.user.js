// ==UserScript==
// @name               Steam Currency Convert ARS To Toman
// @version            1.5
// @description        Converts ARS$ to Toman
// @author             M-Zoghi
// @namespace          SteamCurrencyConvertARSToToman
// @icon               http://store.steampowered.com/favicon.ico
// @match              http*://store.steampowered.com/*
// @require            http://code.jquery.com/jquery.min.js
// @grant              GM_xmlhttpRequest
// @connect            iraniansteam.ir
// @connect            steamcommunity.com
// @license            MIT License
// ==/UserScript==

var irsteamkeypriceglobal;
var irsteamkeypricecheck = false;
var marketsteamkeypriceglobal;

function GetKeyPriceIR() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://iraniansteam.ir/tf2',
        dataType: 'json',
        onload: LoadIRSteam,
    })
}

function LoadIRSteam(irsteamobject) {
    var irsteamparser = new DOMParser();
    var irsteamresponseDoc = irsteamparser.parseFromString(irsteamobject.responseText, "text/html");
    var irsteamfounddata = JSON.parse(irsteamresponseDoc.getElementById('__NEXT_DATA__').innerHTML);
    irsteamkeypriceglobal = Math.ceil(irsteamfounddata["props"]["pageProps"]["tf2"]["prices"]["keyPrice"].replace(',', '.'));
    console.log("%c[ARStoToman] " + "%cKey Price: " + irsteamkeypriceglobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    ARStoToman(labels);
    irsteamkeypricecheck = true;
}

GetKeyPriceIR();

function GetKeyPriceMarket() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=34',
        dataType: 'json',
        onload: LoadMarketSteam,
    })
}

function LoadMarketSteam(marketsteamobject) {
    var marketsteamparser = new DOMParser();
    var marketsteamresponseDoc = marketsteamparser.parseFromString(marketsteamobject.responseText, "text/html");
    var marketsteamfounddata = JSON.parse(marketsteamresponseDoc.querySelector("body").innerHTML);
    marketsteamkeypriceglobal = Math.floor(marketsteamfounddata["lowest_price"].replace('ARS$ ', '').replace(',', '.') * 0.87);
    console.log("%c[ARStoToman] " + "%cMarket Price: ARS$ " + marketsteamkeypriceglobal, "color:#2196F3; font-weight:bold;", "color:null");

}

GetKeyPriceMarket();

var labels = [
    'discount_original_price',
    'discount_final_price',
    'game_purchase_price',
    'game_area_dlc_price',
    'salepreviewwidgets_StoreSalePriceBox_3j4dI',
    'cart_estimated_total',
    'price'
];

function ARStoToman(labels) {
    var re = /(\D*)(\d\S*)/;
    for (label in labels) {
        let price = document.querySelectorAll(`.${labels[label]}`);
        if (price.length == 0)
            continue;
        for (ind in price) {
            if (re.test(price[ind].textContent)) {
                let matchItem = re.exec(price[ind].textContent);
                if (matchItem[1].indexOf('ARS') >= 0) {
                    let p = matchItem[2].replace('.', '').replace(',', '.');
                    var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                    var calpricefinal = (calpricesteam * irsteamkeypriceglobal).toLocaleString("en-US");
                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                }
            }
        }
    }
}

(function () {
    const findq = document.getElementById('ignoreBtn');
    if (findq) {
        var buykeybtn = document.createElement('a');
        buykeybtn.target = '_blank';
        buykeybtn.href = 'https://iraniansteam.ir/tf2/';
        buykeybtn.className = 'btnv6_blue_hoverfade btn_medium';
        buykeybtn.innerHTML = '<span>' + "Buy 🔑" + '</span>';
        findq.append(buykeybtn);
    }
})();

(function () {
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

$(window).on("scroll", function () {
    if (irsteamkeypricecheck === true) {
        ARStoToman(labels);
    }
})
