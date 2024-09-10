// ==UserScript==
// @name               Steam Currency To Toman
// @version            1.59
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

var MarketPrice;
var MarketPriceGlobal;
var MarketPriceCheck = false;
var IRSteamPrice;
var IRSteamPriceGlobal;
var IRSteamAvailGlobal;
var IRSteamPriceCheck = false;
var DRSteamPrice;
var DRSteamPriceGlobal;
var DRSteamAvailGlobal;
var DRSteamPriceCheck = false;
var FinalKeyPrice;
var CurrRegion;
var RegionCheck = false;
var Wallet;
let LoadingBar;
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

CheckRegion(labelsr);
GetIRSteamPrice();
GetDRSteamPrice();

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
                    CurrRegion = "UAH";
                    RegionCheck = true;
                    break;
                } else if (region[i].innerHTML.indexOf("$") !== -1) {
                    CurrRegion = "USD";
                    RegionCheck = true;
                    break;
                } else if (region[i].innerHTML.indexOf("€") !== -1) {
                    CurrRegion = "EUR";
                    RegionCheck = true;
                    break;
                }
            }
        }
    }

    if (CurrRegion) {
        console.log(`%c[SteamCurrencytoToman] %cCurrency: "${CurrRegion}"`, "color:#2196F3; font-weight:bold;", "color:null");
        RegionCheck = true;
        GetMarketPrice();
        WaitForPrices();
        return;
    }
}

function GetIRSteamPrice() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://iraniansteam.ir/tf2',
        dataType: 'json',
        timeout: 3500,
        onload: LoadIRSteamPrice,
        ontimeout: LoadIRSteamPriceTimeout,
        onerror: LoadIRSteamPriceTimeout,
    })
}

function LoadIRSteamPrice(IRSteamObject) {
    var IRSteamParser = new DOMParser();
    var IRSteamResponseDoc = IRSteamParser.parseFromString(IRSteamObject.responseText, "text/html");
    var IRSteamDataFound = JSON.parse(IRSteamResponseDoc.getElementById('__NEXT_DATA__').innerHTML);
    IRSteamPrice = IRSteamDataFound.props.pageProps.tf2.prices.keyPrice;
    IRSteamPriceGlobal = Math.ceil(IRSteamPrice.replace(',', '.'));
    IRSteamAvailGlobal = Math.ceil(IRSteamDataFound.props.pageProps.tf2.quantity);
    console.log("%c[SteamCurrencytoToman] %cIranian Steam Price: " + IRSteamPriceGlobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    console.log("%c[SteamCurrencytoToman] %cIranian Steam Quantity: " + IRSteamAvailGlobal + " Keys", "color:#2196F3; font-weight:bold;", "color:null");
    var IRSteamElements = document.querySelectorAll(".irsteamprice");
    var IRSteamElementsPopUp = document.querySelectorAll(".popupirsteamprice");
    IRSteamElements.forEach(function (element) {
        element.textContent = IRSteamPrice + " T (" + IRSteamAvailGlobal + " In Stock)";
    });
    IRSteamElementsPopUp.forEach(function (element) {
        element.textContent = IRSteamPrice + " T (" + IRSteamAvailGlobal + ")";
    });
    document.querySelectorAll(".buytf2btn").forEach(function (link) {
        link.href = 'https://iraniansteam.ir/tf2';
    });
    IRSteamPriceCheck = true;
    AddLoadingBar(23);
}

function LoadIRSteamPriceTimeout() {
    IRSteamPrice = 0;
    IRSteamPriceGlobal = 0;
    IRSteamAvailGlobal = 0;
    console.log("%c[SteamCurrencytoToman] %cIranian Steam Timed out!", "color:#2196F3; font-weight:bold;", "color:null");
    var IRSteamElements = document.querySelectorAll(".irsteamprice");
    var IRSteamElementsPopUp = document.querySelectorAll(".popupirsteamprice");
    IRSteamElements.forEach(function (element) {
        element.textContent = "Error!";
    });
    IRSteamElementsPopUp.forEach(function (element) {
        element.textContent = "Error!";
    });
    IRSteamPriceCheck = true;
    AddLoadingBar(23);
}

function GetDRSteamPrice() {
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://dragonsteam.net/tf2/key/info',
        data: {},
        dataType: 'json',
        timeout: 1000,
        onload: LoadDRSteamPrice,
        ontimeout: LoadDRSteamPriceTimeout,
        onerror: LoadDRSteamPriceTimeout,
    })
}

