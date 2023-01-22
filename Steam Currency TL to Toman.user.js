// ==UserScript==
// @name               Steam Currency TL To Toman
// @version            1.14
// @description        Converts TL to Toman
// @author             M-Zoghi
// @namespace          SteamCurrencyConvertTLToToman
// @icon               http://store.steampowered.com/favicon.ico
// @match              http*://store.steampowered.com/*
// @require            http://code.jquery.com/jquery.min.js
// @grant              GM_xmlhttpRequest
// @connect            iraniansteam.ir
// @connect            dragonsteam.net
// @connect            steamcommunity.com
// @license            MIT License
// ==/UserScript==

var marketsteamkeypriceg;
var marketsteamkeypriceglobal;
var marketsteamkeypricecheck = false;
var irsteamkeypriceg;
var irsteamkeypriceglobal;
var irsteamkeyquantityglobal;
var irsteamkeypricecheck = false;
var dragonsteamkeypriceg;
var dragonsteamkeypriceglobal;
var dragonsteamkeyavailabilityglobal;
var dragonsteamkeypricecheck = false;

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
    irsteamkeypriceg = irsteamfounddata["props"]["pageProps"]["tf2"]["prices"]["keyPrice"];
    irsteamkeypriceglobal = Math.ceil(irsteamfounddata["props"]["pageProps"]["tf2"]["prices"]["keyPrice"].replace(',', '.'));
    irsteamkeyquantityglobal = Math.ceil(irsteamfounddata["props"]["pageProps"]["tf2"]["quantity"]);
    console.log("%c[TLtoToman] " + "%cIranian Steam Key Price: " + irsteamkeypriceglobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    console.log("%c[TLtoToman] " + "%cIranian Steam Key Quantity: " + irsteamkeyquantityglobal, "color:#2196F3; font-weight:bold;", "color:null");
    irsteamkeypricecheck = true;
}

function GetKeyPriceDragon() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://dragonsteam.net/product/mann-co-supply-crate-key/',
        dataType: 'json',
        onload: LoadDragonSteam,
    })
}

function LoadDragonSteam(dragonsteamobject) {
    var dragonsteamparser = new DOMParser();
    var dragonsteamresponseDoc = dragonsteamparser.parseFromString(dragonsteamobject.responseText, "text/html");
    var dragonsteamfounddata = dragonsteamresponseDoc.querySelector("meta[property='product:price:amount']").getAttribute("content").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    dragonsteamkeypriceg = dragonsteamfounddata.replace('.', ',');
    dragonsteamkeypriceglobal = Math.ceil(dragonsteamfounddata);
    dragonsteamkeyavailabilityglobal = dragonsteamresponseDoc.querySelector("meta[property='product:availability']").getAttribute("content").replace("instock", "In Stock");
    console.log("%c[TLtoToman] " + "%cDragon Steam Key Price: " + dragonsteamkeypriceglobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    dragonsteamkeypricecheck = true;
    if (marketsteamkeypricecheck === true) {
        TLtoToman(labels);
    }
}

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
    marketsteamkeypriceg = marketsteamfounddata["lowest_price"].replace(' TL', '').replace(',', '.');
    marketsteamkeypriceglobal = Math.floor(marketsteamfounddata["lowest_price"].replace(' TL', '').replace(',', '.') * 0.87);
    console.log("%c[TLtoToman] " + "%cMarket Price: " + marketsteamkeypriceglobal + " TL", "color:#2196F3; font-weight:bold;", "color:null");
    marketsteamkeypricecheck = true;
    if (dragonsteamkeypricecheck === true) {
        TLtoToman(labels);
    }
}

GetKeyPriceDragon();
GetKeyPriceIR();
GetKeyPriceMarket();
setTimeout(KeyWidget, 5000);

