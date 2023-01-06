// ==UserScript==
// @name               Steam Currency Convert ARS To Toman
// @version            1.3
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

function LoadIRSteam (irsteamobject) {
    var irsteamparser = new DOMParser ();
    var irsteamresponseDoc = irsteamparser.parseFromString (irsteamobject.responseText, "text/html");
    var irsteamfounddata = JSON.parse(irsteamresponseDoc.getElementById('__NEXT_DATA__').innerHTML);
    irsteamkeypriceglobal = Math.ceil(irsteamfounddata["props"]["pageProps"]["tf2"]["prices"]["keyPrice"].replace(',','.'));
    console.log("Key Price: " + irsteamkeypriceglobal + " Toman");
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

function LoadMarketSteam (marketsteamobject) {
    var marketsteamparser = new DOMParser ();
    var marketsteamresponseDoc = marketsteamparser.parseFromString (marketsteamobject.responseText, "text/html");
    var marketsteamfounddata = JSON.parse(marketsteamresponseDoc.querySelector("body").innerHTML);
    marketsteamkeypriceglobal = Math.floor(marketsteamfounddata["lowest_price"].replace('ARS$ ','').replace(',','.') * 0.87);
    console.log("Market Price: ARS$ " + marketsteamkeypriceglobal);
				
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

function ARStoToman(labels){
    var re = /(\D*)(\d\S*)/;
    for(label in labels){
        let price = document.querySelectorAll(`.${labels[label]}`);
        if(price.length == 0) continue;
        for(ind in price){
            if(re.test(price[ind].textContent)){
                let matchItem = re.exec(price[ind].textContent);
                if(matchItem[1].indexOf('ARS') >= 0){
                    let p = matchItem[2].replace('.','').replace(',','.');
                    var calpricesteam = Math.ceil(p / marketsteamkeypriceglobal);
                    var calpricefinal = (calpricesteam * irsteamkeypriceglobal).toLocaleString("en-US");
                    price[ind].textContent = calpricefinal + " T (" + calpricesteam + "🔑)";
                }
            }
        }
    }
}

(function() {
    const findq = document.getElementById('ignoreBtn');
    if (findq) {
        var buykeybtn = document.createElement('a');
        buykeybtn.target= '_blank';
        buykeybtn.href = 'https://iraniansteam.ir/tf2/';
        buykeybtn.className = 'btnv6_blue_hoverfade btn_medium';
        buykeybtn.innerHTML = '<span>' + "Buy 🔑" + '</span>';
        findq.append(buykeybtn);
    }
})();

$(window).on("scroll", function() {
if(irsteamkeypricecheck===true){
   ARStoToman(labels);
}

})