function LoadDRSteamPrice(DRSteamObject) {
    var DRSteamParser = new DOMParser();
    var DRSteamResponseDoc = DRSteamParser.parseFromString(DRSteamObject.responseText, "text/html");
    var DRSteamDataFound = JSON.parse(DRSteamResponseDoc.querySelector("body").innerHTML);
    DRSteamPrice = DRSteamDataFound.keyPrice.price_sell.toLocaleString();
    DRSteamPriceGlobal = Math.ceil(DRSteamPrice.replace(',', '.'));
    DRSteamAvailGlobal = DRSteamDataFound.keyCount;
    console.log("%c[SteamCurrencytoToman] %cDragon Steam Price: " + DRSteamPriceGlobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    console.log("%c[SteamCurrencytoToman] %cDragon Steam Quantity: " + DRSteamAvailGlobal + " Keys", "color:#2196F3; font-weight:bold;", "color:null");
    document.querySelectorAll(".dragonsteamprice").forEach(function (element) {
        element.textContent = DRSteamPrice + " T (" + DRSteamAvailGlobal + " In Stock)";
    });
    document.querySelectorAll(".popupdragonsteamprice").forEach(function (element) {
        element.textContent = DRSteamPrice + " T (" + DRSteamAvailGlobal + ")";
    });
    document.querySelectorAll(".buytf2btn").forEach(function (link) {
        link.href = 'https://dragonsteam.net/shop/tf2/key';
    });
    DRSteamPriceCheck = true;
    AddLoadingBar(23);
}

function LoadDRSteamPriceTimeout() {
    DRSteamPrice = 0;
    DRSteamPriceGlobal = 0;
    DRSteamAvailGlobal = 0;
    console.log("%c[SteamCurrencytoToman] %cDragon Steam Timed out!", "color:#2196F3; font-weight:bold;", "color:null");
    document.querySelectorAll(".dragonsteamprice").forEach(function (element) {
        element.textContent = "Error!";
    });
    document.querySelectorAll(".popupdragonsteamprice").forEach(function (element) {
        element.textContent = "Error!";
    });
    DRSteamPriceCheck = true;
    AddLoadingBar(23);
}

function GetMarketPrice() {
    if (CurrRegion === "UAH") {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=18',
            dataType: 'json',
            onload: LoadMarketPrice,
        })
        return;
    } else if (CurrRegion === "USD") {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=1',
            dataType: 'json',
            onload: LoadMarketPrice,
        })
        return;
    } else if (CurrRegion === "EUR") {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=3',
            dataType: 'json',
            onload: LoadMarketPrice,
        })
        return;
    }
}

function LoadMarketPrice(MarketPriceObject) {
    var MarketPriceParser = new DOMParser();
    var MarketPriceResponseDoc = MarketPriceParser.parseFromString(MarketPriceObject.responseText, "text/html");
    var MarketPriceDataFound = JSON.parse(MarketPriceResponseDoc.querySelector("body").innerHTML);
    if (CurrRegion === "UAH") {
        MarketPrice = MarketPriceDataFound.lowest_price.replace('₴', '').replace(',', '.');
        MarketPriceGlobal = Math.floor(MarketPriceDataFound.lowest_price.replace('₴', '').replace(',', '.') * 0.87);
        console.log("%c[SteamCurrencytoToman] %cKey Market Price: " + MarketPriceGlobal + "₴", "color:#2196F3; font-weight:bold;", "color:null");
        document.querySelectorAll(".marketsteamprice").forEach(function (element) {
            element.textContent = MarketPrice.replace('.', ',') + "₴ (" + MarketPriceGlobal + "₴)";
        });
        document.querySelectorAll(".popupmarketsteamprice").forEach(function (element) {
            element.textContent = MarketPrice.replace('.', ',') + "₴ (" + MarketPriceGlobal + "₴)";
        });
        MarketPriceCheck = true;
        AddLoadingBar(23);
        return;
    } else if (CurrRegion === "USD") {
        MarketPrice = MarketPriceDataFound.lowest_price.replace('$', '').replace(',', '.');
        MarketPriceGlobal = (MarketPriceDataFound.lowest_price.replace('$', '').replace(',', '.') * 0.87).toFixed(2);
        console.log("%c[SteamCurrencytoToman] %cKey Market Price: $" + MarketPriceGlobal, "color:#2196F3; font-weight:bold;", "color:null");
        document.querySelectorAll(".marketsteamprice").forEach(function (element) {
            element.textContent = "$" + MarketPrice + " ($" + MarketPriceGlobal + ")";
        });
        document.querySelectorAll(".popupmarketsteamprice").forEach(function (element) {
            element.textContent = "$" + MarketPrice + " ($" + MarketPriceGlobal + ")";
        });
        MarketPriceCheck = true;
        AddLoadingBar(23);
        return;
    } else if (CurrRegion === "EUR") {
        MarketPrice = MarketPriceDataFound.lowest_price.replace('€', '').replace(',', '.').replace('.--', '.00');
        MarketPriceGlobal = (MarketPriceDataFound.lowest_price.replace('€', '').replace(',', '.').replace('.--', '.00') * 0.87).toFixed(2);
        console.log("%c[SteamCurrencytoToman] %cKey Market Price: " + MarketPriceGlobal + "€", "color:#2196F3; font-weight:bold;", "color:null");
        document.querySelectorAll(".marketsteamprice").forEach(function (element) {
            element.textContent = MarketPrice.replace('.', ',') + "€ (" + MarketPriceGlobal.replace('.', ',') + "€)";
        });
        document.querySelectorAll(".popupmarketsteamprice").forEach(function (element) {
            element.textContent = MarketPrice.replace('.', ',') + "€ (" + MarketPriceGlobal.replace('.', ',') + "€)";
        });
        MarketPriceCheck = true;
        AddLoadingBar(23);
        return;
    }
}

