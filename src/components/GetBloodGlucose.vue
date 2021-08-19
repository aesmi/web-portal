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
        <v-select
          v-model="setDate"
          :items="dateList()"
          item-value="recordDate"
          label="Date"
        ></v-select>
      </v-row>
    </v-col>
    <ve-line :data="GlucoseForRange" :extend="chartExtend"></ve-line>

    <v-spacer></v-spacer>

    <v-data-table
      :items="GlucoseForTable"
      :headers="headers"
      :loading="loading"
      item-key="id"
      class="elevation-1"
      disable-sort
      mobile-breakpoint="-1"
    ></v-data-table>
    <v-spacer></v-spacer>

    <div id="chart" class="pt-12">
      <v-row justify="center">
        <v-col>
          {{ setDate }}
        </v-col>
      </v-row>
      <ve-line
        :data="GlucoseForDay"
        :settings="chartSettings"
        :extend="chartExtend"
        :loading="loading"
      ></ve-line>
    </div>
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn fab elevation="1" @click="scrollToTop">
          <v-icon>mdi-menu-up</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// import axios from "axios";
import moment from "moment";

export default {
  data() {
    this.chartSettings = {
      area: true
    };
    this.chartExtend = { color: "#66B2FF" };
    return {
      isChart: false,
      apiResult: [],
      formattedResult: [],
      recordDate: [],
      setDate: null,
      loading: true,
      slots: null,
      //   Date: this.GetDate(),
      search: null,
      on: false,
      headers: [
        { text: "Meal Period ", value: "timePeriod", align: "start" },
        { text: "Glucose Level", value: "glucoseLevel" }
      ],
      GlucoseForRange: {
        columns: ["formattedDate", "glucoseLevel"],
        rows: []
      }
    };
  },
  watch: {
    setDate() {
      this.scrollToElement();
    }
  },

  computed: {
    isLoading() {
      return true;
    },
    GlucoseForDay() {
      let rows = this.formattedResult.filter(record =>
        moment(record.recordDate).isSame(moment(this.setDate))
      );

      rows = rows || [];

      return {
        columns: ["timePeriod", "glucoseLevel"],
        rows: rows
      };
    },
    GlucoseForTable() {
      let rows = this.formattedResult.filter(record =>
        moment(record.recordDate).isSame(moment(this.setDate))
      );
      rows = rows || [];
      return rows;
    }
  },

  mounted() {
    this.RecordRangeList();
  },

  methods: {
    // Date in the response.data.result(r) is same to RecordDate in the r.record
    //so using the Date in r to display the Datelist

    dateList() {
      return this.formattedResult.map(result =>
        moment(result.recordDate).format("YYYY-MM-DD")
      );
    },
    //scroll down to specific elemetnt
    scrollToElement() {
      var e = document.getElementById("chart");
      e.scrollIntoView(true);
    },
    //scroll top
    scrollToTop() {
      window.scrollTo(0, 0);
    },

    RecordRangeList() {
      return this.$api.component
        .apiGetBloodGlucoseRecordRangeList({
          isDescend: true
        })
        .then(response => {
          this.loading = false;

          this.apiResult = response.data.result;
          //sort date in ascending order

          this.apiResult.forEach(value => {
            //sort mealPeriodType in ascending order
            value["record"].sort((a, b) => a.mealPeriodType - b.mealPeriodType);

            value["record"].forEach(value2 => {
              //change the numeric value(mealPeriodType) to string value(Breakfast,Lunch,Dinner...)
              //into new object TimePeriod
              value2.timePeriod = this.getTime(value2.mealPeriodType);
              value2.formattedDate = moment(value2.recordDate).format(
                "YYYY-MM-DD"
              );

              this.formattedResult.push(value2);
              this.GlucoseForRange.rows.push(value2);
            });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    isEnabled(slot) {
      return this.enabled === slot;
    },
    getTime(type) {
      switch (type) {
        case 0:
          return "Before Breakfast";
        case 1:
          return "After Breakfast";
        case 2:
          return "Before Lunch";
        case 3:
          return "After Lunch";
        case 4:
          return "Before Dinner";
        case 5:
          return "After Dinner";
        default:
          return null;
      }
    }
  }
};
</script>
