import firebase from "firebase";

var config = {
    apiKey: "AIzaSyBDbUuTlk5BSixKQYK-v6XFhqneFiusjMY",
    databaseURL: "https://lucya-stock-category.firebaseio.com/",
    projectId: "lucya-stock-category"
};
firebase.initializeApp(config);

export const db = firebase.database();
var tableUrl = "/lucya_db_stock_keywords/mGd6o71hK3qa0AkDszi0";

// const app = {
//     firebase: {
//         stocks: db.ref("lucya_db_stock_keywords") // db 데이터베이스에 'todos' 테이블을 참조하기 위한 코드임.
//     }
// };

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