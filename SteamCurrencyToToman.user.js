// ==UserScript==
// @name               Steam Currency To Toman
// @version            1.73
// @description        Converts Steam Currency to Toman
// @author             M-Zoghi
// @namespace          SteamCurrencyToToman
// @icon               http://store.steampowered.com/favicon.ico
// @match              http*://store.steampowered.com/*
// @match              http*://steamcommunity.com/*
// @grant              GM_xmlhttpRequest
// @updateURL          https://raw.githubusercontent.com/M-Zoghi/SteamCurrencytoToman/main/SteamCurrencyToToman.user.js
// @downloadURL        https://raw.githubusercontent.com/M-Zoghi/SteamCurrencytoToman/main/SteamCurrencyToToman.user.js
// @connect            fastkeys.ir
// @connect            iraniansteam.ir
// @connect            dragonsteam.net
// @connect            steamcommunity.com
// @license            MIT License
// ==/UserScript==

'use strict';

const LOG_TAG = '%c[SteamCurrencytoToman] %c';
const LOG_STYLES = ['color:#2196F3; font-weight:bold;', ''];

const STEAM_FEE = 0.87;

const SCTT_OWN_PRICE_CLASSES = [
    'popupfksteamprice', 'popupirsteamprice', 'popupdragonsteamprice', 'popupmarketsteamprice',
    'fksteamprice', 'irsteamprice', 'dragonsteamprice', 'marketsteamprice',
];

