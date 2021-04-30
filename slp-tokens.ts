import Big from "big.js";
let slplist = require("slp-list");
slplist.Config.SetUrl("https://slpdb-testnet.fountainhead.cash");
const bchaddr = require("bchaddrjs-slp");

//Token ID
const tokenID = "9dfb1c9090fe9a802bf2dea4940d7cfa6b1124485ffa865c2edc157437927181";

//Cutoff Block
const blockCutoff = 1445452;

//Enter Dividend Amount here
const bchAmount = 0.5;

(async () => {
    //Fetch address list of all token holders
    const addressList = await slplist.List.GetAddressListFor(tokenID, blockCutoff)as Map<string, typeof Big>;

    //Address of Winners - enter only bchaddress
    const addressWinners = [
    'bchtest:qrfs9hlq5rpy0d56j90w9u2em5z7rcmqvgx04ju3f0',
    'bchtest:qzrw6p7vm69f6q92uhastp5ukn6jnlcl8ghvhrx50c',
    'bchtest:qq5cwz245ghgd3nsg5pz42ae0lq7p8x3rqwl5078un'
    ];

    console.log("Winners List:",addressWinners);

    //Deleting other token holders from address list 
    addressList.forEach((v,k)=>{
        const s = bchaddr.toCashAddress(k);
        if (!addressWinners.includes(s)){
            console.log("Deleting Address from List:",k);
            addressList.delete(k);
        }
    })


    //Calculating total SLP tokens of winners
    const slpTotal = Array.from(addressList.values()).reduce((a, c) => a.plus(c), new Big(0));
    //console.log("Total tokens",slpTotal);


    //Dividing amount among winners according to their token balance
    console.log(`Dividing ${bchAmount} BCH among winners according to their token balance`);
    //console.log(addressList);

    addressList.forEach((v, k) => {
        const d = v.div(slpTotal).mul(bchAmount);
        if (d.gt(0.00000000)) {
            console.log(`${bchaddr.toCashAddress(k)}, ${d.toFixed(8)}`);
        }
    });

})();