var labels = [
    'discount_original_price',
    'discount_final_price',
    'game_purchase_price',
    'game_area_dlc_price',
    'salepreviewwidgets_InGameHover_2uFQ-',
    'salepreviewwidgets_StoreSalePriceBox_3j4dI',
    'salepreviewwidgets_StoreSalePriceBox_Wh0L8',
    'salepreviewwidgets_StoreOriginalPrice_1EKGZ',
    'salepreviewwidgets_StoreSalePrepurchaseLabel_Wxeyn',
    'salepreviewwidgets_StoreSaleDiscountedPriceCtn_3GLeQ',
    'salepreviewwidgets_StoreSalePriceWidgetContainer_tqNH0',
    'cart_estimated_total',
    'price',
    'savings',
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
                    var calpricefinal = (calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                    price[ind].setAttribute('title', matchItem);
                }
            }
        }
    }
}

function KeyWidget() {
    const container = document.querySelector('.game_meta_data');

    if (!container) {
        return;
    }

    const blockInner = document.createElement('div');
    blockInner.className = 'block_content_inner';

    const block = document.createElement('div');
    block.className = 'block responsive_apppage_details_right';
    block.appendChild(blockInner);

    const link = document.createElement('a');
    link.className = 'tf2_key';
    link.title = ("Mann Co. Supply Crate Key");
    link.target = '_blank';
    link.href = 'https://steamcommunity.com/market/listings/440/Mann%20Co.%20Supply%20Crate%20Key';

    const image = document.createElement('img');
    image.src = "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ/54fx54f";
    image.style = "width: 54px;height: 54px;float: right"
        link.appendChild(image);

    blockInner.appendChild(link);

    const irsteamprice = document.createElement('a');
    irsteamprice.className = 'game_review_summary positive';
    irsteamprice.target = '_blank';
    irsteamprice.href = 'https://iraniansteam.ir/tf2';
    if (irsteamkeypricecheck === true) {
        irsteamprice.textContent = irsteamkeypriceg + " T (" + irsteamkeyquantityglobal + " In Stock)";
    } else {
        irsteamprice.textContent = "Error";
    }

    let line = document.createElement('p');
    let lineText = document.createElement('span');
    lineText.className = 'irsteam_price_name';
    lineText.textContent = ("Iranian Steam: ");
    line.appendChild(lineText);
    line.appendChild(irsteamprice);

    blockInner.appendChild(line);

    const dragonsteamprice = document.createElement('a');
    dragonsteamprice.className = 'game_review_summary positive';
    dragonsteamprice.target = '_blank';
    dragonsteamprice.href = 'https://dragonsteam.net/product/mann-co-supply-crate-key/';
    if (dragonsteamkeypricecheck === true) {
        dragonsteamprice.textContent = dragonsteamkeypriceg + " T (" + dragonsteamkeyavailabilityglobal + ")";
    } else {
        dragonsteamprice.textContent = "Error";
    }

    line = document.createElement('p');
    lineText = document.createElement('span');
    lineText.className = 'dragonsteam_price_name';
    lineText.textContent = ("Dragon Steam: ");
    line.appendChild(lineText);
    line.appendChild(dragonsteamprice);

    blockInner.appendChild(line);

    const marketsteamprice = document.createElement('a');
    marketsteamprice.className = 'game_review_summary positive';
    marketsteamprice.target = '_blank';
    marketsteamprice.href = 'https://steamcommunity.com/market/listings/440/Mann%20Co.%20Supply%20Crate%20Key';
    if (marketsteamkeypricecheck === true) {
        marketsteamprice.textContent = marketsteamkeypriceg.replace('.', ',') + " TL (" + marketsteamkeypriceglobal + " TL)";
    } else {
        marketsteamprice.textContent = "Error";
    }

    line = document.createElement('p');
    lineText = document.createElement('span');
    lineText.className = 'marketsteam_price_name';
    lineText.textContent = ("Steam Market: ");
    line.appendChild(lineText);
    line.appendChild(marketsteamprice);

    blockInner.appendChild(line);

    container.insertBefore(block, container.firstChild);
}

(function () {
    const container = document.getElementById('ignoreBtn');
    if (container) {
        const link = document.createElement('a');
        link.className = 'btnv6_blue_hoverfade btn_medium';
        link.target = '_blank';
        link.href = 'https://dragonsteam.net/product/mann-co-supply-crate-key/';
        const element = document.createElement('span');
        element.dataset.tooltipText = "Buy TF2 Keys";
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
