// ==UserScript==
// @name               Steam Currency Convert ARS To Toman
// @version            1.0
// @description        Converts ARS$ to Toman
// @author             M-Zoghi
// @namespace          SteamCurrencyConvertARSToToman
// @match              https://store.steampowered.com/*
// @license            THoF
// ==/UserScript==

var keymarket = 340;
var keytoman = 79;
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
                    var calpricesteam = (p / keymarket);
                    let calpricesteamroundup = Math.ceil(calpricesteam);
                    var calpricefinal = (calpricesteamroundup * keytoman);
                    const calpricefinalcomma = calpricefinal.toLocaleString("en-US");
                    price[ind].textContent = calpricefinalcomma + " T" + " (" + calpricesteamroundup + "🔑)";
                }
            }
        }
    }
}
setTimeout(function(){ARStoToman(labels)}, 1000);
