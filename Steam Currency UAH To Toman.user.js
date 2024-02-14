// ==UserScript==
// @name               Steam Currency UAH₴ To Toman
// @version            1.06
// @description        Converts UAH₴ to Toman
// @author             M-Zoghi
// @namespace          SteamCurrencyConvertUAHtoToman
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
    console.log("%c[UAHtoToman] " + "%cIranian Steam Key Price: " + irsteamkeypriceglobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    console.log("%c[UAHtoToman] " + "%cIranian Steam Key Quantity: " + irsteamkeyquantityglobal, "color:#2196F3; font-weight:bold;", "color:null");
    irsteamkeypricecheck = true;
}

function GetKeyPriceDragon() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://dragonsteam.net/shop/tf2/key',
        dataType: 'json',
        onload: LoadDragonSteam,
    })
}

function LoadDragonSteam(dragonsteamobject) {
    var dragonsteamparser = new DOMParser();
    var dragonsteamresponseDoc = dragonsteamparser.parseFromString(dragonsteamobject.responseText, "text/html");
    var dragonsteamfounddata = dragonsteamresponseDoc.querySelector("meta[name='og:description']").getAttribute("content").replace(" تومان ", "").replace("خرید کلید تی اف 2 | تحویل اتوماتیک توسط ربات | قیمت : ", "");
    dragonsteamkeypriceg = dragonsteamfounddata.replace('.', ',');
    dragonsteamkeypriceglobal = Math.ceil(parseFloat(dragonsteamfounddata));
    dragonsteamkeyavailabilityglobal = "In Stock";
    console.log("%c[UAHtoToman] " + "%cDragon Steam Key Price: " + dragonsteamkeypriceglobal + " Toman", "color:#2196F3; font-weight:bold;", "color:null");
    dragonsteamkeypricecheck = true;
    if (marketsteamkeypricecheck === true) {
        UAHtoToman(labels);
        UAHtoTomanW();
        UAHtoTomanMarketS();
        UAHtoTomanMarket();
    }
}

function GetKeyPriceMarket() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=18',
        dataType: 'json',
        onload: LoadMarketSteam,
    })
}

function LoadMarketSteam(marketsteamobject) {
    var marketsteamparser = new DOMParser();
    var marketsteamresponseDoc = marketsteamparser.parseFromString(marketsteamobject.responseText, "text/html");
    var marketsteamfounddata = JSON.parse(marketsteamresponseDoc.querySelector("body").innerHTML);
    marketsteamkeypriceg = marketsteamfounddata["lowest_price"].replace('₴', '').replace(',', '.');
    marketsteamkeypriceglobal = Math.floor(marketsteamfounddata["lowest_price"].replace('₴', '').replace(',', '.') * 0.87);
    console.log("%c[UAHtoToman] " + "%cMarket Price: " + marketsteamkeypriceglobal + "₴", "color:#2196F3; font-weight:bold;", "color:null");
    marketsteamkeypricecheck = true;
    if (dragonsteamkeypricecheck === true) {
        UAHtoToman(labels);
        UAHtoTomanW();
        UAHtoTomanMarketS();
        UAHtoTomanMarket();
    }
}

GetKeyPriceDragon();
GetKeyPriceIR();
GetKeyPriceMarket();
setTimeout(Popup, 5000);
setTimeout(KeyWidget, 5000);

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
    'price',
    'savings',
    'item_def_price',
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
                    if (matchItem[0].indexOf('₴') >= 0) {
                        let p = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                        if (p > marketsteamkeypriceglobal) {
                            var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                            var calpricefinal = (calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                            price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                            price[ind].setAttribute('title', matchItem[2]);
                        } else {
                            var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(2);
                            var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                            price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                            price[ind].setAttribute('title', matchItem[2]);
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
                var calpricesteamw = (pw / marketsteamkeypriceglobal).toPrecision(3);
                var calpricesteamwpending = (pendingn / marketsteamkeypriceglobal).toPrecision(3);
                pricew[indw].textContent = pricew[indw].textContent.replace(/\Pending: .*/, '') + " (" + calpricesteamw + "🔑)" + pending + " (" + calpricesteamwpending + "🔑)";
            } else if (matchItemw[0].indexOf('₴') >= 0 && !matchItemw[0].includes('Pending')) {
                let pw = matchItemw[2].replace(' ', '').replace('₴', '').replace(',', '.');
                var calpricesteamw = (pw / marketsteamkeypriceglobal).toPrecision(3);
                pricew[indw].textContent = pricew[indw].textContent + " (" + calpricesteamw + "🔑)";
            }
        }
    }
}

