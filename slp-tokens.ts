import Big from "big.js";
let slplist = require("slp-list");
slplist.Config.SetUrl("https://slpdb-testnet.fountainhead.cash");
const bchaddr = require("bchaddrjs-slp");

//Token ID
const tokenID = "434f4002f7c657f75bcff120f1a88dda9efc1bc4c5703e08b9931c941536bf6f";

//Cutoff Block
const blockCutoff = 1444435;

//Enter Divident Amount here
const bchAmount = 2;

(async () => {
    //Fetch address list of all token holders
    const addressList = await slplist.List.GetAddressListFor(tokenID, blockCutoff)as Map<string, Big>;

    //Address of Winners
    const addressWinners = [
    'bchtest:qpveurnsq5ylmj4js073nmr8zvz66jks05qprtdwkd',
    'bchtest:qrhs9z8pqlqkqhu8kt5k5s7exlrnpymc9gcq076md8',
    'bchtest:qr5dp63fvfu8zyyaz7xuvzlyf3jfftq08vz6knauxh',
    'bchtest:qz5r3zy30ze67n4cs9wplr5punch85kufq2a5dlvzz'
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

    
    console.log(`Dividing ${bchAmount} BCH among winners`);
    //Dividing amount among winners according to their token balance
    addressList.forEach((v, k) => {
        const d = v.div(slpTotal).mul(bchAmount);
        if (d.gt(0.00000000)) {
            console.log(`${bchaddr.toCashAddress(k)}, ${d.toFixed(8)}`);
        }
    });

})();
