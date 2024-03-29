// ==UserScript==
// @name               Steam Currency To Toman
// @version            1.49
// @description        Converts Steam Currency to Toman
// @author             M-Zoghi
// @namespace          SteamCurrencyToToman
// @icon               http://store.steampowered.com/favicon.ico
// @match              http*://store.steampowered.com/*
// @match              http*://steamcommunity.com/*
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
var currentregion;
var regioncheck = false;
var wallet;
let loadingbar;

var labelsr = [
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
    '_1EKGZBnKFWOr3RqVdnLMRN',
    'Wh0L8EnwsPV_8VAu8TOYr',
    'cart_estimated_total',
    'discount_original_price',
    'price',
    'savings',
    'item_def_price',
];

function CheckRegion(labelsr) {
    let region;
    const href = window.location.href;
    var checkwallet = document.getElementById('header_wallet_balance');
    region = document.querySelectorAll(`.global_action_link`);
    for (labelr in labelsr) {
        if (href.indexOf("steampowered") != -1) {
            if (checkwallet) {
                region = document.querySelectorAll(`.global_action_link`);
            } else {
                region = document.querySelectorAll(`.${labelsr[labelr]}`);
            }
        } else if (href.indexOf("market") != -1) {
            if (checkwallet) {
                region = document.querySelectorAll(`.global_action_link`);
            } else {
                region = document.querySelectorAll(`.market_commodity_orders_header_promote, .market_listing_price, .normal_price`);
            }
        }

        if (region !== null && region.length > 0) {
            for (var i = 0, len = region.length; i < len; i++) {
                if (region[i].innerHTML.indexOf("₴") !== -1) {
                    currentregion = "UAH";
                    regioncheck = true;
                } else if (region[i].innerHTML.indexOf("$") !== -1) {
                    currentregion = "USD";
                    regioncheck = true;
                } else if (region[i].innerHTML.indexOf("€") !== -1) {
                    currentregion = "EUR";
                    regioncheck = true;
                }
            }
        }
    }

    if (currentregion) {
        console.log(`%c[SteamCurrencytoToman] %cCurrency: "${currentregion}"`, "color:#2196F3; font-weight:bold;", "color:null");
    }
}

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
    irsteamkeypriceg = irsteamfounddata.props.pageProps.tf2.prices.keyPrice;
    irsteamkeypriceglobal = Math.ceil(irsteamkeypriceg.replace(',', '.'));
    irsteamkeyquantityglobal = Math.ceil(irsteamfounddata.props.pageProps.tf2.quantity);
    console.log("%c[SteamCurrencytoToman] %cIranian Steam Price: " + irsteamkeypriceglobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    console.log("%c[SteamCurrencytoToman] %cIranian Steam Quantity: " + irsteamkeyquantityglobal + " Keys", "color:#2196F3; font-weight:bold;", "color:null");
    irsteamkeypricecheck = true;
    addloadingbar(33);
    var irsteampriceElements = document.querySelectorAll(".irsteamprice");
    var popupirsteampriceElements = document.querySelectorAll(".popupirsteamprice");
    irsteampriceElements.forEach(function (element) {
        element.textContent = irsteamkeypriceg + " T (" + irsteamkeyquantityglobal + " In Stock)";
    });
    popupirsteampriceElements.forEach(function (element) {
        element.textContent = irsteamkeypriceg + " T (" + irsteamkeyquantityglobal + ")";
    });
}

function GetKeyPriceDragon() {
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://dragonsteam.net/tf2/key/info',
        data: {},
        dataType: 'json',
        onload: LoadDragonSteam,
    })
}

function LoadDragonSteam(dragonsteamobject) {
    var dragonsteamparser = new DOMParser();
    var dragonsteamresponseDoc = dragonsteamparser.parseFromString(dragonsteamobject.responseText, "text/html");
    var dragonsteamfounddata = JSON.parse(dragonsteamresponseDoc.querySelector("body").innerHTML);
    dragonsteamkeypriceg = dragonsteamfounddata.keyPrice.price_sell.toLocaleString();
    dragonsteamkeypriceglobal = Math.ceil(dragonsteamkeypriceg.replace(',', '.'));
    dragonsteamkeyavailabilityglobal = dragonsteamfounddata.keyCount;
    console.log("%c[SteamCurrencytoToman] %cDragon Steam Price: " + dragonsteamkeypriceglobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    console.log("%c[SteamCurrencytoToman] %cDragon Steam Quantity: " + dragonsteamkeyavailabilityglobal + " Keys", "color:#2196F3; font-weight:bold;", "color:null");
    dragonsteamkeypricecheck = true;
    addloadingbar(33);
    document.querySelectorAll(".dragonsteamprice").forEach(function (element) {
        element.textContent = dragonsteamkeypriceg + " T (" + dragonsteamkeyavailabilityglobal + " In Stock)";
    });
    document.querySelectorAll(".popupdragonsteamprice").forEach(function (element) {
        element.textContent = dragonsteamkeypriceg + " T (" + dragonsteamkeyavailabilityglobal + ")";
    });
    if (marketsteamkeypricecheck === true) {
        if (currentregion === "UAH") {
            UAHtoTomanW();
            UAHtoToman(labels);
        } else if (currentregion === "USD") {
            USDtoTomanW();
            USDtoToman(labels);
        } else if (currentregion === "EUR") {
            EURtoTomanW();
            EURtoToman(labels);
        }
    }
}

function GetKeyPriceMarket() {
    if (currentregion === "UAH") {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=18',
            dataType: 'json',
            onload: LoadMarketSteam,
        })
    } else if (currentregion === "USD") {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=1',
            dataType: 'json',
            onload: LoadMarketSteam,
        })
    } else if (currentregion === "EUR") {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=3',
            dataType: 'json',
            onload: LoadMarketSteam,
        })
    }
}

