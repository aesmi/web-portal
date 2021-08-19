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
        <v-menu
          top
          left
          :offset-x="true"
          :close-on-content-click="false"
          v-model="on"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="white"
              elevation="0"
              slot="activator"
              @click="on = !on"
            >
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </template>
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
        <v-select
          v-model="setDate"
          :items="Datelist()"
          item-value="recordDate"
          label="Date"
        ></v-select>

        <!-- <v-data-table
      :items="GlucoseChart.rows"
      :loading="isLoading"
      :search="search"
    >
    </v-data-table>-->
      </v-row>
    </v-col>
    <ve-line :data="BloodPressure"></ve-line>
    <v-data-table
      :items="pressureForTable"
      :headers="headers"
      item-key="formattedTime"
      class="elevation-1"
      disable-sort
      mobile-breakpoint="-1"
    ></v-data-table>
  </v-container>
</template>

<script>
import moment from "moment";
// import { apiGetBloodPressureRecordRangeList } from "@/apis/component.js";
export default {
  data() {
    return {
      recordTime: [],
      apiResult: [],
      //"Time" with the format"LTS"(moment)
      Time: [],
      setDate: null,
      on: false,
      loading: true,
      headers: [
        { text: "Date", value: "formattedTime", align: "start" },
        { text: "Systolic Blood Pressure", value: "sysBloodPressure" },
        { text: "Diastolic Blood Pressute", value: "disBloodPressure" },
        { text: "Heart rate", value: "heartrate" }
      ]
    };
  },
  computed: {
    BloodPressure() {
      let rows = this.apiResult.filter(r =>
        moment(r.recordTime, "YYYY-MM-DD").isSame(
          moment(this.setDate, "YYYY-MM-DD")
        )
      );

      // rows.recordTime = moment(this.rows.recordTime).format("LTS");
      rows = rows || { rows: [] };
      rows.sort((a, b) => b.recordTime - a.recordTime);

      return {
        columns: [
          "formattedTime",
          "sysBloodPressure",
          "disBloodPressure",
          "heartrate"
        ],
        //compare the number of id to sort the time of a record
        rows: rows.reverse()
      };
    },
    pressureForTable() {
      let rows = this.apiResult.filter(r =>
        moment(r.recordTime, "YYYY-MM-DD").isSame(moment(this.setDate))
      );
      rows = rows || { rows: [] };

      return rows.reverse();
    }
  },
  mounted() {
    this.GetBloodPressure();
  },
  methods: {
    Datelist() {
      return this.recordTime.map(r => moment(r).format("YYYY-MM-DD"));
    },
    GetBloodPressure() {
      this.$api.component
        .apiGetBloodPressureRecordRangeList({
          isDescend: true
        })

        .then(response => {
          this.loading = false;

          response.data["result"].forEach(value => {
            value["record"].forEach(value2 => {
              value2.formattedTime = moment(value2.recordTime).format("LTS");
              // this.sysBloodPressure.push(value2.sysBloodPressure),
              //   this.disBloodPressure.push(value2.disBloodPressure),
              //   this.heartRate.push(value2.heartRate);
              this.apiResult.push(value2);
              this.recordTime.push(value2.recordTime);
            });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    dateFormat() {
      "formatDate",
        value => {
          if (value) {
            return moment(String(value)).format("YYYY-MM-DD");
          }
        };
    }
  }
};
</script>
