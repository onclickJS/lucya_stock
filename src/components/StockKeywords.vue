<template>
  <div>
    <b-form inline label-cols-lg="2">
      <b-form-select
        class="mb-2 mr-sm-2 mb-sm-0"
        :value="null"
        :options="{ 코스닥: '코스닥', 코스피: '코스피' }"
        id="inline-form-custom-select-pref"
      >
        <template v-slot:first>
          <option :value="null">주식시장</option>
        </template>
      </b-form-select>

      <label class="sr-only" for="inline-form-input-name">종목명</label>
      <b-input
        id="inline-form-input-name"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="삼성전자"
      ></b-input>

      <label class="sr-only" for="inline-form-input-username">키워드</label>
      <b-input-group prepend="@" class="mb-2 mr-sm-2 mb-sm-0">
        <b-input
          id="inline-form-input-username"
          placeholder="반도체,AI"
        ></b-input>
      </b-input-group>

      <b-button variant="primary" v-on:click="search">검색</b-button>
    </b-form>
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
      :items="items"
      :fields="fields"
      :head-variant="headVariant"
      :table-variant="tableVariant"
    ></b-table>
  </div>
</template>

<script>
import { db } from "../service/firebase";

export default {
  methods: {
    getRows() {
      this.items = db.ref("lucya_db_stock_keywords").toJSON();
    },
    search: function() {
      console.debug("검색");
    }
  },
  created() {
    this.getRows();
  },

  data() {
    return {
      fields: ["시장", "코드", "종목명", "키워드"],
      items: [],
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