const PROVIDERS = {
    fk: { name: 'Fast Keys', url: 'https://fastkeys.ir/products/tf2-key', cls: 'fksteamprice', popupCls: 'popupfksteamprice', favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACzklEQVR4AXxTTUhbQRD+dqNt1LMWiUWCwVQjSk4aDBKoxB/wZiEWDx56bYM/p0YPhR48KCTYQ3u0akUkGhQPetCojdWDJkrRVDQitRjjTVCTqnmd2VaoBft4s+y+t/PNN9/MSPx5jEbjI7vd7unu7v46NjaWnJyc1IaHh7WhoSFtYmJC8/v9qd7e3mhdXd3boqKix3/coACKi4uflJWVfWxtbX2Tl5dnCQQCD/v7++H1euHz+dDX14eRkZEHUkpzS0vLa5vN9qm0tNTKIJIjE4CvubnZGY1GdYODg9jZ2cHFxQU0TVOWTCZxcHCA0dFRLC4uioaGBrvVan1XWFholPn5+S8aGxufbm5uIhgMKgedTgchBAdQJoQARVcWDocxNzcHp9Nps1gsL2V1dbULgG5paUldEELQ8f6Xwbe2tnB0dCQcDsczWVFRYVpbW8P19bXySqfTioU6/GdZXV2FyWQyyOzsbP3h4aGiXFBQgNraWuTk5NwBYfqMdasJnxOJBK6uroS8ubnB5eWlAqCcYDAY0NHRAbfbrYz3Ho8HXV1d6OnpQX19PWOxM05PT3+Xkb8w+tnZGTIzM8F6LCwsgG1+fh6zs7NglpQu4vH4XXYsSlZWlmKwsbGB6elpLhUikQhY8fX1dYRCISwvL2NgYABcTg7IgXJzcyHPz89/Uj3B4qVSKZycnCgwBr41vnx8fIwglZlZMltqOMVWUv1jlZWVyMjIYGBVSrX5ZxFC3PlXVVWF3d3duFxZWfEDSNfU1CgWjE7ne18Wvby8XIlNXRmQRPnDzMxMiAVyOByKPl/6G4j3nCIbtTB3IQsbjsViXrm/v/+dhHGPj49/MZvNWltbG0pKSkD9ocCEENDr9aCZAQ0SmOnU1FSEUn/1jR41jdvb2+G9vb3nNL5eatEfTU1N6OzsRHt7u+oF7gGXywUaqgRN5XuqkIt8PnOevwAAAP//4InftgAAAAZJREFUAwA0DlaXQT/VpwAAAABJRU5ErkJggg==' },
    ir: { name: 'Iranian Steam',url: 'https://iraniansteam.ir/tf2', cls: 'irsteamprice', popupCls: 'popupirsteamprice', favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABx0lEQVR4AaSRTUhUURTHf+8+nBlp3mhFThRCTcxUtMhajBAPYqZFi9pERESkURFItaiFbYImojZtZt1CW1gDZQMtQjeiDIPgiGs/QBTUjfg5ouPIeMf34M3gVUcFL1z+5x7O/3fuvUdwxHU4QDcn6vt5lE6nI5lMpn57z4MBSUIeD/3+Y7wzTbM3HA5PHR7Qod+tcjMQMrioIzLbjaVYlAJFf6OL7+Kza37zX1BS69EYLyzIj0qNc9gNiHFaG9d6vLPyw6UzCOOUliouYw5FmHM8iqiAV5xkg3SdKN48fw7chohX54q3riVeZpui0bOK0zmogCJNNVVcOF6rYboeDjePxb2ta/8HrwcCWc/o2PRTITocX1lUgGSuWoPA/A3ueJsvGz7fi5n2Hw2LsU96YGYaa34rZacTqIAREnKD1ppVf3s+l38fbGvrcnf+Ibieo1GIuC7lG8dXFhXQR2H2K98SX5LPQvfvJX2p1O0g5BvhcUTKtzEolJ1OoAKcpC0uaDBA1EGLdfVfdm6vXRGwBkNWu+xr+LuXsZSrCLgKE+vw3Jrmzweglww7tSLALrwCnX54EgXrFXZm994XYJdbH7fUApNUWFsAAAD//7TtisYAAAAGSURBVAMA3Zp1IYz5quEAAAAASUVORK5CYII=' },
    dr: { name: 'Dragon Steam', url: 'https://dragonsteam.net/tf2/mann-co-supply-crate-key', cls: 'dragonsteamprice', popupCls: 'popupdragonsteamprice', favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADHklEQVR4AVyS3W8UVRjGf2dmh+7sDmuRllVi3e2mUPstUSP1ZjcQ02pMFMOVRGJIavRKL4z/hBdeEG5oJJGYKBol0ZhIwkVNcAX8gFC+2tKlmy7Q7XbZj86y3Z2dOZxpmyYwOU/eOTPv85znfc+r8dQTj8eTCt8ozMfjMamiD/Ue978ln0rnCYFYLHZSJUwpHFNIhEyXsEI82kpsD7nHpJRTmznq98baElAn/SGEmDBNSbTDI9HlsW8Q9vbA/kGNkV6HaNQlGGTCz92gs+FgU3XMMCSvDHh8+q7LF+87fJRqMXbwOdp7jtC/7yAD/TvpjjuEw3Jsk4Om1JKaJiYsC/r6dN4b0xkY1uja00nq9QBvJdd4qfdZ9GA/nbv2MzT0PIluD8NYd5JUJcijkYhkdDTA6GsewoTFRpQrhR7+Xh4hk5cU8j9x/eL3lAv3aLW6GBk2VTnrRRzVQKR0XdDT3eLQuGS1pqPrNfLL8N3ZIBf+iZG+lOPi1QzFcoaFbJMXXwix4xmJampKAxKlkuTGLRfNcQms2VRXPGZvV1laqnHixCVm5+oMvdxO1RbUHzVo2k3aDA9NI+ELKA3J6qrD4kydWKDB/+k8l/+dx6ldQ/dWyWQC5BZ3USm3USisICs2NFvKwcYtZASC+7kWV/+rU19p4NoNysUH3Jh5yFefBzn8Zjux3RWq1RKaV8Iu2lTL+AIZ38GUJwUh1YfmWou5xSbDnQ4HXg3ywSGLmXmXjkCeju02kVCN3s4KuaUmhYqOmpspX+C0qoGyHaC2ZtCxQ8dsE8QiDtPTDt+e1zl7WZDPO7yxp8He3Q5zSyaVuu7TTmsLCwt/qm5OlmyDO8Uw0grR1xviwwM6n70j+PIwfPK2xhG1H+zWuX7fIls08Twx6XN9B2Sz2Y8R2rnpbJAf0iF+n7VI5y0eahGsnRbutjAXbpqc+SvMlbsmDUc7t85RHtYFVESpjds1MTl9x+DMeYPjv2zj6x91jv9scPI3g1/TAeZyOk0H/+Rxn+NjS8Df+KquK1K2zanlghpCfwqLUKnIjOtySuWk/BwVt9ZjAAAA///2DmFTAAAABklEQVQDANLIU6Diw3D7AAAAAElFTkSuQmCC' },
};

const MARKET_URLS = {
    UAH: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=18',
    USD: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=1',
    EUR: 'https://steamcommunity.com/market/priceoverview/?appid=440&market_hash_name=Mann%20Co.%20Supply%20Crate%20Key&currency=3',
};

const MARKET_KEY_URL = 'https://steamcommunity.com/market/listings/440/Mann%20Co.%20Supply%20Crate%20Key';
const MARKET_FAVICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADF0lEQVR4AVSRa0gUURiG33POzGw7MzuzbheNtciKLkbRSleyIgszutcPIyXDoIKIILpRFEK3H9GN6EYlKGlZidW/LINSKQoq0Iwwak0tS1utxGrdPdM5lrYNPMycw/u855sZithr5EiXlZiSYfkDV+3EiU2CbkFE0CT3rMTAAohMrNJXYAycnKB3eY9whxRz0Myow/wCRcAinPojHJkRTor0LvuIzPaW9BTIDa6Qc9yhmyOcxQnQSzhCoBsWkpKS4PMNiItykRFZ6cgSiuRkLczU3VFHWcodBbHIkjmzpqPg7EGcP7YPl88fRm72SlDmWiod6VJXaOBcRpQsQhTE4jgMo0YMQ96O9Wj+0IbXb96jpu4t1mUvQ0baDHBOs6RLCVXWgKg+QlRR8A9ZMHNaCkLtnRjiT0Bu1mKkz5mKmpdvMT9tOlTm8kmXcs5SpUypBvoXufZ547AkYyYURYEDIl9XIO6EipWAqqBUS6WZK+bG+xMHgyguEKaBirtkbfZCpKdNwpSUMWho/Iz84nLce/gCE8aNQEVVTU+eaf0S6KUTW3GzIA97t2UjEBiL+MHxWLQgFVvWL4fCGLy2ibWr0jE5MArjk4ejsPQB7j9+Bc1tgLnc4kBV+Txu9FDs3LQSpRd3oSx/N3Iy56G+4ROiUS4+loPqZ/XYc7wUubsuoPD2I3AxJXPrYP30Fpp/s7qq8vkbdP0MY1B/G+PHDMXsackIfmzH05dBnCy+jw0HilBZ24BQtwNqmiACGCYcw6iiW0+UFeTsvxLKOXAF1TVBfO/6BVVVYIrR7zytx9FrlQhFAMW2QD1/ZGIaIIYeYrpRSL8N8lR0OKyovLYRB0sqUVb9CgXlz9EY6sSLphB+qFqPCMNALOL0olZbq6C4nhdWVPWQapm3njR14HRFLe7UNePGsyCqgm0gHg8cMfJ/6O5blKmHpEvFz0Xr9R0t1KNthOk+Vd/Z3X733RfUfQ3D8ViAGL0Py9MuMzIrHen2FMiH1jObWuKofzvxmKtVyyqhXrsZXjsCW2BZzcQwS7juzpIZmZWO5DcAAAD//9mcDx8AAAAGSURBVAMAuGEjOcYdU2UAAAAASUVORK5CYII=';
const LAST_UPDATE_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBElEQVR4AaSST2hTQRDGf/NeSRMUTUsvWsWLgiCCRUUQPIiCR0UoWqwgBT3VJHoQL0KusVCSgAcFFaUHJQj2JCh68KRQi3gRCvUQ/yIUG9T+0+w4u8WQlkYPHd43b3Znvm/mvd2IVdqKAnqeHs1R0CxPDY/0At2t+iwRsMKUZnhCB+MoWSOlUTpJ8EOz8VnNRdc1Fw9oJj6qF9lseRoCmieJ44P5w9Q4KSWSht1SZp8UqDnRbro4R1pvInrbatcuEeAbD0nSibLBiPdZZpG6Z8zZZqTm3GMp8tYCwgQ2+k7SHGGWYzLEF1Yyocp3ecGUXibJCePs8GVBwLr2M828jTtKK5vhIx31AzZdgTnqztHvSxcFHD22eGVo+cgNfkme375AYcyIu3xsb2wAHxLiEP3HCdStxF4skkR4Dew1oL3EmqfNx//AHqeM+XzougAjpIyY4RIb4+dMs4kWpjmOs55E1MZdXxIE2ku8sROo0GUnvk7324BbfHI5wuVJ8UBrVGSYCZ8PAjrIdvuaQ6hAO7g4OuiTzbDOp0hQZYZ38om+v7kgQIKfRh5gSs64r1yLkKoR0natX2qWccM8axhxs9yjg21Swf/EoBF5L8O8l3J91HAnLrtBKdZv2X4KYUKVSZQrLLA1LtEneRxNFgSa1o1QinyWEqejMr12wa7KEJONZFPwBwAA///Nt6gKAAAABklEQVQDANSPqiHtvF0gAAAAAElFTkSuQmCC';

let MarketPrice;
let MarketPriceGlobal;
let MarketPriceCheck = false;
let FKSteamPrice;
let FKSteamPriceGlobal;
let FKSteamAvailGlobal;
let FKSteamPriceCheck = false;
let IRSteamPrice;
let IRSteamPriceGlobal;
let IRSteamAvailGlobal;
let IRSteamPriceCheck = false;
let DRSteamPrice;
let DRSteamPriceGlobal;
let DRSteamAvailGlobal;
let DRSteamPriceCheck = false;
let FinalKeyPrice;
let CurrRegion;
let RegionCheck = false;
let Wallet;
let WalletValue;
let lastUpdatedGlobal;
let LoadingBar;
let _tooltipPollingStarted = false;

const labelsr = [
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
    '_79DIT7RUQ5g-',
    'global_action_link',
    'market_commodity_orders_header_promote',
    'market_listing_price',
    'normal_price',
    'NI9oaXH36YQ-',
    'LL0I8Yv1KjM-',
    'EZ-ocZV850k-',
    'Thio3V0imwc-',
    'f6hU22EA7Z8peFWZVBJU',
    '_3hEeummFKRey8l5VXxZwxz',
];

const labels = [
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
    '_1xgg-R84IHS6h5_x6ZycXi',
    '_2L23Sk2CNSFCplu_7mMmQx',
    't7Gt8aeopD7JPlhcNTqGV',
    'Wh0L8EnwsPV_8VAu8TOYr',
    'DOnsaVcV0Is-',
    'ywNldZ-YzEE-',
    'price',
    'savings',
    'item_def_price',
    'market_commodity_orders_header_promote',
    'market_listing_price',
    'normal_price',
    'NI9oaXH36YQ-',
    'LL0I8Yv1KjM-',
    'EZ-ocZV850k-',
    'Thio3V0imwc-',
    'f6hU22EA7Z8peFWZVBJU',
    '_3hEeummFKRey8l5VXxZwxz',
    '_90cZ1dqsBUk-',
];

function clog(msg) {
    console.log(LOG_TAG + msg, ...LOG_STYLES);
}

function isValidValue(val) {
    return typeof val !== 'undefined' && val !== null && val !== '';
}

function formatTime(date) {
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    }).toUpperCase();
}

CheckRegion(labelsr);

function CheckRegion(labelsr) {
    const href = window.location.href;
    const wallet = document.getElementById('header_wallet_balance');
    const isStore = href.includes('steampowered');
    const isMkt = href.includes('market');
    const isInventory = href.includes('/inventory');
    const isCommunity = href.includes('steamcommunity') && !isMkt;

    const SYMBOLS = [
        { sym: '₴', region: 'UAH' },
        { sym: '$', region: 'USD' },
        { sym: '€', region: 'EUR' },
    ];

    outer:
    for (const labelr of labelsr) {
        let region;
        if (isStore) {

            region = wallet
                ? document.querySelectorAll('.global_action_link')
                : document.querySelectorAll(`.${labelr}`);
        } else if (isMkt || isCommunity) {
            region = document.querySelectorAll(`.${labelr}`);
        }

        if (!region || region.length === 0) continue;

        for (const el of region) {
            for (const { sym, region: reg } of SYMBOLS) {
                if (el.innerHTML.includes(sym)) {
                    CurrRegion = reg;
                    RegionCheck = true;
                    break outer;
                }
            }
        }
    }

    if (CurrRegion) {
        clog(`Currency: "${CurrRegion}"`);
        CheckStorage();
    }
}

function CheckStorage() {
    const raw = localStorage.getItem('SCTTData');

    if (raw) {
        const data = JSON.parse(raw);
        const thirtyMinutes = 30 * 60 * 1000;
        lastUpdatedGlobal = formatTime(new Date(data.timestamp));

        if (Date.now() - data.timestamp < thirtyMinutes) {

            ({
                FinalKeyPrice,
                MarketPrice, MarketPriceGlobal,
                FKSteamPrice, FKSteamPriceGlobal, FKSteamAvailGlobal,
                IRSteamPrice, IRSteamPriceGlobal, IRSteamAvailGlobal,
                DRSteamPrice, DRSteamPriceGlobal, DRSteamAvailGlobal,
            } = data);
            FKSteamPriceCheck = IRSteamPriceCheck = DRSteamPriceCheck = MarketPriceCheck = true;

            runConversionForRegion();

            waitForElements('.lastupdated', elements => {
                elements[0].textContent = lastUpdatedGlobal;
                elements[0].closest('p').style.display = 'block';
            });

            for (const [key, prov] of Object.entries(PROVIDERS)) {
                const price = key === 'fk' ? FKSteamPrice : key === 'ir' ? IRSteamPrice : DRSteamPrice;
                const avail = key === 'fk' ? FKSteamAvailGlobal : key === 'ir' ? IRSteamAvailGlobal : DRSteamAvailGlobal;
                waitForElements(`.${prov.cls}`, els => els.forEach(el => { el.textContent = `${price} T (${avail} In Stock)`; }));
                waitForElements(`.${prov.popupCls}`, els => els.forEach(el => { el.textContent = `${price} T (${avail})`; }));
            }

            updateMarketPriceElements();
            waitForElements('.buytf2btn', () => { updateBuyButtonUrl(); });

            clog(`Loaded prices from local storage: ${FinalKeyPrice} Toman , ${MarketPriceGlobal}₴`);
            clog(`Last updated on: ${lastUpdatedGlobal}`);
            return;
        }
    }

    GetFKSteamPrice();
    GetIRSteamPrice();
    GetDRSteamPrice();
    GetMarketPrice();
    WaitForPrices();
}

function updateMarketPriceElements() {
    let text;
    if (CurrRegion === 'UAH') {
        text = `${String(MarketPrice).replace('.', ',')}₴ (${MarketPriceGlobal}₴)`;
    } else if (CurrRegion === 'USD') {
        text = `$${MarketPrice} ($${MarketPriceGlobal})`;
    } else if (CurrRegion === 'EUR') {
        text = `${String(MarketPrice).replace('.', ',')}€ (${String(MarketPriceGlobal).replace('.', ',')}€)`;
    }
    if (!text) return;
    waitForElements('.marketsteamprice', els => els.forEach(el => { el.textContent = text; }));
    waitForElements('.popupmarketsteamprice', els => els.forEach(el => { el.textContent = text; }));
}

function runConversionForRegion() {
    if (CurrRegion === 'UAH') { UAHtoTomanW(); UAHtoToman(labels); }
    else if (CurrRegion === 'USD') { USDtoTomanW(); USDtoToman(labels); }
    else if (CurrRegion === 'EUR') { EURtoTomanW(); EURtoToman(labels); }

    if (window.location.href.includes('market') || window.location.href.includes('/inventory')) setupTooltipObserver();
}

function makeRequest({ url, method = 'GET', data, timeout = 3500, onload, onFail, retryCount = 0, maxRetries = 3, retryDelay = 1000 }) {
    GM_xmlhttpRequest({
        method, url, data, dataType: 'json', timeout,
        onload,
        ontimeout(response) {
            if (retryCount < maxRetries) {
                setTimeout(() => makeRequest({ url, method, data, timeout, onload, onFail, retryCount: retryCount + 1, maxRetries, retryDelay }), retryDelay);
            } else { onFail(response); }
        },
        onerror(response) {
            if (retryCount < maxRetries) {
                setTimeout(() => makeRequest({ url, method, data, timeout, onload, onFail, retryCount: retryCount + 1, maxRetries, retryDelay }), retryDelay);
            } else { onFail(response); }
        },
    });
}

function setProviderElements(cls, popupCls, priceText, availText) {
    document.querySelectorAll(`.${cls}`).forEach(el => { el.textContent = `${priceText} T (${availText} In Stock)`; });
    document.querySelectorAll(`.${popupCls}`).forEach(el => { el.textContent = `${priceText} T (${availText})`; });
}

function setProviderElementsError(cls, popupCls) {
    document.querySelectorAll(`.${cls}`).forEach(el => { el.textContent = 'Error!'; });
    document.querySelectorAll(`.${popupCls}`).forEach(el => { el.textContent = 'Error!'; });
}

function GetFKSteamPrice(retryCount = 0) {
    makeRequest({ url: PROVIDERS.fk.url, retryCount, onload: LoadFKSteamPrice, onFail: LoadFKSteamPriceTimeout });
}

function LoadFKSteamPrice(response) {
    try {
        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
        const priceEl = doc.querySelector('.font-semibold.text-base:not(.toman-price)');
        const rawToman = Math.ceil(parseFloat(priceEl.textContent.trim().replace(/,/g, '')));
        const availEl = doc.querySelector('p.bg-primary-800');
        FKSteamPrice = rawToman.toLocaleString('en-US');
        FKSteamPriceGlobal = Math.ceil(rawToman / 1000);
        FKSteamAvailGlobal = parseInt(availEl.textContent.match(/\d+/)[0], 10);
        clog(`Fast Keys Price: ${FKSteamPriceGlobal} Toman`);
        clog(`Fast Keys Quantity: ${FKSteamAvailGlobal} Keys`);
        setProviderElements(PROVIDERS.fk.cls, PROVIDERS.fk.popupCls, FKSteamPrice, FKSteamAvailGlobal);
        FKSteamPriceCheck = true;
        AddLoadingBar(18);
    } catch { LoadFKSteamPriceTimeout(); }
}

function LoadFKSteamPriceTimeout() {
    FKSteamPrice = FKSteamPriceGlobal = FKSteamAvailGlobal = 0;
    clog('Fast Keys Timed out!');
    setProviderElementsError(PROVIDERS.fk.cls, PROVIDERS.fk.popupCls);
    FKSteamPriceCheck = true;
    AddLoadingBar(18);
}

function GetIRSteamPrice(retryCount = 0) {
    makeRequest({ url: PROVIDERS.ir.url, retryCount, onload: LoadIRSteamPrice, onFail: LoadIRSteamPriceTimeout });
}

function LoadIRSteamPrice(response) {
    try {
        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
        const json = JSON.parse(doc.getElementById('__NEXT_DATA__').innerHTML);
        const rawToman = Math.ceil(parseFloat(String(json.props.pageProps.tf2.prices.keyPrice).replace(/,/g, '')));
        IRSteamPrice = rawToman.toLocaleString('en-US');
        IRSteamPriceGlobal = Math.ceil(rawToman / 1000);
        IRSteamAvailGlobal = Math.ceil(json.props.pageProps.tf2.quantity);
        clog(`Iranian Steam Price: ${IRSteamPriceGlobal} Toman`);
        clog(`Iranian Steam Quantity: ${IRSteamAvailGlobal} Keys`);
        setProviderElements(PROVIDERS.ir.cls, PROVIDERS.ir.popupCls, IRSteamPrice, IRSteamAvailGlobal);
        IRSteamPriceCheck = true;
        AddLoadingBar(18);
    } catch { LoadIRSteamPriceTimeout(); }
}

function LoadIRSteamPriceTimeout() {
    IRSteamPrice = IRSteamPriceGlobal = IRSteamAvailGlobal = 0;
    clog('Iranian Steam Timed out!');
    setProviderElementsError(PROVIDERS.ir.cls, PROVIDERS.ir.popupCls);
    IRSteamPriceCheck = true;
    AddLoadingBar(18);
}

function GetDRSteamPrice(retryCount = 0) {
    makeRequest({ url: 'https://dragonsteam.net/api/tf2/prices', method: 'GET', timeout: 10000, retryCount, onload: LoadDRSteamPrice, onFail: LoadDRSteamPriceTimeout });
}

function LoadDRSteamPrice(response) {
    try {
        const json = JSON.parse(response.responseText);
        const rawToman = Math.ceil(json.keySell);
        DRSteamPriceGlobal = Math.ceil(rawToman / 1000);
        DRSteamPrice = rawToman.toLocaleString('en-US');
        clog(`Dragon Steam Price: ${DRSteamPriceGlobal} Toman`);
        makeRequest({ url: 'https://dragonsteam.net/api/tf2/inventory-summary', method: 'GET', timeout: 10000, retryCount: 0,
            onload: (res) => {
                try { DRSteamAvailGlobal = JSON.parse(res.responseText).keys; }
                catch { DRSteamAvailGlobal = 0; }
                clog(`Dragon Steam Quantity: ${DRSteamAvailGlobal} Keys`);
                setProviderElements(PROVIDERS.dr.cls, PROVIDERS.dr.popupCls, DRSteamPrice, DRSteamAvailGlobal);
                DRSteamPriceCheck = true;
                AddLoadingBar(18);
            },
            onFail: () => {
                DRSteamAvailGlobal = 0;
                setProviderElements(PROVIDERS.dr.cls, PROVIDERS.dr.popupCls, DRSteamPrice, DRSteamAvailGlobal);
                DRSteamPriceCheck = true;
                AddLoadingBar(18);
            }
        });
    } catch { LoadDRSteamPriceTimeout(); }
}

function LoadDRSteamPriceTimeout() {
    DRSteamPrice = DRSteamPriceGlobal = DRSteamAvailGlobal = 0;
    clog('Dragon Steam Timed out!');
    setProviderElementsError(PROVIDERS.dr.cls, PROVIDERS.dr.popupCls);
    DRSteamPriceCheck = true;
    AddLoadingBar(18);
}


function GetMarketPrice() {
    const url = MARKET_URLS[CurrRegion];
    if (!url) return;
    GM_xmlhttpRequest({ method: 'GET', url, dataType: 'json', onload: LoadMarketPrice });
}

function LoadMarketPrice(response) {
    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
    const data = JSON.parse(doc.querySelector('body').innerHTML);

    if (CurrRegion === 'UAH') {
        const raw = data.lowest_price.replace('₴', '').replace(',', '.');
        MarketPrice = raw;
        MarketPriceGlobal = Math.floor(parseFloat(raw) * STEAM_FEE);
        clog(`Market Price: ${MarketPriceGlobal}₴`);
        const text = `${String(MarketPrice).replace('.', ',')}₴ (${MarketPriceGlobal}₴)`;
        document.querySelectorAll('.marketsteamprice, .popupmarketsteamprice').forEach(el => { el.textContent = text; });
    } else if (CurrRegion === 'USD') {
        const raw = data.lowest_price.replace('$', '').replace(',', '.');
        MarketPrice = raw;
        MarketPriceGlobal = (parseFloat(raw) * STEAM_FEE).toFixed(2);
        clog(`Market Price: $${MarketPriceGlobal}`);
        const text = `$${MarketPrice} ($${MarketPriceGlobal})`;
        document.querySelectorAll('.marketsteamprice, .popupmarketsteamprice').forEach(el => { el.textContent = text; });
    } else if (CurrRegion === 'EUR') {
        const raw = data.lowest_price.replace('€', '').replace(',', '.').replace('.--', '.00');
        MarketPrice = raw;
        MarketPriceGlobal = (parseFloat(raw) * STEAM_FEE).toFixed(2);
        clog(`Market Price: ${MarketPriceGlobal}€`);
        const text = `${String(MarketPrice).replace('.', ',')}€ (${String(MarketPriceGlobal).replace('.', ',')}€)`;
        document.querySelectorAll('.marketsteamprice, .popupmarketsteamprice').forEach(el => { el.textContent = text; });
    }

    MarketPriceCheck = true;
    AddLoadingBar(23);
}

function GotAllPrices() {
    return DRSteamPriceCheck && MarketPriceCheck && IRSteamPriceCheck && FKSteamPriceCheck;
}

function WaitForPrices() {
    const timer = setInterval(() => {
        if (GotAllPrices()) {
            clearInterval(timer);
            GetFinalKeyPrice();
        }
    }, 500);
}

function updateBuyButtonUrl() {
    const options = [];
    if (DRSteamPriceGlobal) options.push({ price: DRSteamPriceGlobal, url: PROVIDERS.dr.url, label: 'Dragon Steam Pricing' });
    if (IRSteamPriceGlobal) options.push({ price: IRSteamPriceGlobal, url: PROVIDERS.ir.url, label: 'Iranian Steam Pricing' });
    if (FKSteamPriceGlobal) options.push({ price: FKSteamPriceGlobal, url: PROVIDERS.fk.url, label: 'Fast Keys Pricing' });

    if (!options.length) return null;
    const best = options.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
    document.querySelectorAll('.buytf2btn').forEach(el => { el.href = best.url; });
    clog(`Using ${best.label}`);
    return best;
}

function GetFinalKeyPrice() {
    const best = updateBuyButtonUrl();
    if (best) {
        FinalKeyPrice = best.price;
        AddLoadingBar(33);
    } else {
        AddLoadingBar(33);
    }

    if (isValidValue(FinalKeyPrice) && MarketPriceCheck) {
        setTimeout(() => {
            lastUpdatedGlobal = formatTime(new Date());
            SavePrices();
            waitForElements('.lastupdated', elements => {
                elements[0].textContent = lastUpdatedGlobal;
                elements[0].closest('p').style.display = 'block';
            });
        }, 1000);
        runConversionForRegion();
    } else {
        AddLoadingBar(33);
    }
}

function SavePrices() {
    const data = {
        FinalKeyPrice,
        MarketPrice, MarketPriceGlobal,
        FKSteamPrice, FKSteamPriceGlobal, FKSteamAvailGlobal,
        IRSteamPrice, IRSteamPriceGlobal, IRSteamAvailGlobal,
        DRSteamPrice, DRSteamPriceGlobal, DRSteamAvailGlobal,
        timestamp: Date.now(),
    };
    localStorage.setItem('SCTTData', JSON.stringify(data));
}

function eToNumber(num) {
    let sign = '';
    num = String(num);
    if (num.charAt(0) === '-') { num = num.substring(1); sign = '-'; }
    const arr = num.split(/[e]/i);
    if (arr.length < 2) return sign + num;
    const dot = (0.1).toLocaleString().substr(1, 1);
    let n = arr[0];
    const exp = +arr[1];
    let w = (n = n.replace(/^0+/, '')).replace(dot, '');
    const pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp;
    const L = pos - w.length;
    const s = String(BigInt(w));
    function r() { return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`); }
    w = exp >= 0
        ? (L >= 0 ? s + '0'.repeat(L) : r())
        : (pos <= 0 ? '0' + dot + '0'.repeat(Math.abs(pos)) + s : r());
    const parts = w.split(dot);
    if ((parts[0] == 0 && parts[1] == 0) || (+w == 0 && +s == 0)) w = 0;
    return sign + w;
}

function convertTextNodes(el) {
    const UAH_RE = /(\d[\d,]*(?:\s\d{3})*(?:,\d+)?₴)/g;
    for (const node of Array.from(el.childNodes)) {
        if (node.nodeType !== Node.TEXT_NODE) continue;
        if (!node.textContent.includes('₴')) continue;

        const text = node.textContent;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let anyMatch = false;

        UAH_RE.lastIndex = 0;
        let m;
        while ((m = UAH_RE.exec(text)) !== null) {
            const pm = normalizeUAH(m[0]);
            if (!pm || isNaN(pm)) continue;
            const cs = (pm / MarketPriceGlobal).toPrecision(2);
            const cf = Math.ceil(cs * FinalKeyPrice).toLocaleString('en-US');

            if (m.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
            }
            fragment.appendChild(document.createTextNode(m[0]));
            fragment.appendChild(document.createElement('br'));
            fragment.appendChild(document.createTextNode(`${cf} T (${eToNumber(cs)}🔑)`));

            lastIndex = m.index + m[0].length;
            anyMatch = true;
        }

        if (!anyMatch) continue;
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        node.parentNode.replaceChild(fragment, node);
    }
}

function stripConvertedNodes(el) {
    for (const br of Array.from(el.querySelectorAll('br[data-sctt]'))) {
        if (br.nextSibling &&
            br.nextSibling.nodeType === Node.TEXT_NODE &&
            br.nextSibling.textContent.includes('🔑')) {
            br.nextSibling.remove();
        }
        br.remove();
    }
}

function convertTextNodesLive(el) {
    const UAH_RE = /(\d[\d,]*(?:\s\d{3})*(?:,\d+)?₴)/g;
    for (const node of Array.from(el.childNodes)) {
        if (node.nodeType !== Node.TEXT_NODE) continue;
        UAH_RE.lastIndex = 0;
        const m = UAH_RE.exec(node.textContent);
        if (!m) continue;
        const pm = normalizeUAH(m[0]);
        if (!pm || isNaN(pm)) continue;
        const cs = (pm / MarketPriceGlobal).toPrecision(2);
        const cf = Math.ceil(cs * FinalKeyPrice).toLocaleString('en-US');
        const br = document.createElement('br');
        br.dataset.sctt = '1';
        br.dataset.scttPrice = String(pm);
        node.after(br, document.createTextNode(`${cf} T (${eToNumber(cs)}🔑)`));
    }
}

function setupTooltipObserver() {
    if (_tooltipPollingStarted) return;
    _tooltipPollingStarted = true;
    setInterval(() => {
        if (!GotAllPrices()) return;
        document.querySelectorAll('.iRapBRRENfU- .NI9oaXH36YQ-, .U1qtAHnPvEo-.NI9oaXH36YQ- .NI9oaXH36YQ-').forEach(el => {

            if (el.querySelector('.NI9oaXH36YQ-')) {

                delete el.dataset.scttConv;
                delete el.dataset.scttPrice;
                return;
            }

            if (el.textContent.includes('🔑')) {
                delete el.dataset.scttConv;
                delete el.dataset.scttPrice;
                return;
            }
            if (!el.textContent.includes('₴')) {

                delete el.dataset.scttConv;
                delete el.dataset.scttPrice;
                return;
            }
            const m = /\d[\d,]*(?:\s\d{3})*(?:,\d+)?₴/.exec(el.textContent);
            if (!m) return;
            const currentPm = normalizeUAH(m[0]);
            if (!currentPm || isNaN(currentPm)) return;
            const storedPm = parseFloat(el.dataset.scttPrice || '0');
            if (Math.abs(currentPm - storedPm) < 0.01 && el.dataset.scttConv) return;
            const cs = (currentPm / MarketPriceGlobal).toPrecision(2);
            const cf = Math.ceil(cs * FinalKeyPrice).toLocaleString('en-US');
            el.dataset.scttConv = `${cf} T (${eToNumber(cs)}🔑)`;
            el.dataset.scttPrice = String(currentPm);
            const origDisplay = currentPm.toLocaleString('en-US') + '₴';
            const tooltipText = buildTooltipText(currentPm, origDisplay);
            if (tooltipText) {
                el.setAttribute('ogpricetooltip', tooltipText);
                el.removeAttribute('ogpricetooltip-initialized');
                initializeTooltips();
            }
        });
    }, 100);
}

function buildTooltipText(pm, origDisplay) {
    if (!isValidValue(WalletValue)) return null;
    const wd = WalletValue.toString().replace('.', ',');
    if (pm < WalletValue) {
        return `[L]*Original Price:  *[/L][R]${origDisplay}[/R]\n*Your Wallet: *[R] ${wd}₴[/R]\n[C]*You can buy it!*[/C]`;
    }
    const needed = pm - WalletValue;
    const neededKey = (needed / MarketPriceGlobal).toPrecision(2);
    const neededFinal = Math.ceil(neededKey * FinalKeyPrice).toLocaleString('en-US');
    return `[L]*Original Price:  *[/L][R]${origDisplay}[/R]\n*Your Wallet: *[R]- ${wd}₴[/R]\n*You Need:  *[R]${neededFinal} T (${eToNumber(neededKey)}🔑) = ${needed.toFixed(2).replace('.', ',')}₴[/R]`;
}

function normalizeUAH(str) {
    return parseFloat(String(str).replace(' ', '').replace('₴', '').replace(',', '.'));
}

function normalizeUAHText(str) {
    return parseFloat(String(str).replace(/[\s,]/g, ''));
}

function isUAHPrice(text) {
    return text.includes('₴') || /\bUAH\b/i.test(text);
}

function UAHtoToman(labels) {
    if (window.location.href.includes('steampowered')) {
        const re = /(\D*)(\d[\d,]*(?:\s\d{3})*(?:,\d+)?[^\s\d,]*)/;
        for (const label of labels) {
            const prices = document.querySelectorAll(`.${label}`);
            if (!prices.length) continue;
            for (const el of prices) {
                if (!re.test(el.textContent)) continue;
                const matchItem = re.exec(el.textContent);
                if (!isUAHPrice(matchItem[0]) || !isValidValue(FinalKeyPrice)) continue;

                const p = matchItem[0].includes('₴')
                    ? normalizeUAH(matchItem[2])
                    : normalizeUAHText(matchItem[2]);

                const walletcal = WalletValue;

                const rawClean = matchItem[0].includes('₴')
                    ? matchItem[2].replace(' ', '')
                    : `UAH ${matchItem[2].replace(/\s/g, '')}`;

                if (matchItem[0].includes('Your Price:')) {
                    if (p > MarketPriceGlobal) {
                        const calpricesteam = Math.ceil(p / MarketPriceGlobal);
                        const calpricefinal = (calpricesteam * FinalKeyPrice).toLocaleString('en-US');
                        if (isValidValue(walletcal) && p < walletcal) {
                            el.innerHTML = `<div class="your_price_label">Your Price:</div><div ogpricetooltip="[L]*Original Price:  *[/L][R]${rawClean}[/R]\n*Your Wallet: *[R] ${walletcal.toString().replace('.', ',')}₴[/R]\n[C]*You can buy it!*[/C]">${calpricefinal} T (${calpricesteam}🔑)</div></div>`;
                        } else if (isValidValue(walletcal)) {
                            const needed = p - walletcal;
                            const neededkey = Math.ceil(needed / MarketPriceGlobal);
                            const neededfinal = (neededkey * FinalKeyPrice).toLocaleString('en-US');
                            el.innerHTML = `<div class="your_price_label">Your Price:</div><div ogpricetooltip="[L]*Original Price:  *[/L][R]${rawClean}[/R]\n*Your Wallet: *[R]- ${walletcal.toString().replace('.', ',')}₴[/R]\n*You Need:  *[R]${neededfinal} T (${neededkey}🔑) = ${needed.toFixed(2).replace('.', ',')}₴[/R]">${calpricefinal} T (${calpricesteam}🔑)</div></div>`;
                        } else {
                            el.innerHTML = `<div class="your_price_label">Your Price:</div><div>${calpricefinal} T (${calpricesteam}🔑)</div></div>`;
                        }
                    } else {
                        const calpricesteam = (p / MarketPriceGlobal).toPrecision(2);
                        const calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString('en-US');
                        if (isValidValue(walletcal) && p < walletcal) {
                            el.innerHTML = `<div class="your_price_label">Your Price:</div><div ogpricetooltip="[L]*Original Price:  *[/L][R]${rawClean}[/R]\n*Your Wallet: *[R] ${walletcal.toString().replace('.', ',')}₴[/R]\n[C]*You can buy it!*[/C]">${calpricefinal} T (${calpricesteam}🔑)</div></div>`;
                        } else if (isValidValue(walletcal)) {
                            const needed = p - walletcal;
                            const neededkey = Math.ceil(needed / MarketPriceGlobal);
                            const neededfinal = (neededkey * FinalKeyPrice).toLocaleString('en-US');
                            el.innerHTML = `<div class="your_price_label">Your Price:</div><div ogpricetooltip="[L]*Original Price:  *[/L][R]${rawClean}[/R]\n*Your Wallet: *[R]- ${walletcal.toString().replace('.', ',')}₴[/R]\n*You Need:  *[R]${neededfinal} T (${neededkey}🔑) = ${needed.toFixed(2).replace('.', ',')}₴[/R]">${calpricefinal} T (${calpricesteam}🔑)</div></div>`;
                        } else {
                            el.innerHTML = `<div class="your_price_label">Your Price:</div><div>${calpricefinal} T (${calpricesteam}🔑)</div></div>`;
                        }
                    }
                } else {
                    if (p > MarketPriceGlobal) {
                        const calpricesteam = Math.ceil(p / MarketPriceGlobal);
                        const calpricefinal = (calpricesteam * FinalKeyPrice).toLocaleString('en-US');
                        el.textContent = `${calpricefinal} T (${calpricesteam}🔑)`;
                        if (isValidValue(walletcal) && p < walletcal) {
                            el.setAttribute('ogpricetooltip', `[L]*Original Price:  *[/L][R]${rawClean}[/R]\n*Your Wallet: *[R] ${walletcal.toString().replace('.', ',')}₴[/R]\n[C]*You can buy it!*[/C]`);
                        } else if (isValidValue(walletcal)) {
                            const needed = p - walletcal;
                            const neededkey = Math.ceil(needed / MarketPriceGlobal);
                            const neededfinal = (neededkey * FinalKeyPrice).toLocaleString('en-US');
                            el.setAttribute('ogpricetooltip', `[L]*Original Price:  *[/L][R]${rawClean}[/R]\n*Your Wallet: *[R]- ${walletcal.toString().replace('.', ',')}₴[/R]\n*You Need:  *[R]${neededfinal} T (${neededkey}🔑) = ${needed.toFixed(2).replace('.', ',')}₴[/R]`);
                        }
                    } else {
                        const calpricesteam = (p / MarketPriceGlobal).toPrecision(2);
                        const calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString('en-US');
                        el.textContent = `${calpricefinal} T (${calpricesteam}🔑)`;
                        if (isValidValue(walletcal) && p < walletcal) {
                            el.setAttribute('ogpricetooltip', `[L]*Original Price:  *[/L][R]${rawClean}[/R]\n*Your Wallet: *[R] ${walletcal.toString().replace('.', ',')}₴[/R]\n[C]*You can buy it!*[/C]`);
                        } else if (isValidValue(walletcal)) {
                            const needed = p - walletcal;
                            const neededkey = Math.ceil(needed / MarketPriceGlobal);
                            const neededfinal = (neededkey * FinalKeyPrice).toLocaleString('en-US');
                            el.setAttribute('ogpricetooltip', `[L]*Original Price:  *[/L][R]${rawClean}[/R]\n*Your Wallet: *[R]- ${walletcal.toString().replace('.', ',')}₴[/R]\n*You Need:  *[R]${neededfinal} T (${neededkey}🔑) = ${needed.toFixed(2).replace('.', ',')}₴[/R]`);
                        }
                    }
                }
            }
        }
        if (isValidValue(WalletValue)) initializeTooltips();
    }

    if (window.location.href.includes('market')) {

        const rem = /(\D*)(\d[\d,]*(?:\s\d{3})*(?:,\d+)?[^\s\d,]*)/;
        const walletcalm = WalletValue;

        const pricem = document.querySelectorAll(
            '.NI9oaXH36YQ-, .market_commodity_orders_header_promote, .market_listing_price,' +
            '.normal_price, .Thio3V0imwc-'
        );
        for (const el of pricem) {
            if (el.innerHTML.includes('🔑')) continue;

            if (el.querySelector('.NI9oaXH36YQ-')) continue;

            if (el.classList.contains('EZ-ocZV850k-') ||
                el.classList.contains('LL0I8Yv1KjM-') ||
                el.classList.contains('Thio3V0imwc-')) {
                if (el.textContent.includes('₴')) {
                    const tm = /\d[\d,]*(?:\s\d{3})*(?:,\d+)?₴/.exec(el.textContent);
                    if (tm && !el.getAttribute('ogpricetooltip')) {
                        const tpm = el.classList.contains('LL0I8Yv1KjM-') || el.classList.contains('EZ-ocZV850k-')
                            ? normalizeUAH(tm[0])
                            : normalizeUAH(tm[0]);
                        const todd = buildTooltipText(tpm, tpm.toLocaleString('en-US') + '₴');
                        if (todd) el.setAttribute('ogpricetooltip', todd);
                    }
                    convertTextNodes(el);
                }
                continue;
            }

            if (!rem.test(el.textContent)) continue;
            const matchItem = rem.exec(el.textContent);
            if (!isUAHPrice(matchItem[0])) continue;

            const pm = matchItem[0].includes('₴')
                ? normalizeUAH(matchItem[2])
                : normalizeUAHText(matchItem[2]);
            if (!pm || isNaN(pm)) continue;



            if (el.closest('.iRapBRRENfU-') && el.textContent.includes('₴')) {

                if (el.querySelector('.iRapBRRENfU-')) continue;

                if (el.textContent.includes('🔑')) { delete el.dataset.scttConv; delete el.dataset.scttPrice; continue; }
                const cs = (pm / MarketPriceGlobal).toPrecision(2);
                const cf = Math.ceil(cs * FinalKeyPrice).toLocaleString('en-US');
                el.dataset.scttConv = `${cf} T (${eToNumber(cs)}🔑)`;
                el.dataset.scttPrice = String(pm);
                continue;
            }

            const origDisplay = pm.toLocaleString('en-US') + '₴';
            const elemColor = el.style.color;
            const convColor = elemColor || 'silver';
            const calpricesteamm = (pm / MarketPriceGlobal).toPrecision(2);
            const calpricefinalm = Math.ceil(calpricesteamm * FinalKeyPrice).toLocaleString('en-US');


            const hasFrom = /\bfrom\b/i.test(matchItem[1] || '');
            const origHTML = `<span style="color:${elemColor || 'white'}">${hasFrom ? 'From ' : ''}${origDisplay}</span>`;
            const convText = `${calpricefinalm} T (${eToNumber(calpricesteamm)}🔑)`;
            const convSpan = `<span style="color:${convColor}">${convText}</span>`;


            const needsCenter = !!el.closest('.SXmRNU-nKEQ-');
            const wS = needsCenter ? '<div style="text-align:center">' : '';
            const wE = needsCenter ? '</div>' : '';

            if (isValidValue(walletcalm) && pm < walletcalm) {
                el.innerHTML = `${wS}${origHTML}<div ogpricetooltip="[L]*Original Price:  *[/L][R]${origDisplay}[/R]\n*Your Wallet: *[R] ${walletcalm.toString().replace('.', ',')}₴[/R]\n[C]*You can buy it!*[/C]">${convSpan}</div>${wE}`;
            } else if (isValidValue(walletcalm)) {
                const neededm = pm - walletcalm;
                const neededmkey = (neededm / MarketPriceGlobal).toPrecision(2);
                const neededmfinal = Math.ceil(neededmkey * FinalKeyPrice).toLocaleString('en-US');
                el.innerHTML = `${wS}${origHTML}<div ogpricetooltip="[L]*Original Price:  *[/L][R]${origDisplay}[/R]\n*Your Wallet: *[R]- ${walletcalm.toString().replace('.', ',')}₴[/R]\n*You Need:  *[R]${neededmfinal} T (${eToNumber(neededmkey)}🔑) = ${neededm.toFixed(2).replace('.', ',')}₴[/R]">${convSpan}</div>${wE}`;
            } else {
                el.innerHTML = `${wS}${origHTML} ${convSpan}${wE}`;
            }
        }
        if (isValidValue(WalletValue)) initializeTooltips();


        const pricemsw = document.querySelectorAll('.user_info_text');
        for (const el of pricemsw) {
            if (el.innerHTML.includes('🔑')) continue;
            if (!rem.test(el.textContent)) continue;
            const matchItem = rem.exec(el.textContent);
            if (matchItem[0].indexOf('₴') < 0) continue;
            const pmsw = normalizeUAH(matchItem[2]);
            const calpricesteammsw = (pmsw / MarketPriceGlobal).toPrecision(3);
            const calpricefinalmsw = Math.ceil(calpricesteammsw * FinalKeyPrice).toLocaleString('en-US');
            el.innerHTML = `<a id="marketWalletBalance" href="https://store.steampowered.com/account/">Wallet balance <span id="marketWalletBalanceAmount">${matchItem[2]} (${eToNumber(calpricesteammsw)}🔑)</span></a><br><a href="https://steamcommunity.com/my/inventory/">View Inventory</a></span>`;
        }
    }

        if (window.location.href.includes('/inventory')) {
        const invPrices = document.querySelectorAll('.f6hU22EA7Z8peFWZVBJU');
        for (const el of invPrices) {
            if (el.innerHTML.includes('🔑')) continue;
            if (!el.textContent.includes('₴')) continue;
            const m = /\d[\d,]*(?:\s\d{3})*(?:,\d+)?₴/.exec(el.textContent);
            if (!m) continue;
            const pm = normalizeUAH(m[0]);
            if (!pm || isNaN(pm)) continue;
            convertTextNodes(el);
        }
    }

    if (window.location.href.includes('steamcommunity') && !window.location.href.includes('market')) {
        const commPrices = document.querySelectorAll('._3hEeummFKRey8l5VXxZwxz');
        for (const el of commPrices) {
            if (el.innerHTML.includes('🔑')) continue;
            const priceSpan = el.querySelector('span');
            if (!priceSpan || !priceSpan.textContent.includes('₴')) continue;
            convertTextNodes(priceSpan);
        }
    }
}

function UAHtoTomanW() {
    const rew = /(\D*)(\d *\S*)/;
    const pricew = document.querySelectorAll('.global_action_link, ._79DIT7RUQ5g-, .account_name, .lHc2D8LzCAM-, .HOrB6lehQpg-');
    for (const el of pricew) {
        if (el.textContent.includes('🔑')) continue;
        if (SCTT_OWN_PRICE_CLASSES.some(c => el.classList.contains(c))) continue;
        if (!rew.test(el.textContent)) continue;
        const matchItemw = rew.exec(el.textContent);
        if (matchItemw[0].indexOf('₴') < 0) continue;

        if (matchItemw[0].includes('Pending')) {
            const pw = normalizeUAH(matchItemw[2].replace('Pending:', ''));
            const pending = el.textContent.substring(el.textContent.indexOf('Pending:')).replace('Pending:', ' Pending:');
            const pendingn = normalizeUAH(pending.replace(' Pending:', ''));
            const calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
            const calpricesteamwp = (pendingn / MarketPriceGlobal).toPrecision(3);
            Wallet = el.textContent.replace(/Pending: .*/, '');
            WalletValue = pw;
            const pendingEl = document.querySelector('.tooltip');
            const pendingTooltip = pendingEl ? pendingEl.getAttribute('data-tooltip-html') : '';
            el.innerHTML = `${el.textContent.replace(/Pending: .*/, '')} (${calpricesteamw}🔑)<br><span class="tooltip" ogpricetooltip="${(pendingTooltip || '').replace('. ', '.<br>')}">${pending} (${calpricesteamwp}🔑)</span>`;
        } else {
            const pw = normalizeUAH(matchItemw[2]);
            const calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
            Wallet = el.textContent;
            WalletValue = pw;

            if (el.classList.contains('_79DIT7RUQ5g-')) {

                el.style.whiteSpace = 'nowrap';
                el.textContent = `${el.textContent} (${calpricesteamw}🔑)`;
            } else if (el.classList.contains('lHc2D8LzCAM-')) {

            } else {
                el.style.whiteSpace = 'nowrap';
                el.textContent = `${el.textContent} (${calpricesteamw}🔑)`;
            }
        }

        if (isValidValue(WalletValue)) initializeTooltips();
    }
}

function USDtoToman(labels) {
    try {
        if (!window.location.href.includes('steampowered')) return;
        const re = /(\D*)(\d\S*)/;
        for (const label of labels) {
            const prices = document.querySelectorAll(`.${label}`);
            if (!prices.length) continue;
            for (const el of prices) {
                if (!re.test(el.textContent)) continue;
                const matchItem = re.exec(el.textContent);
                if (matchItem[0].indexOf('$') < 0) continue;

                if (matchItem[0].includes('Your Price:')) {
                    const p = parseFloat(matchItem[0].replace(',', '.').replace('$', '').replace('Your Price:', ''));
                    const calpricesteam = p > parseFloat(MarketPriceGlobal) ? Math.ceil(p / MarketPriceGlobal) : (p / MarketPriceGlobal).toPrecision(2);
                    const calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString('en-US');
                    el.innerHTML = `<div class="your_price_label">Your Price:</div><div title="${matchItem[2]}">${calpricefinal} T (${calpricesteam}🔑)</div></div>`;
                } else {
                    const p = parseFloat(matchItem[0].replace(',', '.').replace('$', ''));
                    const calpricesteam = p > parseFloat(MarketPriceGlobal) ? Math.ceil(p / MarketPriceGlobal) : (p / MarketPriceGlobal).toPrecision(2);
                    const calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString('en-US');
                    el.textContent = `${calpricefinal} T (${calpricesteam}🔑)`;
                    el.setAttribute('title', `$${matchItem[2]}`);
                }
            }
        }
    } catch { }
}

function USDtoTomanW() {
    const rew = /(\D*)(\d\S*$)/;
    const pricew = document.querySelectorAll('.global_action_link');
    for (const el of pricew) {
        if (SCTT_OWN_PRICE_CLASSES.some(c => el.classList.contains(c))) continue;
        if (!rew.test(el.textContent)) continue;
        const matchItemw = rew.exec(el.textContent);
        if (matchItemw[0].indexOf('$') < 0) continue;

        if (matchItemw[0].includes('Pending')) {
            const pw = parseFloat(matchItemw[2].replace('Pending:', '').replace(',', '.').replace('$', ''));
            const pending = el.textContent.substring(el.textContent.indexOf('Pending:')).replace('Pending:', ' Pending:');
            const pendingn = parseFloat(pending.replace(' Pending:', '').replace(',', '.').replace('$', ''));
            const calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
            const calpricesteamwp = (pendingn / MarketPriceGlobal).toPrecision(3);
            el.textContent = `${el.textContent.replace(/Pending: .*/, '')} (${calpricesteamw}🔑)${pending} (${calpricesteamwp}🔑)`;
        } else {
            const pw = parseFloat(matchItemw[2].replace(',', '.').replace('$', ''));
            const calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
            el.textContent = `${el.textContent} (${calpricesteamw}🔑)`;
        }
    }
}


function normalizeEUR(str) {
    return parseFloat(String(str).replace(',--€', '').replace(',', '.').replace('€', ''));
}

function EURtoToman(labels) {
    try {
        if (!window.location.href.includes('steampowered')) return;
        const re = /(\D*)(\d\S*)/;
        for (const label of labels) {
            const prices = document.querySelectorAll(`.${label}`);
            if (!prices.length) continue;
            for (const el of prices) {
                if (!re.test(el.textContent)) continue;
                const matchItem = re.exec(el.textContent);
                if (matchItem[0].indexOf('€') < 0) continue;

                if (matchItem[0].includes('Your Price:')) {
                    const p = normalizeEUR(matchItem[2].replace('Your Price:', ''));
                    const calpricesteam = p > MarketPriceGlobal ? Math.ceil(p / MarketPriceGlobal) : (p / MarketPriceGlobal).toPrecision(2);
                    const calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString('en-US');
                    el.innerHTML = `<div class="your_price_label">Your Price:</div><div title="${matchItem[2]}">${calpricefinal} T (${calpricesteam}🔑)</div></div>`;
                } else {
                    const p = normalizeEUR(matchItem[2]);
                    const calpricesteam = p > MarketPriceGlobal ? Math.ceil(p / MarketPriceGlobal) : (p / MarketPriceGlobal).toPrecision(2);
                    const calpricefinal = Math.ceil(calpricesteam * FinalKeyPrice).toLocaleString('en-US');
                    el.textContent = `${calpricefinal} T (${calpricesteam}🔑)`;
                    el.setAttribute('title', matchItem[2] + '€');
                }
            }
        }
    } catch { }
}

function EURtoTomanW() {
    const rew = /(\D*)(\d\S*€)/;
    const pricew = document.querySelectorAll('.global_action_link');
    for (const el of pricew) {
        if (SCTT_OWN_PRICE_CLASSES.some(c => el.classList.contains(c))) continue;
        if (!rew.test(el.textContent)) continue;
        const matchItemw = rew.exec(el.textContent);
        if (matchItemw[0].indexOf('€') < 0) continue;

        if (matchItemw[0].includes('Pending')) {
            const pw = normalizeEUR(matchItemw[2].replace('Pending:', ''));
            const pending = el.textContent.substring(el.textContent.indexOf('Pending:')).replace('Pending:', ' Pending:');
            const pendingn = normalizeEUR(pending.replace(' Pending:', ''));
            const calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
            const calpricesteamwp = (pendingn / MarketPriceGlobal).toPrecision(3);
            el.textContent = `${el.textContent.replace(/Pending: .*/, '')} (${calpricesteamw}🔑)${pending} (${calpricesteamwp}🔑)`;
        } else {
            const pw = normalizeEUR(matchItemw[2]);
            const calpricesteamw = (pw / MarketPriceGlobal).toPrecision(3);
            el.textContent = `${el.textContent} (${calpricesteamw}🔑)`;
        }
    }
}

function parseTooltipText(text) {
    return text
        .replace(/\*(.*?)\*/g, '<span style="font-weight:bold;">$1</span>')
        .replace(/\[L\]/g, '<span style="text-align:left;">')
        .replace(/\[\/L\]/g, '</span>')
        .replace(/\[R\]/g, '<span style="float:right;">')
        .replace(/\[\/R\]/g, '</span>')
        .replace(/\[C\]/g, '<span style="display:block; text-align:center;">')
        .replace(/\[\/C\]/g, '</span>')
        .replace(/🔑/g, '<span style="color: transparent; text-shadow: 1px 1px 1px #3d3d3f;">🔑</span>')
        .replace(/\[P\]/g, '<span style="position: relative; bottom: 2px;">')
        .replace(/\[\/P\]/g, '</span>');
}

function addTooltip(element, tooltipText) {
    const tooltip = document.createElement('span');
    tooltip.setAttribute('class', 'ogprice-tooltip');
    tooltip.innerHTML = parseTooltipText(tooltipText);
    Object.assign(tooltip.style, {
        position:        'absolute',
        backgroundColor: '#c2c2c2',
        color:           '#3d3d3f',
        fontFamily:      'Motiva Sans',
        fontSize:        '11px',
        textAlign:       'left',
        padding:         '5px',
        borderRadius:    '2px',
        boxShadow:       '0 0 3px #000',
        zIndex:          '9999',
        opacity:         '0',
        transition:      'opacity 0.2s ease',
        whiteSpace:      'pre-line',
        pointerEvents:   'none',
    });
    document.body.appendChild(tooltip);

    element.addEventListener('mouseover', e => {
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.opacity = '1';
        element.style.cursor = 'help';
        setTimeout(() => { tooltip.style.opacity = '0'; }, 7000);
    });
    element.addEventListener('mouseout', () => {
        tooltip.style.opacity = '0';
        element.style.cursor = 'default';
    });
}

function initializeTooltips() {
    document.querySelectorAll('[ogpricetooltip]:not([ogpricetooltip-initialized])').forEach(el => {
        addTooltip(el, el.getAttribute('ogpricetooltip'));
        el.setAttribute('ogpricetooltip-initialized', 'true');
    });
}

(function initLoadingBar() {
    LoadingBar = document.createElement('div');
    LoadingBar.id = 'loading-bar';
    Object.assign(LoadingBar.style, {
        position: 'fixed', top: '0', left: '0', width: '0%', height: '3px',
        backgroundColor: '#00adee', zIndex: '9999',
        transition: 'opacity 0.5s ease, width 0.5s ease',
    });
    document.body.appendChild(LoadingBar);

    waitloadingbar().then(() => {
        LoadingBar.style.width = '100%';
        setTimeout(() => {
            LoadingBar.style.opacity = '0';
            setTimeout(() => { LoadingBar.remove(); }, 500);
        }, 500);
    });
})();

function AddLoadingBar(amount) {
    if (!LoadingBar) return;
    const current = parseFloat(LoadingBar.style.width) || 0;
    LoadingBar.style.width = `${Math.min(current + amount, 100)}%`;
}

function waitloadingbar() {
    return new Promise(resolve => {
        (function check() {
            if ((parseFloat(LoadingBar.style.width) || 0) >= 99) resolve();
            else setTimeout(check, 100);
        })();
    });
}

function waitForElements(selector, callback) {
    const found = document.querySelectorAll(selector);
    if (found.length > 0) { callback(found); return; }
    const obs = new MutationObserver((_, observer) => {
        const els = document.querySelectorAll(selector);
        if (els.length > 0) { observer.disconnect(); callback(els); }
    });
    obs.observe(document.body, { childList: true, subtree: true });
}

(function injectUI() {
    const sheet = document.createElement('style');
    sheet.textContent = `
        .ico16sc           { display: inline-block; width: 16px; height: 16px; background: none; vertical-align: text-top; }
        .widget            { font-family: "Motiva Sans", Arial, Helvetica, sans-serif; }
        .key               { width: 52px; height: 52px; float: right; opacity: 0.5; transition: opacity 0.1s ease-in-out; }
        .widget:hover .key { opacity: 1; }
        .leftcolumn { width: 110px; margin-right: 5px; display: inline-block; padding-left: 20px; background-repeat: no-repeat; background-position: 0 50%; background-size: 16px 16px; }
        .rightcolumn       { color: #67c1f5; position: absolute; }
        .U1qtAHnPvEo-:not(.eHC015acU04-)     { display: block; text-align: center; }
        .WlnQdqsCe5s- > .NI9oaXH36YQ-:not(.KX9eQJSfx5A-):not(.U1qtAHnPvEo-):not(.LB7oRJG7djU-):not(.ifBXpA-M7mM-)  { display: block; text-align: right; }
        .iRapBRRENfU- .NI9oaXH36YQ-[data-sctt-conv]::after {
            content: attr(data-sctt-conv);
            display: block;
            text-align: center;
            color: inherit;
            font-size: 0.9em;
        }
    `;

    document.head.appendChild(sheet);

    function getCachedPopupText(cls) {
        if (cls === 'popupfksteamprice' && FKSteamPriceCheck) {
            return isValidValue(FKSteamPrice) ? `${FKSteamPrice} T (${FKSteamAvailGlobal})` : 'Error!';
        }
        if (cls === 'popupirsteamprice' && IRSteamPriceCheck) {
            return isValidValue(IRSteamPrice) ? `${IRSteamPrice} T (${IRSteamAvailGlobal})` : 'Error!';
        }
        if (cls === 'popupdragonsteamprice' && DRSteamPriceCheck) {
            return isValidValue(DRSteamPrice) ? `${DRSteamPrice} T (${DRSteamAvailGlobal})` : 'Error!';
        }
        if (cls === 'popupmarketsteamprice' && MarketPriceCheck && isValidValue(MarketPriceGlobal)) {
            if (CurrRegion === 'UAH') return `${String(MarketPrice).replace('.', ',')}₴ (${MarketPriceGlobal}₴)`;
            if (CurrRegion === 'USD') return `$${MarketPrice} ($${MarketPriceGlobal})`;
            if (CurrRegion === 'EUR') return `${String(MarketPrice).replace('.', ',')}€ (${String(MarketPriceGlobal).replace('.', ',')}€)`;
        }
        return null;
    }

    function injectPopupItems(popup, isNewStyle = false) {
        if (!popup || popup.dataset.scttInjected) return;
        popup.dataset.scttInjected = 'true';

        const popupEntries = [
            { cls: 'popupfksteamprice', href: PROVIDERS.fk.url, title: 'Buy keys from Fast Keys', label: ' Fast Keys: ', favicon: PROVIDERS.fk.favicon },
            { cls: 'popupirsteamprice', href: PROVIDERS.ir.url, title: 'Buy keys from Iranian Steam', label: ' Iranian Steam: ', favicon: PROVIDERS.ir.favicon },
            { cls: 'popupdragonsteamprice', href: PROVIDERS.dr.url, title: 'Buy keys from Dragon Steam', label: ' Dragon Steam: ', favicon: PROVIDERS.dr.favicon },
            { cls: 'popupmarketsteamprice', href: MARKET_KEY_URL, title: 'View keys on Community Market', label: ' Steam Market: ', favicon: MARKET_FAVICON },
        ];
        for (const entry of popupEntries) {
            const item = document.createElement('a');
            item.rel = 'noopener';
            item.target = '_blank';

            item.className = isNewStyle ? 'TwsehSqoph8- PopPop' : 'popup_menu_item PopPop';
            item.href = entry.href;
            item.title = entry.title;
            item.textContent = entry.label;
            item.setAttribute('tabindex', '0');

            const priceEl = document.createElement(isNewStyle ? 'span' : 'a');
            const cached = getCachedPopupText(entry.cls);
            priceEl.textContent = cached || 'Loading...';
            priceEl.className = isNewStyle
                ? `HOrB6lehQpg- account_name ${entry.cls}`
                : `account_name ${entry.cls}`;
            item.appendChild(priceEl);

            const icon = document.createElement('img');
            icon.className = 'ico16sc';
            icon.src = entry.favicon;
            item.prepend(icon);

            popup.appendChild(item);
        }
    }

    injectPopupItems(document.querySelector('#account_dropdown .popup_body'), false);
    waitForElements('.Hxi-pnf9Xlw- .F0YMvqVKHkY-', els => injectPopupItems(els[0], true));

    new MutationObserver(() => {
        const dropdown = document.querySelector('.Hxi-pnf9Xlw- .F0YMvqVKHkY-:not([data-sctt-injected])');
        if (dropdown) injectPopupItems(dropdown, true);
    }).observe(document.body, { childList: true, subtree: true });

    const container = document.querySelector('.game_meta_data');
    if (!container) return;

    const blockInner = document.createElement('div');
    blockInner.className = 'block_content_inner';

    const block = document.createElement('div');
    block.className = 'block responsive_apppage_details_right widget';
    block.appendChild(blockInner);

    const keyLink = document.createElement('a');
    keyLink.className = 'key';
    keyLink.title = 'View on Community Market';
    keyLink.target = '_blank';
    keyLink.href = MARKET_KEY_URL;
    const keyImg = document.createElement('img');
    keyImg.src = 'https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEAaR4uURrwvz0N252yVaDVWrRTno9m4ccG2GNqxlQoZrC2aG9hcVGUWflbX_drrVu5UGki5sAij6tOtQ/54fx54f';
    keyLink.appendChild(keyImg);
    blockInner.appendChild(keyLink);

    const widgetRows = [
        { cls: PROVIDERS.fk.cls, href: PROVIDERS.fk.url, title: 'Buy keys from Fast Keys', label: 'Fast Keys: ', favicon: PROVIDERS.fk.favicon },
        { cls: PROVIDERS.ir.cls, href: PROVIDERS.ir.url, title: 'Buy keys from Iranian Steam', label: 'Iranian Steam: ', favicon: PROVIDERS.ir.favicon },
        { cls: PROVIDERS.dr.cls, href: PROVIDERS.dr.url, title: 'Buy keys from Dragon Steam', label: 'Dragon Steam: ', favicon: PROVIDERS.dr.favicon },
        { cls: 'marketsteamprice', href: MARKET_KEY_URL, title: 'View on Community Market', label: 'Steam Market: ', favicon: MARKET_FAVICON },
    ];

    for (const row of widgetRows) {
        const priceLink = document.createElement('a');
        priceLink.className = `rightcolumn ${row.cls}`;
        priceLink.title = row.title;
        priceLink.target = '_blank';
        priceLink.href = row.href;
        priceLink.textContent = 'Loading...';

        const line = document.createElement('p');
        const lineText = document.createElement('span');
        lineText.className = 'leftcolumn';
        lineText.style.backgroundImage = `url("${row.favicon}")`;
        lineText.textContent = row.label;

        line.appendChild(lineText);
        line.appendChild(priceLink);
        blockInner.appendChild(line);
    }

    const lastupdated = document.createElement('a');
    lastupdated.className = 'rightcolumn lastupdated';
    lastupdated.title = 'Last time prices were updated. Click to refresh.';
    lastupdated.textContent = 'Never';
    lastupdated.style.cursor = 'pointer';
    lastupdated.addEventListener('click', () => {
        localStorage.removeItem('SCTTData');
        location.reload();
    });

    const updateLine = document.createElement('p');
    const updateLineText = document.createElement('span');
    updateLineText.className = 'leftcolumn';
    updateLineText.style.backgroundImage = `url("${LAST_UPDATE_ICON}")`;
    updateLineText.textContent = 'Last Update On: ';
    updateLine.appendChild(updateLineText);
    updateLine.appendChild(lastupdated);
    updateLine.style.display = 'none';
    blockInner.appendChild(updateLine);

    container.insertBefore(block, container.firstChild);

    const btnContainer = document.getElementById('ignoreBtn');
    if (btnContainer) {
        const buyLink = document.createElement('a');
        buyLink.className = 'btnv6_blue_hoverfade btn_medium buytf2btn';
        buyLink.target = '_blank';
        buyLink.href = PROVIDERS.dr.url;
        buyLink.style.marginLeft = '5px';
        const buySpan = document.createElement('span');
        buySpan.dataset.tooltipText = 'Buy TF2 Keys';
        buySpan.innerHTML = '<span>Buy 🔑</span>';
        buyLink.appendChild(buySpan);
        btnContainer.append(buyLink, btnContainer.firstChild);
    }
})();

function convertcurrency() {
    if (!isValidValue(FinalKeyPrice)) return;
    if (CurrRegion === 'UAH') UAHtoToman(labels);
    else if (CurrRegion === 'USD') USDtoToman(labels);
    else if (CurrRegion === 'EUR') EURtoToman(labels);
}

function isSctteOwnNode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    if (node.classList && SCTT_OWN_PRICE_CLASSES.some(c => node.classList.contains(c))) return true;
    if (node.querySelector && SCTT_OWN_PRICE_CLASSES.some(c => node.querySelector(`.${c}`))) return true;
    return false;
}

function processnode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (isSctteOwnNode(node)) return;
    if (node.classList) {
        for (const cls of labels) {
            if (node.classList.contains(cls)) { convertcurrency(); return; }
        }
    }
    for (const child of node.childNodes) { processnode(child); }
}

const WALLET_CLASSES = new Set(['_79DIT7RUQ5g-', 'lHc2D8LzCAM-', 'global_action_link', 'account_name', 'user_info_text', 'HOrB6lehQpg-']);

function isWalletNode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    if (SCTT_OWN_PRICE_CLASSES.some(c => node.classList && node.classList.contains(c))) return false;
    if (node.classList) {
        for (const cls of WALLET_CLASSES) {
            if (node.classList.contains(cls)) return true;
        }
    }
    for (const cls of WALLET_CLASSES) {
        if (node.querySelector && node.querySelector(`.${cls}`)) return true;
    }
    return false;
}

function handlemutations(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type !== 'childList') continue;
        for (const node of mutation.addedNodes) {
            if (!GotAllPrices()) continue;
            if (isWalletNode(node)) {

                clearTimeout(handlemutations._walletTimer);
                handlemutations._walletTimer = setTimeout(() => {
                    if (CurrRegion === 'UAH') UAHtoTomanW();
                    else if (CurrRegion === 'USD') USDtoTomanW();
                    else if (CurrRegion === 'EUR') EURtoTomanW();
                }, 150);
            } else {


                processnode(node);
            }
        }
    }
}

const domObserver = new MutationObserver(handlemutations);
domObserver.observe(document.body, { childList: true, subtree: true });

if (GotAllPrices()) processnode(document.body);

if (window.location.href.includes('wishlist')) {
    window.addEventListener('scroll', convertcurrency);

    const wishlistObserver = new MutationObserver(() => {
        const inner = document.querySelector('body.VuAIAiWhjcg- .khI3dKnN9c8-.o5zcnn2HXfA-');
        if (!inner) return;
        const addScrollListener = () => { inner.addEventListener('scroll', convertcurrency); };
        if (document.readyState === 'complete') {
            addScrollListener();
        } else {
            window.addEventListener('load', addScrollListener, { once: true });
        }
        wishlistObserver.disconnect();
    });
    wishlistObserver.observe(document.body, { childList: true, subtree: true });
}

if (window.location.href.includes('/inventory')) {
    window.addEventListener('scroll', convertcurrency);

    setInterval(() => {
        if (!GotAllPrices()) return;
        document.querySelectorAll('.f6hU22EA7Z8peFWZVBJU').forEach(el => {
            if (el.innerHTML.includes('🔑')) return;
            if (!el.textContent.includes('₴')) return;
            convertTextNodes(el);
        });
    }, 300);

    if (!RegionCheck) {
        let _invRetries = 0;
        const _retryCheckRegion = () => {
            if (RegionCheck || _invRetries++ > 20) return;
            CheckRegion(labelsr);
            if (!RegionCheck) setTimeout(_retryCheckRegion, 500);
        };
        setTimeout(_retryCheckRegion, 300);
    }
}

window.addEventListener('load', convertcurrency);