function UAHtoTomanMarket() {
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
                        let p = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                        var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(2);
                        var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                        if (pricem[indm].innerHTML.indexOf("🔑") == -1) {
                            pricem[indm].innerHTML = "<font color=\"white\">" + matchItem[2] + "</font><br><font color=\"silver\">" + calpricefinal + " T (" + eToNumber(calpricesteam) + "🔑)</font>";
                        }

                    }
                }
            }
        }
    }
}

function UAHtoTomanMarketS() {
    if (window.location.href.indexOf("market") != -1) {
        var rem = /(\D*)(.*(?:[₴]))/;
        let pricem = document.querySelectorAll(`.normal_price`);
        for (labelmarket in pricem) {
            if (pricem.length == 0)
                continue;
            for (indm in pricem) {
                if (rem.test(pricem[indm].textContent)) {
                    let matchItem = rem.exec(pricem[indm].textContent);
                    if (matchItem[0].indexOf('₴') >= 0) {
                        let p = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                        var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(2);
                        var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                        if (pricem[indm].innerHTML.indexOf("🔑") == -1) {
                            pricem[indm].innerHTML = "Starting at:<br><font color=\"white\">" + matchItem[2] + "</font><br><font color=\"silver\">" + calpricefinal + " T (" + eToNumber(calpricesteam) + "🔑)</font>";
                        }
                    }
                }
            }
        }
    }
    UAHtoTomanMarketSW();
}

function UAHtoTomanMarketSW() {
    if (window.location.href.indexOf("market") != -1) {
        var rem = /(\D*)(.*(?:[₴]))/;
        let pricem = document.querySelectorAll(`.user_info_text`);
        for (labelmarket in pricem) {
            if (pricem.length == 0)
                continue;
            for (indm in pricem) {
                if (rem.test(pricem[indm].textContent)) {
                    let matchItem = rem.exec(pricem[indm].textContent);
                    if (matchItem[0].indexOf('₴') >= 0) {
                        let p = matchItem[2].replace(' ', '').replace('₴', '').replace(',', '.');
                        var calpricesteam = (p / marketsteamkeypriceglobal).toPrecision(3);
                        var calpricefinal = Math.ceil(calpricesteam * dragonsteamkeypriceglobal).toLocaleString("en-US");
                        if (pricem[indm].innerHTML.indexOf("🔑") == -1) {
                            pricem[indm].innerHTML = "<a id=\"marketWalletBalance\" href=\"https://store.steampowered.com/account/\">Wallet balance <span id=\"marketWalletBalanceAmount\">" + matchItem[2] + " (" + eToNumber(calpricesteam) + "🔑)</span></a><br><a href=\"https://steamcommunity.com/my/inventory/\">View Inventory</a></span>"
                        }
                    }
                }
            }
        }
    }
}

