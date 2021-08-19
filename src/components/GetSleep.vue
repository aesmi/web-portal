<template>
  <!--<v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm9 md5>
        <v-card class="elevation-12 .rounded-xl">
          <v-img
            contain="true"
            src="https://i1.wp.com/nintendosoup.com/wp-content/uploads/2018/03/detective-pikachu-real-life-noe-2.jpg?resize=1038%2C576&ssl=1"
          >
          </v-img> </v-card></v-flex></v-layout
  ></v-container>-->
  <v-sheet>
    <v-select
      v-model="setDate"
      :items="dateList()"
      item-value="recordDate"
      label="Date"
    ></v-select>
    <!-- <v-data-table
      :items="currentData.rows"
      hide-default-footer=""
    ></v-data-table> -->
    <!-- <template v-if="loading"> -->
    <!-- here use a loaded you prefer -->
    <!-- <loading
        loader="spinner"
        :active.sync="loading"
        :can-cancel="true"
        :is-full-page="false"
        color="green"
      ></loading>
    </template> -->
    <!-- v-else(v-card) -->
    <v-card class="mx-auto elevation-12" color="grey lighten-4" max-width="700">
      <ve-bar :data="currentData" :settings="chartSettings"></ve-bar>
    </v-card>
  </v-sheet>
</template>

<script>
import moment from "moment";
export default {
  name: "GetSleep",
  data() {
    return {
      chartSettings: {
        labelMap: {
          lightSleepTotalTime: "Light Sleep Time",
          deepSleepTotalTime: "Deep Sleep Time"
        }
      },
      loading: true,
      search: null,
      id: [],
      data: [],
      setDate: false,
      slots: []
    };
  },
  computed: {
    lightSleepAvg() {
      const lightSleepTotalTime = this.data
        .map(record => record["record"].map(el => el["lightSleepTotalTime"]))
        .flat();
      const length = lightSleepTotalTime.length;
      const sum = lightSleepTotalTime.reduce((acc, cur) => acc + cur, 0);
      if (!sum || !length) return 0;
      return Math.floor(sum / length);
    },
    deepSleepAvg() {
      const deepSleepTime = this.data
        .map(record => record["record"].map(el => el["deepSleepTotalTime"]))
        .flat();
      const length = deepSleepTime.length;
      const sum = deepSleepTime.reduce((acc, cur) => acc + cur, 0);
      if (!sum || !length) return 0;
      return Math.floor(sum / length);
    },
    totalSleepAvg() {
      const lightSleepTotalTime = this.data
        .map(record => record["record"].map(el => el["lightSleepTotalTime"]))
        .flat();
      const deepSleepTotalTime = this.data
        .map(record => record["record"].map(el => el["deepSleepTotalTime"]))
        .flat();
      const totalSleepTime = lightSleepTotalTime.concat(deepSleepTotalTime);
      const length = deepSleepTotalTime.length + lightSleepTotalTime.length;
      const sum = totalSleepTime.reduce((acc, cur) => acc + cur, 0);
      if (!sum || !length) return 0;
      return Math.floor(sum / length);
    },
    totalLightSleepCount() {
      const lightSleepCount = this.data
        .map(record => record["record"].map(el => el["lightSleepCount"]))
        .flat();
      return lightSleepCount.reduce((acc, cur) => acc + cur, 0) || 0;
    },
    totalDeepSleepCount() {
      const deepSleepCount = this.data
        .map(record => record["record"].map(el => el["deepSleepCount"]))
        .flat();
      return deepSleepCount.reduce((acc, cur) => acc + cur, 0) || 0;
    },
    isLoading() {
      return true;
    },
    currentData() {
      //find method finds the first instance in an array where the condition returns true
      let rows = this.data.find(record =>
        //isSame is a moment method that works as an == logical operator except with date objects
        moment(record.date).isSame(moment(this.setDate))
      ) || { record: [] };
      return {
        columns: ["date", "lightSleepTotalTime", "deepSleepTotalTime"],
        rows: rows.record
          .map(val => val)
          .flat()
          .sort((a, b) => moment(a.sleepTime) - moment(b.sleepTime))
          .map(sleep => ({
            ...sleep,
            date: this.convertTime(sleep.sleepTime),
            type: this.sleepSwitch(sleep.data.type)
          }))
      };
    }
  },
  //fetch data on component mount
  created() {
    this.getData();
  },
  methods: {
    //return an array of dates
    dateList() {
      return this.data.map(result => moment(result.date).format("YYYY-MM-DD"));
    },

    getData() {
      this.loading = true;
      this.$api.component
        .apiGetSleep({
          isDescend: true
        })
        .then(res => {
          this.loading = false;
          this.data = res.data.result;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    sleepSwitch(arg) {
      switch (arg) {
        case 1:
          return "Light Sleep";
        case 2:
          return "Deep Sleep";
      }
    },
    convertTime(arg) {
      return moment(arg).format("DD-MM-YY HH:MM:SS");
    }
    // sortType(arg){
    //   if(arg.type===1){
    //     return {...arg, "date": this.convertTime(arg.beginTime), "type": this.sleepSwitch(arg.type)}
    //   }
    //   if(arg.type===2)
    //     return {...arg, "date": this.convertTime(arg.beginTime), "type": this.sleepSwitch(arg.type)}
    // }
  }
};
</script>