function LoadMarketSteam(marketsteamobject) {
    var marketsteamparser = new DOMParser();
    var marketsteamresponseDoc = marketsteamparser.parseFromString(marketsteamobject.responseText, "text/html");
    var marketsteamfounddata = JSON.parse(marketsteamresponseDoc.querySelector("body").innerHTML);
    if (currentregion === "UAH") {
        marketsteamkeypriceg = marketsteamfounddata.lowest_price.replace('₴', '').replace(',', '.');
        marketsteamkeypriceglobal = Math.floor(marketsteamfounddata.lowest_price.replace('₴', '').replace(',', '.') * 0.87);
        console.log("%c[SteamCurrencytoToman] %cKey Market Price: " + marketsteamkeypriceglobal + "₴", "color:#2196F3; font-weight:bold;", "color:null");
        marketsteamkeypricecheck = true;
        addloadingbar(33);
        document.querySelectorAll(".marketsteamprice").forEach(function (element) {
            element.textContent = marketsteamkeypriceg.replace('.', ',') + "₴ (" + marketsteamkeypriceglobal + "₴)";
        });
        document.querySelectorAll(".popupmarketsteamprice").forEach(function (element) {
            element.textContent = marketsteamkeypriceg.replace('.', ',') + "₴ (" + marketsteamkeypriceglobal + "₴)";
        });
    } else if (currentregion === "USD") {
        marketsteamkeypriceg = marketsteamfounddata.lowest_price.replace('$', '').replace(',', '.');
        marketsteamkeypriceglobal = (marketsteamfounddata.lowest_price.replace('$', '').replace(',', '.') * 0.87).toFixed(2);
        console.log("%c[SteamCurrencytoToman] %cKey Market Price: $" + marketsteamkeypriceglobal, "color:#2196F3; font-weight:bold;", "color:null");
        marketsteamkeypricecheck = true;
        addloadingbar(33);
        document.querySelectorAll(".marketsteamprice").forEach(function (element) {
            element.textContent = "$" + marketsteamkeypriceg + " ($" + marketsteamkeypriceglobal + ")";
        });
        document.querySelectorAll(".popupmarketsteamprice").forEach(function (element) {
            element.textContent = "$" + marketsteamkeypriceg + " ($" + marketsteamkeypriceglobal + ")";
        });
    } else if (currentregion === "EUR") {
        marketsteamkeypriceg = marketsteamfounddata.lowest_price.replace('€', '').replace(',', '.').replace('.--', '.00');
        marketsteamkeypriceglobal = (marketsteamfounddata.lowest_price.replace('€', '').replace(',', '.').replace('.--', '.00') * 0.87).toFixed(2);
        console.log("%c[SteamCurrencytoToman] %cKey Market Price: " + marketsteamkeypriceglobal + "€", "color:#2196F3; font-weight:bold;", "color:null");
        marketsteamkeypricecheck = true;
        addloadingbar(33);
        document.querySelectorAll(".marketsteamprice").forEach(function (element) {
            element.textContent = marketsteamkeypriceg.replace('.', ',') + "€ (" + marketsteamkeypriceglobal.replace('.', ',') + "€)";
        });
        document.querySelectorAll(".popupmarketsteamprice").forEach(function (element) {
            element.textContent = marketsteamkeypriceg.replace('.', ',') + "€ (" + marketsteamkeypriceglobal.replace('.', ',') + "€)";
        });
    }
    if (dragonsteamkeypricecheck === true) {
        if (currentregion === "UAH") {
            UAHtoTomanW();
            UAHtoToman(labels);
        } else if (currentregion === "USD") {
            USDtoTomanW();
            USDtoToman(labels);
        } else if (currentregion === "EUR") {
            EURtoTomanW();
            EURtoToman(labels);
        }
    }
}

CheckRegion(labelsr);
if (regioncheck === true) {
    GetKeyPriceIR();
    GetKeyPriceDragon();
    GetKeyPriceMarket();
}

