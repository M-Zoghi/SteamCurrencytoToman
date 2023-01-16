// ==UserScript==
// @name               Steam Currency TL To Toman
// @version            1.0
// @description        Converts TL to Toman
// @author             M-Zoghi
// @namespace          SteamCurrencyConvertTLToToman
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
    console.log("%c[TLtoToman] " + "%cKey Price: " + irsteamkeypriceglobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    TLtoToman(labels);
    irsteamkeypricecheck = true;
}

GetKeyPriceIR();

function GetKeyPriceMarket() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=17',
        dataType: 'json',
        onload: LoadMarketSteam,
    })
}

function LoadMarketSteam(marketsteamobject) {
    var marketsteamparser = new DOMParser();
    var marketsteamresponseDoc = marketsteamparser.parseFromString(marketsteamobject.responseText, "text/html");
    var marketsteamfounddata = JSON.parse(marketsteamresponseDoc.querySelector("body").innerHTML);
    marketsteamkeypriceglobal = Math.floor(marketsteamfounddata["lowest_price"].replace(' TL', '').replace(',', '.') * 0.87);
    console.log("%c[TLtoToman] " + "%cMarket Price: " + marketsteamkeypriceglobal + " TL", "color:#2196F3; font-weight:bold;", "color:null");
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

function TLtoToman(labels) {
    var re = /(\D*)(\d\S* TL)/;
    for (label in labels) {
        let price = document.querySelectorAll(`.${labels[label]}`);
        if (price.length == 0)
            continue;
        for (ind in price) {
            if (re.test(price[ind].textContent)) {
                let matchItem = re.exec(price[ind].textContent)[2];
                if (matchItem.indexOf("TL") >= 0) {
                    let p = matchItem.replace('.', '').replace(',', '.').replace(' TL', '');
                    var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                    var calpricefinal = (calpricesteam * irsteamkeypriceglobal).toLocaleString("en-US");
                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                    price[ind].setAttribute('title', matchItem);
                }
            }
        }
    }
}

(function () {
    const container = document.getElementById('ignoreBtn');
    if (container) {
        const link = document.createElement('a');
        link.className = 'btnv6_blue_hoverfade btn_medium';
        link.target = '_blank';
        link.href = 'https://iraniansteam.ir/tf2/';
        const element = document.createElement('span');
        element.dataset.tooltipText = "Buy TF2 Keys on IranianSteam";
        element.innerHTML = "<span>Buy 🔑</span>";
        link.appendChild(element);
        container.append(link, container.firstChild);
    }
})();

$(window).on("scroll", function () {
    if (irsteamkeypricecheck === true) {
        TLtoToman(labels);
    }
})
