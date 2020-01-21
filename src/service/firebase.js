import Firebase from "firebase";

var config = {
    apiKey: "AIzaSyD6J7J5S5jUeudRJFbdOR7euCEXT7_bKD0",
    databaseURL: "https://lucya-stock.firebaseio.com/",
    projectId: "lucya-stock"
};

Firebase.initializeApp(config);
console.log(Firebase.app().name);

// 데이터베이스 초기화
export const db = firebase.database();
var tableUrl = "/stock-keywords";

export const fb = {
    Firebase: {
        stocks: db.ref(tableUrl) // refFH 
    }
};

function writeStockRow(stockMarket, stockCode, stock, keywords) {
    db.ref(tableUrl).set({
        stockMarket: stockMarket,
        stockCode: stockCode,
        stock: stock,
        keywords: keywords
    });
}

// function getList() {
//     return db
//         .ref(tableUrl)
//         .once("value")
//         .then(function(snapshot) {
//             var value = snapshot.val();

//             var stockMarket = value.stockMarket;
//         });
// }