function GotAllPrices() {
    return DRSteamPriceCheck && MarketPriceCheck && IRSteamPriceCheck;
}

function WaitForPrices() {
    const interval = 500;
    const CheckPrices = setInterval(() => {
        if (GotAllPrices()) {
            clearInterval(CheckPrices);
            GetFinalKeyPrice();
        }
    }, interval);
}

function GetFinalKeyPrice() {
    if (DRSteamPriceGlobal !== 0 && IRSteamPriceGlobal !== 0) {
        if (DRSteamPrice > IRSteamPrice) {
            AddLoadingBar(33);
            FinalKeyPrice = IRSteamPriceGlobal;
            console.log("%c[SteamCurrencytoToman] %cUsing Iranian Steam Key Pricing", "color:#2196F3; font-weight:bold;", "color:null");
        } else {
            AddLoadingBar(33);
            FinalKeyPrice = DRSteamPriceGlobal;
            console.log("%c[SteamCurrencytoToman] %cUsing Dragon Steam Key Pricing", "color:#2196F3; font-weight:bold;", "color:null");
        }
    } else if (DRSteamPriceGlobal == 0 && IRSteamPriceGlobal !== 0) {
        AddLoadingBar(33);
        FinalKeyPrice = IRSteamPriceGlobal;
        console.log("%c[SteamCurrencytoToman] %cUsing Iranian Steam Key Pricing", "color:#2196F3; font-weight:bold;", "color:null");
    } else if (DRSteamPriceGlobal !== 0 && IRSteamPriceGlobal == 0) {
        AddLoadingBar(33);
        FinalKeyPrice = DRSteamPriceGlobal;
        console.log("%c[SteamCurrencytoToman] %cUsing Dragon Steam Key Pricing", "color:#2196F3; font-weight:bold;", "color:null");
    }

    if (typeof FinalKeyPrice !== "undefined" && MarketPriceCheck === true) {
        if (CurrRegion === "UAH") {
            UAHtoTomanW();
            UAHtoToman(labels);
            return;
        } else if (CurrRegion === "USD") {
            USDtoTomanW();
            USDtoToman(labels);
            return;
        } else if (CurrRegion === "EUR") {
            EURtoTomanW();
            EURtoToman(labels);
            return;
        }
    } else {
        AddLoadingBar(33);
    }
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
    '_3j4dI1yA7cRfCvK8h406OB',
    '_3fFFsvII7Y2KXNLDk_krOW',
    'Wh0L8EnwsPV_8VAu8TOYr',
    'price',
    'savings',
    'item_def_price',
    'market_commodity_orders_header_promote',
    'market_listing_price',
    'normal_price',
];

