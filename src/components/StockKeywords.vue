<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <div>
        <b-form inline>
          <b-form-select
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="sch.stockMarket"
            :options="{ 코스닥: '코스닥', 코스피: '코스피' }"
            @change="search($event)"
            id="inline-form-stockmarket"
          >
            <template v-slot:first>
              <option value="">주식시장</option>
            </template>
          </b-form-select>
          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-for="inline-form-stock"
            label="종목명"
          >
            <b-input
              id="inline-form-stock"
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="삼성전자"
              v-on:keyup.enter="search($event)"
            ></b-input>
          </b-form-group>
          <b-form-group
            label-cols="4"
            label-cols-lg="2"
            label-for="inline-form-keywords"
            label="키워드"
          >
            <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
              <b-input
                id="inline-form-keywords"
                placeholder="반도체,AI"
                v-on:keyup.enter="search($event)"
              ></b-input>
            </b-input-group>
          </b-form-group>
          <b-button-toolbar>
            <b-button-group class="mx-1">
              <b-button v-on:click.prevent="search($event)">검색</b-button>
            </b-button-group>
          </b-button-toolbar>
        </b-form>
      </div>
      <div inline>
        <b-button-toolbar>
          <b-button-group class="mx-1">
            <b-dropdown right text="다운로드">
              <b-dropdown-item v-on:click.prevent="excelDown()"
                >엑셀다운</b-dropdown-item
              >
              <b-dropdown-item v-on:click.prevent="jsonDown()"
                >JSON 다운</b-dropdown-item
              >
            </b-dropdown>
            <b-dropdown right text="업로드">
              <b-dropdown-item v-on:click.prevent="excelUpload()"
                >엑셀업로드</b-dropdown-item
              >
            </b-dropdown>
          </b-button-group>

          <b-button-group class="mx-1">
            <b-button inline v-on:click.prevent="addRow">추가</b-button>
          </b-button-group>
        </b-button-toolbar>
      </div>
    </div>
    <div class="panel-body">
      <b-table
        :striped="striped"
        :bordered="bordered"
        :borderless="borderless"
        :outlined="outlined"
        :small="small"
        :hover="hover"
        :dark="dark"
        :fixed="fixed"
        :foot-clone="footClone"
        :no-border-collapse="noCollapse"
        :items="stocks"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :head-variant="headVariant"
        :table-variant="tableVariant"
      >
        <template v-slot:cell(link)="row">
          <!-- `row.value` is the value after formatted by the Formatter -->
          <a :href="row.value" target="_new" v-if="!row.editMode">{{
            row.value
          }}</a>
          <input v-model="row.value" v-if="row.editMode" />
        </template>
        <template v-slot:cell(actions)="row">
          <b-button
            size="sm"
            v-on:click="row.editMode != row.editMode"
            class="mr-1"
          >
            <!-- v-on:click.prevent="editRow(row.item, row.index, $event.target)" -->
            수정
          </b-button>
        </template>
      </b-table>
      <b-row>
        <b-col md="6" class="my-1">
          <b-pagination
            :total-rows="totalRows"
            :per-page="perPage"
            v-model="currentPage"
            class="my-0"
          />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";

import Firebase from "firebase";

var config = {
  apiKey: "AIzaSyD6J7J5S5jUeudRJFbdOR7euCEXT7_bKD0",
  authDomain: "lucya-stock.firebaseapp.com", // Auth with popup/redirect
  databaseURL: "https://lucya-stock.firebaseio.com",
  storageBucket: "lucya-stock.appspot.com", // Storage
  projectId: "lucya-stock"
};

let app = Firebase.initializeApp(config);
let db = app.database();
let stocksRef = db.ref("/stock-keywords");

export default {
  name: "StockKeywords",

  data() {
    return {
      editMode: false,
      sch: {
        stockMarket: "",
        stock: "",
        keywords: ""
      },
      stocks: [],
      newRow: {
        isNew: true,
        stockMarget: "",
        stockCode: "",
        stock: "",
        keywords: "",
        companyInfo: "",
        link: ""
      },
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: "stockCode",
      sortDesc: false,
      fields: [
        { key: "stockMarket", label: "시장", sortable: true },
        { key: "stockCode", label: "코드", sortable: true },
        { key: "stock", label: "종목명", sortable: true },
        { key: "keywords", label: "키워드", sortable: false },
        { key: "companyInfo", label: "기업정보요약", sortable: false },
        { key: "link", label: "Investing Link", sortable: false },
        { key: "actions", label: "수정", sortable: false }
      ],
      tableVariants: [
        "primary",
        "secondary",
        "info",
        "danger",
        "warning",
        "success",
        "light",
        "dark"
      ],
      striped: false,
      bordered: false,
      borderless: false,
      outlined: false,
      small: false,
      hover: false,
      dark: false,
      fixed: false,
      footClone: false,
      headVariant: null,
      tableVariant: "",
      noCollapse: false
    };
  },
  created() {
    this.getRows();
  },

  mounted() {
    // Set the initial number of items
    this.totalRows = this.stocks.length;
  },
  methods: {
    excelUpload: function() {},
    excelDown: function() {
      var self = this;
      const ws = XLSX.utils.json_to_sheet(this.stocks);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "StockKeyword"); // sheet name

      // export Excel file
      XLSX.writeFile(wb, "stock_keywords.xlsx");
    },
    addRow: function() {
      this.stocks.push(this.newRow);
    },
    editRow: function(item, index, target) {
      console.debug(item, index, target);
    },
    createRow: function(row) {
      stocksRef.set(row);
    },
    updateRow: function() {
      // stocksRef.child(stock['.key']).remove()
    },
    removeRow: function() {
      // stocksRef.child(stock['.key']).remove()
    },
    getRows() {
      var self = this;

      // stocksRef.child(0).once("value", function(data) {
      //   console.log("0", data.val());
      // });

      stocksRef.on("value", function(snapshot) {
        var data = snapshot.val(); //Data is in JSON format.
        console.log(data);
        // self.stocks = data;
        // var list = [];
        snapshot.forEach(function(childSnapshot) {
          // var childKey = childSnapshot.key;
          // var childData = childSnapshot.val();
          // // self.stocks = childData;
          // console.debug(childData)

          var obj = {};
          obj = childSnapshot.val();
          obj.key = childSnapshot.key;
          self.stocks.push(obj);
        });
      });
    },
    search: function(event) {
      alert(JSON.stringify(this.sch));
      console.log("검색", this.sch);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