function Popup() {

    var PopPop = document.createElement('style');
    PopPop.type = 'text/css';
    PopPop.innerHTML = '.ico16 { background: none; } ';
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
        if (irsteamkeypricecheck === true) {
            KeyISPA.textContent = irsteamkeypriceg + " T"
        } else {
            KeyISPA.textContent = "Error"
        }
        KeyISPA.className = 'account_name';
        KeyISP.appendChild(KeyISPA);

        const KeyISPI = document.createElement('img');
        KeyISPI.className = 'ico16';
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
        if (dragonsteamkeypricecheck === true) {
            KeyDSPA.textContent = dragonsteamkeypriceg + " T"
        } else {
            KeyDSPA.textContent = "Error";
        }
        KeyDSPA.className = 'account_name';
        KeyDSP.appendChild(KeyDSPA);

        const KeyDSPI = document.createElement('img');
        KeyDSPI.className = 'ico16';
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
        if (marketsteamkeypricecheck === true) {
            KeyMSPA.textContent = marketsteamkeypriceg.replace('.', ',') + "₴ (" + marketsteamkeypriceglobal + "₴)";
        } else {
            KeyMSPA.textContent = "Error";
        }
        KeyMSPA.className = 'account_name';
        KeyMSP.appendChild(KeyMSPA);

        const KeyMSPI = document.createElement('img');
        KeyMSPI.className = 'ico16';
        KeyMSPI.src = 'https://store.steampowered.com/favicon.ico';
        KeyMSP.prepend(KeyMSPI);

        Popup.appendChild(KeyISP);
        Popup.appendChild(KeyDSP);
        Popup.appendChild(KeyMSP);
    }
}

function KeyWidget() {

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
    rightcolumn.innerHTML = '.rightcolumn { color: #67c1f5; }';
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
    irsteamprice.className = 'rightcolumn';
    irsteamprice.title = ("Buy keys from Iranian Steam");
    irsteamprice.target = '_blank';
    irsteamprice.href = 'https://iraniansteam.ir/tf2';
    if (irsteamkeypricecheck === true) {
        irsteamprice.textContent = irsteamkeypriceg + " T (" + irsteamkeyquantityglobal + " In Stock)";
    } else {
        irsteamprice.textContent = "Error";
    }

    let line = document.createElement('p');
    let lineText = document.createElement('span');
    lineText.className = 'leftcolumn';
    lineText.textContent = ("Iranian Steam: ");
    line.appendChild(lineText);
    line.appendChild(irsteamprice);

    blockInner.appendChild(line);

    const dragonsteamprice = document.createElement('a');
    dragonsteamprice.className = 'rightcolumn';
    dragonsteamprice.title = ("Buy keys from Dragon Steam");
    dragonsteamprice.target = '_blank';
    dragonsteamprice.href = 'https://dragonsteam.net/shop/tf2/key';
    if (dragonsteamkeypricecheck === true) {
        dragonsteamprice.textContent = dragonsteamkeypriceg + " T (" + dragonsteamkeyavailabilityglobal + ")";
    } else {
        dragonsteamprice.textContent = "Error";
    }

    line = document.createElement('p');
    lineText = document.createElement('span');
    lineText.className = 'leftcolumn';
    lineText.textContent = ("Dragon Steam: ");
    line.appendChild(lineText);
    line.appendChild(dragonsteamprice);

    blockInner.appendChild(line);

    const marketsteamprice = document.createElement('a');
    marketsteamprice.className = 'rightcolumn';
    marketsteamprice.title = ("View on Community Market");
    marketsteamprice.target = '_blank';
    marketsteamprice.href = 'https://steamcommunity.com/market/listings/440/Mann%20Co.%20Supply%20Crate%20Key';
    if (marketsteamkeypricecheck === true) {
        marketsteamprice.textContent = "" + marketsteamkeypriceg.replace('.', ',') + "₴ (" + marketsteamkeypriceglobal + "₴)";
    } else {
        marketsteamprice.textContent = "Error";
    }

    line = document.createElement('p');
    lineText = document.createElement('span');
    lineText.className = 'leftcolumn';
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
        link.href = 'https://dragonsteam.net/shop/tf2/key';
        const element = document.createElement('span');
        element.dataset.tooltipText = "Buy TF2 Keys";
        element.innerHTML = "<span>Buy 🔑</span>";
        link.appendChild(element);
        container.append(link, container.firstChild);
    }
})();

$(window).on("scroll", function () {
    if (dragonsteamkeypricecheck === true && marketsteamkeypricecheck === true) {
        UAHtoToman(labels);
        UAHtoTomanMarketS();
        UAHtoTomanMarket();
    }
})