function UAHtoToman(labels) {
    if (window.location.href.indexOf("steampowered") != -1) {
        var re = /(\D*)(\d *\S*)/;
        for (label in labels) {
            let price = document.querySelectorAll(`.${labels[label]}`);
            if (price.length == 0)
                continue;
            for (ind in price) {
                if (re.test(price[ind].textContent)) {
                    let matchItem = re.exec(price[ind].textContent);
                    if (matchItem[0].indexOf('₴') >= 0 && typeof FinalKeyPrice !== 'undefined' && FinalKeyPrice !== null && FinalKeyPrice !== '') {
                        if (matchItem[0].indexOf('Your Price:') >= 0) {
                            let p = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                            if (p > MarketPriceGlobal) {
                                if (typeof Wallet !== 'undefined' && Wallet !== null && Wallet !== '') {
                                    var walletcal = parseFloat(Wallet.replace(' ', '').replace('₴', '').replace(',', '.'));
                                }
                                var calpricesteam = Math.ceil(p / MarketPriceGlobal);
                                var calpricefinal = (calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcal) {
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcal.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                } else {
                                    var needed = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcal);
                                    var neededkey = Math.ceil(needed / MarketPriceGlobal);
                                    var neededfinal = (neededkey * FinalKeyPrice).toLocaleString("en-US");
                                    if (typeof walletcal !== 'undefined' && walletcal !== null && walletcal !== '') {
                                        price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcal.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededfinal + " T (" + neededkey + "🔑) = " + needed.toFixed(2).toString().replace('.', ',') + "₴[/R]\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                    }
                                }
                            } else {
                                var calpricesteam = (p / MarketPriceGlobal).toPrecision(2);
                                var calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcal) {
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcal.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]\">" + calpricefinal + " T (" + calpricesteam + "🔑)" + "</div></div>";
                                } else {
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcal.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededfinal + " T (" + neededkey + "🔑) = " + needed.toFixed(2).toString().replace('.', ',') + "₴[/R]\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                }
                            }
                        } else {
                            let p = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                            if (p > MarketPriceGlobal) {
                                if (typeof Wallet !== 'undefined' && Wallet !== null && Wallet !== '') {
                                    var walletcal = parseFloat(Wallet.replace(' ', '').replace('₴', '').replace(',', '.'));
                                }
                                var calpricesteam = Math.ceil(p / MarketPriceGlobal);
                                var calpricefinal = (calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcal) {
                                    price[ind].setAttribute('ogpricetooltip', "[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcal.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]");
                                } else {
                                    var needed = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcal);
                                    var neededkey = Math.ceil(needed / MarketPriceGlobal);
                                    var neededfinal = (neededkey * FinalKeyPrice).toLocaleString("en-US");
                                    if (typeof walletcal !== 'undefined' && walletcal !== null && walletcal !== '') {
                                        price[ind].setAttribute('ogpricetooltip', "[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcal.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededfinal + " T (" + neededkey + "🔑) = " + needed.toFixed(2).toString().replace('.', ',') + "₴[/R]");
                                    }
                                }
                            } else {
                                var calpricesteam = (p / MarketPriceGlobal).toPrecision(2);
                                var calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcal) {
                                    price[ind].setAttribute('ogpricetooltip', "[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcal.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]");
                                } else {
                                    var needed = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcal);
                                    var neededkey = Math.ceil(needed / MarketPriceGlobal);
                                    var neededfinal = (neededkey * FinalKeyPrice).toLocaleString("en-US");
                                    if (typeof walletcal !== 'undefined' && walletcal !== null && walletcal !== '') {
                                        price[ind].setAttribute('ogpricetooltip', "[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcal.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededfinal + " T (" + neededkey + "🔑) = " + needed.toFixed(2).toString().replace('.', ',') + "₴[/R]");
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (typeof Wallet !== 'undefined' && Wallet !== null && Wallet !== '') {
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
                        var walletcalm = parseFloat(Wallet.replace(' ', '').replace('₴', '').replace(',', '.'));
                        var calpricesteamm = (pm / MarketPriceGlobal).toPrecision(2);
                        var calpricefinalm = Math.ceil(calpricesteamm * FinalKeyPrice).toLocaleString("en-US");
                        if (pricem[indm].innerHTML.indexOf("🔑") == -1) {
                            if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcalm) {
                                pricem[indm].innerHTML = "<font color=\"white\">" + matchItem[2] + "</font><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcalm.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]\"><font color=\"silver\">" + calpricefinalm + " T (" + eToNumber(calpricesteamm) + "🔑)</font></div></div>";
                            } else {
                                var neededm = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcalm);
                                var neededmkey = (neededm / MarketPriceGlobal).toPrecision(2);
                                var neededmfinal = Math.ceil(neededmkey * FinalKeyPrice).toLocaleString("en-US");
                                pricem[indm].innerHTML = "<font color=\"white\">" + matchItem[2] + "</font><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcalm.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededmfinal + " T (" + eToNumber(neededmkey) + "🔑) = " + neededm.toFixed(2).toString().replace('.', ',') + "₴[/R]\"><font color=\"silver\">" + calpricefinalm + " T (" + eToNumber(calpricesteamm) + "🔑)</font></div></div>";
                            }
                        }
                    }
                }
            }
            if (typeof Wallet !== 'undefined' && Wallet !== null && Wallet !== '') {
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
                        var walletcalms = parseFloat(Wallet.replace(' ', '').replace('₴', '').replace(',', '.'));
                        var calpricesteamms = (pms / MarketPriceGlobal).toPrecision(2);
                        var calpricefinalms = Math.ceil(calpricesteamms * FinalKeyPrice).toLocaleString("en-US");
                        if (pricems[indms].innerHTML.indexOf("🔑") == -1) {
                            if (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') < walletcalms) {
                                pricems[indms].innerHTML = "Starting at:<br><font color=\"white\">" + matchItem[2] + "</font><br><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R] " + walletcalms.toString().replace('.', ',') + "₴[/R]\n[C]*You can buy it!*[/C]\"><font color=\"silver\">" + calpricefinalms + " T (" + eToNumber(calpricesteamms) + "🔑)</font></div></div>";
                            } else {
                                var neededms = (matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.') - walletcalms);
                                var neededmskey = (neededms / MarketPriceGlobal).toPrecision(2);
                                var neededmsfinal = Math.ceil(neededmskey * FinalKeyPrice).toLocaleString("en-US");
                                pricems[indms].innerHTML = "Starting at:<br><font color=\"white\">" + matchItem[2] + "</font><br><div ogpricetooltip=\"[L]*Original Price:  *[/L][R]" + matchItem[2].replace(' ', '') + "[/R]\n*Your Wallet: *[R]- " + walletcalms.toString().replace('.', ',') + "₴[/R]\n*You Need:  *[R]" + neededmsfinal + " T (" + eToNumber(neededmskey) + "🔑) = " + neededms.toFixed(2).toString().replace('.', ',') + "₴[/R]\"><font color=\"silver\">" + calpricefinalms + " T (" + eToNumber(calpricesteamms) + "🔑)</font></div></div>";
                            }
                        }
                    }
                }
                if (typeof Wallet !== 'undefined' && Wallet !== null && Wallet !== '') {
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
                        var calpricesteammsw = (pmsw / MarketPriceGlobal).toPrecision(3);
                        var calpricefinalmsw = Math.ceil(calpricesteammsw * FinalKeyPrice).toLocaleString("en-US");
                        if (pricemsw[indmsw].innerHTML.indexOf("🔑") == -1) {
                            pricemsw[indmsw].innerHTML = "<a id=\"marketWalletBalance\" href=\"https://store.steampowered.com/account/\">Wallet balance <span id=\"marketWalletBalanceAmount\">" + matchItem[2] + " (" + eToNumber(calpricesteammsw) + "🔑)</span></a><br><a href=\"https://steamcommunity.com/my/inventory/\">View Inventory</a></span>"
                        }
                    }
                }
            }
        }
    }
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
                var calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
                var calpricesteamwpending = (pendingn / MarketPriceGlobal).toPrecision(3);
                Wallet = pricew[indw].textContent.replace(/\Pending: .*/, '');
                const pendingtooltipelement = document.querySelector('.tooltip');
                var pendingtooltip = pendingtooltipelement.getAttribute('data-tooltip-html');
                pricew[indw].innerHTML = pricew[indw].textContent.replace(/\Pending: .*/, '') + " (" + calpricesteamw + "🔑)<br><span class=\"tooltip\" ogpricetooltip=\"" + pendingtooltip.replace('. ', '.<br>') + "\">" + pending + " (" + calpricesteamwpending + "🔑)</span>";
            } else if (matchItemw[0].indexOf('₴') >= 0 && !matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace(' ', '').replace('₴', '').replace(',', '.');
                var calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
                Wallet = pricew[indw].textContent;
                pricew[indw].textContent = pricew[indw].textContent + " (" + calpricesteamw + "🔑)";
            }
        }
        if (typeof Wallet !== 'undefined' && Wallet !== null && Wallet !== '') {
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
                                if (p > parseFloat(MarketPriceGlobal)) {
                                    var calpricesteam = Math.ceil(p / MarketPriceGlobal);
                                    var calpricefinal = (calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div title=\"" + matchItem[2] + "\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                } else {
                                    var calpricesteam = (p / MarketPriceGlobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div title=\"" + matchItem[2] + "\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                }
                            } else {
                                let p = matchItem[0].replace(',', '.').replace('$', '');
                                if (p > parseFloat(MarketPriceGlobal)) {
                                    var calpricesteam = Math.ceil(p / MarketPriceGlobal);
                                    var calpricefinal = (calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                    price[ind].setAttribute('title', "$" + matchItem[2]);
                                } else {
                                    var calpricesteam = (p / MarketPriceGlobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString("en-US");
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
                var calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
                var calpricesteamwpending = (pendingn / MarketPriceGlobal).toPrecision(3);
                pricew[indw].textContent = pricew[indw].textContent.replace(/\Pending: .*/, '') + " (" + calpricesteamw + "🔑)" + pending + " (" + calpricesteamwpending + "🔑)";
            } else if (matchItemw[0].indexOf('$') >= 0 && !matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace(',', '.').replace('$', '');
                var calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
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
                                if (p > MarketPriceGlobal) {
                                    var calpricesteam = Math.ceil(p / MarketPriceGlobal);
                                    var calpricefinal = (calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div title=\"" + matchItem[2] + "\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                } else {
                                    var calpricesteam = (p / MarketPriceGlobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                    price[ind].innerHTML = "<div class=\"your_price_label\">Your Price:</div><div title=\"" + matchItem[2] + "\">" + calpricefinal + " T (" + calpricesteam + "🔑)</div></div>";
                                }
                            } else {
                                let p = matchItem[2].replace(',--€', '').replace(',', '.').replace('€', '');
                                if (p > MarketPriceGlobal) {
                                    var calpricesteam = Math.ceil(p / MarketPriceGlobal);
                                    var calpricefinal = (calpricesteam * FinalKeyPrice).toLocaleString("en-US");
                                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                                    price[ind].setAttribute('title', matchItem[2]) + "€";
                                } else {
                                    var calpricesteam = (p / MarketPriceGlobal).toPrecision(2);
                                    var calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString("en-US");
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
                var calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
                var calpricesteamwpending = (pendingn / MarketPriceGlobal).toPrecision(3);
                pricew[indw].textContent = pricew[indw].textContent.replace(/\Pending: .*/, '') + " (" + calpricesteamw + "🔑)" + pending + " (" + calpricesteamwpending + "🔑)";
            } else if (matchItemw[0].indexOf('€') >= 0 && !matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace(',--€', '').replace(',', '.').replace('€', '');
                var calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
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
        }, 7000);
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

function AddLoadingBar(amount) {
    var currentwidth = parseFloat(LoadingBar.style.width) || 0;
    var newwidth = Math.min(currentwidth + amount, 100);
    LoadingBar.style.width = newwidth + '%';
}

function waitloadingbar() {
    return new Promise(resolve => {
        var checkwidth = function () {
            var currentWidth = parseFloat(LoadingBar.style.width) || 0;
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
    LoadingBar = document.createElement('div');
    LoadingBar.id = 'loading-bar';
    LoadingBar.style.position = 'fixed';
    LoadingBar.style.top = '0';
    LoadingBar.style.left = '0';
    LoadingBar.style.width = '0%';
    LoadingBar.style.height = '3px';
    LoadingBar.style.backgroundColor = '#00adee';
    LoadingBar.style.zIndex = '9999';
    LoadingBar.style.transition = 'opacity 0.5s ease, width 0.5s ease';
    document.body.appendChild(LoadingBar);

    waitloadingbar().then(() => {
        LoadingBar.style.width = '100%';
        setTimeout(() => {
            LoadingBar.style.opacity = '0';
            setTimeout(() => {
                LoadingBar.remove();
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
        link.className = 'btnv6_blue_hoverfade btn_medium buytf2btn';
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
    if (CurrRegion === "UAH") {
        UAHtoToman(labels);
        return;
    } else if (CurrRegion === "USD") {
        USDtoToman(labels);
        return;
    } else if (CurrRegion === "EUR") {
        EURtoToman(labels);
        return;
    }
}

function handlemutations(mutationsList) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (let node of mutation.addedNodes) {
                if (GotAllPrices()) {
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

if (GotAllPrices()) {
    processnode(document.body);
}