function eToNumber(num) {
    let sign = "";
    (num += "").charAt(0) == "-" && (num = num.substring(1), sign = "-");
    let arr = num.split(/[e]/ig);
    if (arr.length < 2)
        return sign + num;
    let dot = (.1).toLocaleString().substr(1, 1),
    n = arr[0],
    exp = +arr[1],
    w = (n = n.replace(/^0+/, '')).replace(dot, ''),
    pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp,
    L = pos - w.length,
    s = "" + BigInt(w);
    w = exp >= 0 ? (L >= 0 ? s + "0".repeat(L) : r()) : (pos <= 0 ? "0" + dot + "0".repeat(Math.abs(pos)) + s : r());
    L = w.split(dot);
    if (L[0] == 0 && L[1] == 0 || (+w == 0 && +s == 0))
        w = 0;
    return sign + w;
    function r() {
        return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`)
    }
}

var labels = [
    'discount_original_price',
    'discount_final_price',
    'game_purchase_price',
    'game_area_dlc_price',
    'browse_tag_game_price',
    'salepreviewwidgets_InGameHover_2uFQ-',
    'salepreviewwidgets_StoreSalePriceBox_3j4dI',
    'salepreviewwidgets_StoreSalePriceBox_Wh0L8',
    'salepreviewwidgets_StoreOriginalPrice_1EKGZ',
    'salepreviewwidgets_StoreSalePrepurchaseLabel_Wxeyn',
    'salepreviewwidgets_StoreSaleDiscountedPriceCtn_3GLeQ',
    'salepreviewwidgets_StoreSalePriceWidgetContainer_tqNH0',
    '_1EKGZBnKFWOr3RqVdnLMRN',
    '_2vwJCCeSZV6bqiwKh5cRxd',
    '_2WLaY5TxjBGVyuWe_6KS3N',
    '_3h9iQSuChRQXyzpsu2ip8m',
    '_2WBvzE2CywKDLD0QTnbmUE',
    'Wh0L8EnwsPV_8VAu8TOYr',
    'price',
    'savings',
    'item_def_price',
    'market_commodity_orders_header_promote',
    'market_listing_price',
    'normal_price',
];

function UAHtoToman(labels) {
    try {
        if (window.location.href.indexOf("steampowered") != -1) {
            var re = /(\D*)(\d *\S*)/;
            for (label in labels) {
                let price = document.querySelectorAll(`.${labels[label]}`);
                if (price.length == 0)
                    continue;
                for (ind in price) {
                    if (re.test(price[ind].textContent)) {
                        let matchItem = re.exec(price[ind].textContent);
                        if (matchItem[0].indexOf('₴') >= 0) {
                            if (matchItem[0].indexOf('Your Price:') >= 0) {
                                let p = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                                if (p > marketsteamkeypriceglobal) {
                                    var walletcal = parseFloat(wallet.replace(' ', '').replace('₴', '').replace(',', '.'));
                                    var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                                    var calpricefinal = (calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcal) {
                                        price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcal.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                    } else {
                                        var needed = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcal);
                                        var neededkey = Math.ceil(needed / marketsteamkeypriceglobal);
                                        var neededfinal = (neededkey * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                        price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcal.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededfinal + " T (" + neededkey + "🔑) = " + needed.toFixed(2).toString().replace('.', ',') + "₴[/R]\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                    }
                                } else {
                                    var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcal) {
                                        price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcal.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]\">" + calpricefinal + " T (" + calpricesteam + "🔑)" + "</div></div>";
                                    } else {
                                        price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcal.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededfinal + " T (" + neededkey + "🔑) = " + needed.toFixed(2).toString().replace('.', ',') + "₴[/R]\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                    }
                                }
                            } else {
                                let p = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                                if (p > marketsteamkeypriceglobal) {
                                    var walletcal = parseFloat(wallet.replace(' ', '').replace('₴', '').replace(',', '.'));
                                    var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                                    var calpricefinal = (calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                    if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcal) {
                                        price[ind].setAttribute('ogpricetooltip', "[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcal.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]");
                                    } else {
                                        var needed = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcal);
                                        var neededkey = Math.ceil(needed / marketsteamkeypriceglobal);
                                        var neededfinal = (neededkey * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                        price[ind].setAttribute('ogpricetooltip', "[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcal.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededfinal + " T (" + neededkey + "🔑) = " + needed.toFixed(2).toString().replace('.', ',') + "₴[/R]");
                                    }
                                } else {
                                    var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                    if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcal) {
                                        price[ind].setAttribute('ogpricetooltip', "[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcal.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]");
                                    } else {
                                        var needed = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcal);
                                        var neededkey = Math.ceil(needed / marketsteamkeypriceglobal);
                                        var neededfinal = (neededkey * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                        price[ind].setAttribute('ogpricetooltip', "[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcal.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededfinal + " T (" + neededkey + "🔑) = " + needed.toFixed(2).toString().replace('.', ',') + "₴[/R]");
                                    }
                                }
                            }
                        }
                    }
                }
                if (typeof wallet !== 'undefined' && wallet !== null && wallet !== '') {
                    initializeTooltips();
                } else {
                    setTimeout(1000);
                }
            }
        }

        if (window.location.href.indexOf("market") != -1) {
            var rem = /(\D*)(.*(?:[₴]))/;
            let pricem = document.querySelectorAll(`.market_commodity_orders_header_promote, .market_listing_price`);
            for (labelmarket in pricem) {
                if (pricem.length == 0)
                    continue;
                for (indm in pricem) {
                    if (rem.test(pricem[indm].textContent)) {
                        let matchItem = rem.exec(pricem[indm].textContent);
                        if (matchItem[0].indexOf('₴') >= 0) {
                            let pm = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                            var walletcalm = parseFloat(wallet.replace(' ', '').replace('₴', '').replace(',', '.'));
                            var calpricesteamm = (pm / marketsteamkeypriceglobal).toPrecision(2);
                            var calpricefinalm = Math.ceil(calpricesteamm * dragonsteamkeypriceglobal).toLocaleString("en-US");
                            if (pricem[indm].innerHTML.indexOf("🔑") == -1) {
                                if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcalm) {
                                    pricem[indm].innerHTML = "<font color=\"white\">" + matchItem[2] + "</font><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcalm.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]\"><font color=\"silver\">" + calpricefinalm + " T (" + eToNumber(calpricesteamm) + "🔑)</font></div></div>";
                                } else {
                                    var neededm = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcalm);
                                    var neededmkey = (neededm / marketsteamkeypriceglobal).toPrecision(2);
                                    var neededmfinal = Math.ceil(neededmkey * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    pricem[indm].innerHTML = "<font color=\"white\">" + matchItem[2] + "</font><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcalm.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededmfinal + " T (" + eToNumber(neededmkey) + "🔑) = " + neededm.toFixed(2).toString().replace('.', ',') + "₴[/R]\"><font color=\"silver\">" + calpricefinalm + " T (" + eToNumber(calpricesteamm) + "🔑)</font></div></div>";
                                }
                            }
                        }
                    }
                }
                if (typeof wallet !== 'undefined' && wallet !== null && wallet !== '') {
                    initializeTooltips();
                } else {
                    setTimeout(1000);
                }
            }

            let pricems = document.querySelectorAll(`.normal_price`);
            for (labelmarkets in pricems) {
                if (pricems.length == 0)
                    continue;
                for (indms in pricems) {
                    if (rem.test(pricems[indms].textContent)) {
                        let matchItem = rem.exec(pricems[indms].textContent);
                        if (matchItem[0].indexOf('₴') >= 0) {
                            let pms = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                            var walletcalms = parseFloat(wallet.replace(' ', '').replace('₴', '').replace(',', '.'));
                            var calpricesteamms = (pms / marketsteamkeypriceglobal).toPrecision(2);
                            var calpricefinalms = Math.ceil(calpricesteamms * dragonsteamkeypriceglobal).toLocaleString("en-US");
                            if (pricems[indms].innerHTML.indexOf("🔑") == -1) {
                                if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcalms) {
                                    pricems[indms].innerHTML = "Starting at:<br><font color=\"white\">" + matchItem[2] + "</font><br><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcalms.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]\"><font color=\"silver\">" + calpricefinalms + " T (" + eToNumber(calpricesteamms) + "🔑)</font></div></div>";
                                } else {
                                    var neededms = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcalms);
                                    var neededmskey = (neededms / marketsteamkeypriceglobal).toPrecision(2);
                                    var neededmsfinal = Math.ceil(neededmskey * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    pricems[indms].innerHTML = "Starting at:<br><font color=\"white\">" + matchItem[2] + "</font><br><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcalms.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededmsfinal + " T (" + eToNumber(neededmskey) + "🔑) = " + neededms.toFixed(2).toString().replace('.', ',') + "₴[/R]\"><font color=\"silver\">" + calpricefinalms + " T (" + eToNumber(calpricesteamms) + "🔑)</font></div></div>";
                                }
                            }
                        }
                    }
                    if (typeof wallet !== 'undefined' && wallet !== null && wallet !== '') {
                        initializeTooltips();
                    } else {
                        setTimeout(1000);
                    }
                }
            }

            let pricemsw = document.querySelectorAll(`.user_info_text`);
            for (labelmarketsw in pricemsw) {
                if (pricemsw.length == 0)
                    continue;
                for (indmsw in pricemsw) {
                    if (rem.test(pricemsw[indmsw].textContent)) {
                        let matchItem = rem.exec(pricemsw[indmsw].textContent);
                        if (matchItem[0].indexOf('₴') >= 0) {
                            let pmsw = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                            var calpricesteammsw = (pmsw / marketsteamkeypriceglobal).toPrecision(3);
                            var calpricefinalmsw = Math.ceil(calpricesteammsw * dragonsteamkeypriceglobal).toLocaleString("en-US");
                            if (pricemsw[indmsw].innerHTML.indexOf("🔑") == -1) {
                                pricemsw[indmsw].innerHTML = "<a id=\"marketWalletBalance\" href=\"https://store.steampowered.com/account/\">Wallet balance <span id=\"marketWalletBalanceAmount\">" + matchItem[2] + " (" + eToNumber(calpricesteammsw) + "🔑)</span></a><br><a href=\"https://steamcommunity.com/my/inventory/\">View Inventory</a></span>"
                            }
                        }
                    }
                }
            }
        }
    } catch (ex) {}
}

function UAHtoTomanW() {
    var rew = /(\D*)(\d *\S*)/;
    let pricew = document.querySelectorAll(`.global_action_link`);
    for (indw in pricew) {
        if (rew.test(pricew[indw].textContent)) {
            let matchItemw = rew.exec(pricew[indw].textContent);
            if (matchItemw[0].indexOf('₴') >= 0 && matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace('Pending:', '').replace(' ', '').replace('₴', '').replace(',', '.');
                var pending = pricew[indw].textContent.substring(pricew[indw].textContent.indexOf("Pending:")).replace('Pending:', ' Pending:');
                var pendingn = pending.replace(' Pending:', '').replace(' ', '').replace('₴', '').replace(',', '.');
                var calpricesteamw = (pw / marketsteamkeypriceglobal).toPrecision(3);
                var calpricesteamwpending = (pendingn / marketsteamkeypriceglobal).toPrecision(3);
                wallet = pricew[indw].textContent.replace(/\Pending: .*/, '');
                const pendingtooltipelement = document.querySelector('.tooltip');
                var pendingtooltip = pendingtooltipelement.getAttribute('data-tooltip-html');
                pricew[indw].innerHTML = pricew[indw].textContent.replace(/\Pending: .*/, '') + " (" + calpricesteamw + "🔑)<br><span class=\"tooltip\" ogpricetooltip=\"" + pendingtooltip.replace('. ', '.<br>') + "\">" + pending + " (" + calpricesteamwpending + "🔑)</span>";
            } else if (matchItemw[0].indexOf('₴') >= 0 && !matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace(' ', '').replace('₴', '').replace(',', '.');
                var calpricesteamw = (pw / marketsteamkeypriceglobal).toPrecision(3);
                wallet = pricew[indw].textContent;
                pricew[indw].textContent = pricew[indw].textContent + " (" + calpricesteamw + "🔑)";
            }
        }
        if (typeof wallet !== 'undefined' && wallet !== null && wallet !== '') {
            initializeTooltips();
        } else {
            setTimeout(1000);
        }
    }
}

function USDtoToman(labels) {
    try {
        if (window.location.href.indexOf("steampowered") != -1) {
            var re = /(\D*)(\d\S*)/;
            for (label in labels) {
                let price = document.querySelectorAll(`.${labels[label]}`);
                if (price.length == 0)
                    continue;
                for (ind in price) {
                    if (re.test(price[ind].textContent)) {
                        let matchItem = re.exec(price[ind].textContent);
                        if (matchItem[0].indexOf('$') >= 0) {
                            if (matchItem[0].indexOf('Your Price:') >= 0) {
                                let p = matchItem[0].replace(',', '.').replace('$', '').replace('Your Price:', '');
                                if (p > parseFloat(marketsteamkeypriceglobal)) {
                                    var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                                    var calpricefinal = (calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div title=\"" + matchItem[2] + "\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                } else {
                                    var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div title=\"" + matchItem[2] + "\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                }
                            } else {
                                let p = matchItem[0].replace(',', '.').replace('$', '');
                                if (p > parseFloat(marketsteamkeypriceglobal)) {
                                    var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                                    var calpricefinal = (calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                    price[ind].setAttribute('title', "$" + matchItem[2]);
                                } else {
                                    var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                    price[ind].setAttribute('title', "$" + matchItem[2]);
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (ex) {}
}

function USDtoTomanW() {
    var rew = /(\D*)(\d\S*$)/;
    let pricew = document.querySelectorAll(`.global_action_link`);
    for (indw in pricew) {
        if (rew.test(pricew[indw].textContent)) {
            let matchItemw = rew.exec(pricew[indw].textContent);
            if (matchItemw[0].indexOf('$') >= 0 && matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace('Pending:', '').replace(',', '.').replace('$', '');
                var pending = pricew[indw].textContent.substring(pricew[indw].textContent.indexOf("Pending:")).replace('Pending:', ' Pending:');
                var pendingn = pending.replace(' Pending:', '').replace(',', '.').replace('$', '');
                var calpricesteamw = (pw / marketsteamkeypriceglobal).toPrecision(3);
                var calpricesteamwpending = (pendingn / marketsteamkeypriceglobal).toPrecision(3);
                pricew[indw].textContent = pricew[indw].textContent.replace(/\Pending: .*/, '') + " (" + calpricesteamw + "🔑)" + pending + " (" + calpricesteamwpending + "🔑)";
            } else if (matchItemw[0].indexOf('$') >= 0 && !matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace(',', '.').replace('$', '');
                var calpricesteamw = (pw / marketsteamkeypriceglobal).toPrecision(3);
                pricew[indw].textContent = pricew[indw].textContent + " (" + calpricesteamw + "🔑)";
            }
        }
    }
}

function EURtoToman(labels) {
    try {
        if (window.location.href.indexOf("steampowered") != -1) {
            var re = /(\D*)(\d\S*)/;
            for (label in labels) {
                let price = document.querySelectorAll(`.${labels[label]}`);
                if (price.length == 0)
                    continue;
                for (ind in price) {
                    if (re.test(price[ind].textContent)) {
                        let matchItem = re.exec(price[ind].textContent);
                        if (matchItem[0].indexOf('€') >= 0) {
                            if (matchItem[0].indexOf('Your Price:') >= 0) {
                                let p = matchItem[2].replace(',--€', '').replace(',', '.').replace('€', '').replace('Your Price:', '');
                                if (p > marketsteamkeypriceglobal) {
                                    var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                                    var calpricefinal = (calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div title=\"" + matchItem[2] + "\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                } else {
                                    var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div title=\"" + matchItem[2] + "\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                }
                            } else {
                                let p = matchItem[2].replace(',--€', '').replace(',', '.').replace('€', '');
                                if (p > marketsteamkeypriceglobal) {
                                    var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                                    var calpricefinal = (calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                    price[ind].setAttribute('title', matchItem[2]) + "€";
                                } else {
                                    var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                    price[ind].setAttribute('title', matchItem[2]) + "€";
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (ex) {}
}

function EURtoTomanW() {
    var rew = /(\D*)(\d\S*€)/;
    let pricew = document.querySelectorAll(`.global_action_link`);
    for (indw in pricew) {
        if (rew.test(pricew[indw].textContent)) {
            let matchItemw = rew.exec(pricew[indw].textContent);
            if (matchItemw[0].indexOf('€') >= 0 && matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace('Pending:', '').replace(',--€', '').replace(',', '.').replace('€', '');
                var pending = pricew[indw].textContent.substring(pricew[indw].textContent.indexOf("Pending:")).replace('Pending:', ' Pending:');
                var pendingn = pending.replace(' Pending:', '').replace(',--€', '').replace(',', '.').replace('€', '');
                var calpricesteamw = (pw / marketsteamkeypriceglobal).toPrecision(3);
                var calpricesteamwpending = (pendingn / marketsteamkeypriceglobal).toPrecision(3);
                pricew[indw].textContent = pricew[indw].textContent.replace(/\Pending: .*/, '') + " (" + calpricesteamw + "🔑)" + pending + " (" + calpricesteamwpending + "🔑)";
            } else if (matchItemw[0].indexOf('€') >= 0 && !matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace(',--€', '').replace(',', '.').replace('€', '');
                var calpricesteamw = (pw / marketsteamkeypriceglobal).toPrecision(3);
                pricew[indw].textContent = pricew[indw].textContent + " (" + calpricesteamw + "🔑)";
            }
        }
    }
}

function addTooltip(element, tooltipText) {
    var tooltip = document.createElement('span');
    tooltip.setAttribute('class', 'ogprice-tooltip');
    tooltip.innerHTML = parseTooltipText(tooltipText);
    document.body.appendChild(tooltip);
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#c2c2c2';
    tooltip.style.color = '#3d3d3f';
    tooltip.style.fontFamily = 'Motiva Sans';
    tooltip.style.fontSize = '11px';
    tooltip.style.textAlign = 'left';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '2px';
    tooltip.style.boxShadow = '0 0 3px #000';
    tooltip.style.zIndex = '9999';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s ease';
    tooltip.style.whiteSpace = 'pre-line';
    tooltip.style.pointerEvents = 'none';

    element.addEventListener('mouseover', function (e) {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
        tooltip.style.opacity = '1';
        element.style.cursor = 'help';
        setTimeout(function() {
            tooltip.style.opacity = '0';
        }, 5000);
    });

    element.addEventListener('mouseout', function () {
        tooltip.style.opacity = '0';
        element.style.cursor = 'default';
    });

    function parseTooltipText(text) {
        text = text.replace(/\*(.*?)\*/g, '<span style="font-weight:bold;">$1</span>');
        text = text.replace(/\[L\]/g, '<span style="text-align:left;">');
        text = text.replace(/\[\/L\]/g, '</span>');
        text = text.replace(/\[R\]/g, '<span style="float:right;">');
        text = text.replace(/\[\/R\]/g, '</span>');
        text = text.replace(/\[C\]/g, '<span style="display:block; text-align:center;">');
        text = text.replace(/\[\/C\]/g, '</span>');
        text = text.replace(/🔑/g, '<span style="color: transparent; text-shadow: 1px 1px 1px #3d3d3f;">🔑</span>');
        text = text.replace(/\[P\]/g, '<span style="position: relative; bottom: 2px;">');
        text = text.replace(/\[\/P\]/g, '</span>');
        return text;
    }
}

function initializeTooltips() {
    var elementsWithTooltip = document.querySelectorAll('[ogpricetooltip]:not([ogpricetooltip-initialized])');
    elementsWithTooltip.forEach(function (element) {
        var tooltipText = element.getAttribute('ogpricetooltip');
        addTooltip(element, tooltipText);
        element.setAttribute('ogpricetooltip-initialized', 'true');
    });
}

function addloadingbar(amount) {
    var currentwidth = parseFloat(loadingbar.style.width) || 0;
    var newwidth = Math.min(currentwidth + amount, 100);
    loadingbar.style.width = newwidth + '%';
}

function waitloadingbar() {
    return new Promise(resolve => {
        var checkwidth = function () {
            var currentWidth = parseFloat(loadingbar.style.width) || 0;
            if (currentWidth >= 99) {
                resolve();
            } else {
                setTimeout(checkwidth, 100);
            }
        };
        checkwidth();
    });
}

(function () {
    loadingbar = document.createElement('div');
    loadingbar.id = 'loading-bar';
    loadingbar.style.position = 'fixed';
    loadingbar.style.top = '0';
    loadingbar.style.left = '0';
    loadingbar.style.width = '0%';
    loadingbar.style.height = '3px';
    loadingbar.style.backgroundColor = '#00adee';
    loadingbar.style.zIndex = '9999';
    loadingbar.style.transition = 'opacity 0.5s ease, width 0.5s ease';
    document.body.appendChild(loadingbar);

    waitloadingbar().then(() => {
        loadingbar.style.width = '100%';
        setTimeout(() => {
            loadingbar.style.opacity = '0';
            setTimeout(() => {
                loadingbar.remove();
            }, 500);
        }, 500);
    });

    var PopPop = document.createElement('style');
    PopPop.type = 'text/css';
    PopPop.innerHTML = '.ico16sc { display: inline-block; width: 16px; height: 16px; background: none; vertical-align: text-top; }';
    document.getElementsByTagName('head')[0].appendChild(PopPop);

    const Popup = document.querySelector('#account_dropdown .popup_body');

    if (Popup) {
        const KeyISP = document.createElement('a');
        KeyISP.rel = 'noopener';
        KeyISP.target = '_blank';
        KeyISP.className = 'popup_menu_item PopPop';
        KeyISP.href = 'https://iraniansteam.ir/tf2';
        KeyISP.title = ("Buy keys from Iranian Steam");
        KeyISP.textContent = " Iranian Steam: ";

        const KeyISPA = document.createElement('a');
        KeyISPA.textContent = "Loading..."
            KeyISPA.className = 'account_name popupirsteamprice';
        KeyISP.appendChild(KeyISPA);

        const KeyISPI = document.createElement('img');
        KeyISPI.className = 'ico16sc';
        KeyISPI.src = 'https://iraniansteam.ir/favicon.ico';
        KeyISP.prepend(KeyISPI);

        const KeyDSP = document.createElement('a');
        KeyDSP.rel = 'noopener';
        KeyDSP.target = '_blank';
        KeyDSP.className = 'popup_menu_item PopPop';
        KeyDSP.href = 'https://dragonsteam.net/shop/tf2/key';
        KeyDSP.title = ("Buy keys from Dragon Steam");
        KeyDSP.textContent = " Dragon Steam: ";

        const KeyDSPA = document.createElement('a');
        KeyDSPA.textContent = "Loading...";
        KeyDSPA.className = 'account_name popupdragonsteamprice';
        KeyDSP.appendChild(KeyDSPA);

        const KeyDSPI = document.createElement('img');
        KeyDSPI.className = 'ico16sc';
        KeyDSPI.src = 'https://dragonsteam.net/images/logo/favicon.ico';
        KeyDSP.prepend(KeyDSPI);

        const KeyMSP = document.createElement('a');
        KeyMSP.rel = 'noopener';
        KeyMSP.target = '_blank';
        KeyMSP.className = 'popup_menu_item PopPop';
        KeyMSP.href = 'https://steamcommunity.com/market/listings/440/Mann%20Co.%20Supply%20Crate%20Key';
        KeyMSP.title = ("View keys on Community Market");
        KeyMSP.textContent = " Steam Market: ";

        const KeyMSPA = document.createElement('a');
        KeyMSPA.textContent = "Loading...";
        KeyMSPA.className = 'account_name popupmarketsteamprice';
        KeyMSP.appendChild(KeyMSPA);

        const KeyMSPI = document.createElement('img');
        KeyMSPI.className = 'ico16sc';
        KeyMSPI.src = 'https://store.steampowered.com/favicon.ico';
        KeyMSP.prepend(KeyMSPI);

        Popup.appendChild(KeyISP);
        Popup.appendChild(KeyDSP);
        Popup.appendChild(KeyMSP);
    }

    const container = document.querySelector('.game_meta_data');

    var widget = document.createElement('style');
    widget.type = 'text/css';
    widget.innerHTML = '.widget { font-family: "Motiva Sans", Arial, Helvetica, sans-serif; }';
    document.getElementsByTagName('head')[0].appendChild(widget);

    var key = document.createElement('style');
    key.type = 'text/css';
    key.innerHTML = '.key { width: 52px; height: 52px; float: right; opacity: 0.5; transition: opacity 0.1s ease-in-out;}';
    document.getElementsByTagName('head')[0].appendChild(key);

    var widgethover = document.createElement('style');
    widgethover.type = 'text/css';
    widgethover.innerHTML = '.widget:hover .key { opacity: 1; }';
    document.getElementsByTagName('head')[0].appendChild(widgethover);

    var leftcolumn = document.createElement('style');
    leftcolumn.type = 'text/css';
    leftcolumn.innerHTML = '.leftcolumn { min-width: 90px; margin-right: 5px; display: inline-block; }';
    document.getElementsByTagName('head')[0].appendChild(leftcolumn);

    var rightcolumn = document.createElement('style');
    rightcolumn.type = 'text/css';
    rightcolumn.innerHTML = '.rightcolumn { color: #67c1f5; position: absolute; }';
    document.getElementsByTagName('head')[0].appendChild(rightcolumn);

    if (!container) {
        return;
    }

    const blockInner = document.createElement('div');
    blockInner.className = 'block_content_inner';

    const block = document.createElement('div');
    block.className = 'block responsive_apppage_details_right widget';
    block.appendChild(blockInner);

    const link = document.createElement('a');
    link.className = 'key';
    link.title = ("View on Community Market");
    link.target = '_blank';
    link.href = 'https://steamcommunity.com/market/listings/440/Mann%20Co.%20Supply%20Crate%20Key';

    const image = document.createElement('img');
    image.src = "https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ/54fx54f";
    link.appendChild(image);

    blockInner.appendChild(link);

    const irsteamprice = document.createElement('a');
    irsteamprice.className = 'rightcolumn irsteamprice';
    irsteamprice.title = ("Buy keys from Iranian Steam");
    irsteamprice.target = '_blank';
    irsteamprice.href = 'https://iraniansteam.ir/tf2';
    irsteamprice.textContent = "Loading...";

    let line = document.createElement('p');
    let lineText = document.createElement('span');
    lineText.className = 'leftcolumn';
    lineText.textContent = ("Iranian Steam: ");
    line.appendChild(lineText);
    line.appendChild(irsteamprice);

    blockInner.appendChild(line);

    const dragonsteamprice = document.createElement('a');
    dragonsteamprice.className = 'rightcolumn dragonsteamprice';
    dragonsteamprice.title = ("Buy keys from Dragon Steam");
    dragonsteamprice.target = '_blank';
    dragonsteamprice.href = 'https://dragonsteam.net/shop/tf2/key';
    dragonsteamprice.textContent = "Loading...";

    line = document.createElement('p');
    lineText = document.createElement('span');
    lineText.className = 'leftcolumn';
    lineText.textContent = ("Dragon Steam: ");
    line.appendChild(lineText);
    line.appendChild(dragonsteamprice);

    blockInner.appendChild(line);

    const marketsteamprice = document.createElement('a');
    marketsteamprice.className = 'rightcolumn marketsteamprice';
    marketsteamprice.title = ("View on Community Market");
    marketsteamprice.target = '_blank';
    marketsteamprice.href = 'https://steamcommunity.com/market/listings/440/Mann%20Co.%20Supply%20Crate%20Key';
    marketsteamprice.textContent = "Loading...";

    line = document.createElement('p');
    lineText = document.createElement('span');
    lineText.className = 'leftcolumn';
    lineText.textContent = ("Steam Market: ");
    line.appendChild(lineText);
    line.appendChild(marketsteamprice);

    blockInner.appendChild(line);

    container.insertBefore(block, container.firstChild);

    const containerbtn = document.getElementById('ignoreBtn');
    if (containerbtn) {
        const link = document.createElement('a');
        link.className = 'btnv6_blue_hoverfade btn_medium';
        link.target = '_blank';
        link.href = 'https://dragonsteam.net/shop/tf2/key';
        const element = document.createElement('span');
        element.dataset.tooltipText = "Buy TF2 Keys";
        element.innerHTML = "<span>Buy 🔑</span>";
        link.appendChild(element);
        containerbtn.append(link, containerbtn.firstChild);
    }
})();

function convertcurrency() {
    if (currentregion === "UAH") {
        UAHtoToman(labels);
    } else if (currentregion === "USD") {
        USDtoToman(labels);
    } else if (currentregion === "EUR") {
        EURtoToman(labels);
    }
}

function handlemutations(mutationsList) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (let node of mutation.addedNodes) {
                if (dragonsteamkeypricecheck && marketsteamkeypricecheck) {
                    processnode(node);
                }
            }
        }
    }
}

function processnode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList) {
            for (let classname of labels) {
                if (node.classList.contains(classname)) {
                    convertcurrency();
                    return;
                }
            }
        }
        for (let childnode of node.childNodes) {
            processnode(childnode);
        }
    }
}

const observer = new MutationObserver(handlemutations);

observer.observe(document.body, { childList: true, subtree: true });

if (dragonsteamkeypricecheck && marketsteamkeypricecheck) {
    processnode(document.body);
}
