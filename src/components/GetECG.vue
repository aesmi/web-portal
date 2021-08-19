<template>
  <v-container>
    <template v-if="loading">
      <!-- here use a loaded you prefer -->
      <loading
        loader="spinner"
        :active.sync="loading"
        :can-cancel="true"
        :is-full-page="false"
        color="green"
      ></loading>
    </template>
    <v-col>
      <v-row>
        <!-- select the date -->
        <v-menu
          top
          left
          :offset-x="true"
          :close-on-content-click="false"
          v-model="on"
        >
          <v-slot activator="{on}">
            <v-btn
              color="white"
              elevation="0"
              slot="activator"
              @click="on = !on"
            >
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </v-slot>
          <template v-if="on">
            <v-date-picker
              v-model="setDate"
              half-width
              elevation="20"
              :show-current="false"
              color="grey"
            />
          </template>
        </v-menu>
        <v-select v-model="setDate" :items="Datelist()" label="Date"></v-select>
      </v-row>
    </v-col>

    <!--using v-chart and echarts -->

    <ve-line
      :data="ECG"
      :data-zoom="dataZoom"
      :loading="loading"
      :extend="chartExtend"
    ></ve-line>
    <!-- <ve-line :data="Ecgdata"></ve-line> -->
  </v-container>
</template>
<script>
// const gradients = [
//   ["#222"],
//   ["#42b3f4"],
//   ["red", "orange", "yellow"],
//   ["purple", "violet"],
//   ["#00c6ff", "#F0F", "#FF0"],
//   ["#f72047", "#ffd200", "#1feaea"]
// ];
//steps: select day
// call api record by id at that day
//chart will be changed
// import axios from "axios";
import moment from "moment";
export default {
  name: "ECG",

  data() {
    this.dataZoom = [
      {
        type: "slider",
        start: 0,
        end: 50
      },
      (this.chartExtend = { color: "#66B2FF" })
    ];
    return {
      id: [],
      ecGs: [],
      recordTime: [],
      lastestDate: null,
      on: false,
      // new Date().toISOString().substr(0, 10)

      setDate: null,
      apiResultRange: [],
      apiResultRecord: [],
      loading: true,
      dates: null
    };
  },
  mounted() {
    this.GetECGRecordRangeList();
  },
  computed: {
    ECG() {
      const rows = this.apiResultRecord;
      return { columns: ["order", "value"], rows: rows };
    }
  },
  watch: {
    setDate(val) {
      let getRecord = this.apiResultRange.find(r =>
        moment(r.recordTime, "YYYY-MM-DD").isSame(moment(val, "YYYY-MM-DD"))
      );
      this.GetECGList(getRecord.id);
    }
  },
  methods: {
    Datelist() {
      return this.recordTime.map(r => moment(r).format("YYYY-MM-DD"));
    },
    MaxRecord() {
      return Math.max.apply(Math, this.apiResultRecord.value);
    },
    GetECGList(id) {
      this.$api.component
        .apiGetECGList({
          RecordId: id

          // "Abp.Localization.CultureName=zh-hk; ARRAffinity=02f23e3c8ea4c9aa2626f02bff71e7efe6451eb5fc391474f5688373076c5600"
        })
        .then(response => {
          this.loading = false;
          this.apiResultRecord = [];

          response.data["result"].forEach(result => {
            this.apiResultRecord.push(result);
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    GetECGRecordRangeList() {
      this.$api.component
        .apiGetECGrRecordRangeList({
          isDescend: true
        })
        .then(response => {
          this.loading = false;
          response.data["result"].forEach(value => {
            value["record"].forEach(value2 => {
              //push id prop of each record into our various arrays

              this.recordTime.push(value2.recordTime);
              this.apiResultRange.push(value2);
            });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
