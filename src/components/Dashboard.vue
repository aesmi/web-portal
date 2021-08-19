<template>
  <v-container id="dashboard" fluid tag="section">
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
    <v-row align="center" justify="center">
      <v-col align-self="center" cols="4">
        <base-material-stats-card
          icon="mdi-heart-pulse"
          to="/heartrate"
          max-width="300"
          class="pa-8"
          elevation="24"
          type="danger"
          title="Daily Heart Rate"
          v-model="HRToday"
          sub-icon="mdi-clock"
          sub-text="Just Updated"
        >
        </base-material-stats-card
      ></v-col>
      <v-col align-self="center" cols="4">
        <base-material-stats-card
          icon="mdi-hand-heart"
          to="/bloodpressure"
          max-width="300"
          class="pa-8"
          elevation="24"
          title="Daily Blood Pressure"
          :value="`${sysBPToday}/${disBPToday}`"
          sub-icon="mdi-clock"
          sub-text="Just Updated"
        >
        </base-material-stats-card
      ></v-col>
      <v-col align-self="center" cols="4">
        <base-material-stats-card
          icon="mdi-water"
          to="/bloodglucose"
          max-width="300"
          class="pa-8"
          elevation="24"
          title="Daily Blood Glucose"
          v-model="BGAvg"
          sub-icon="mdi-clock"
          sub-text="Just Updated"
        >
        </base-material-stats-card
      ></v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col align-self="center" cols="4">
        <base-material-stats-card
          icon="mdi-sleep"
          to="/sleep"
          max-width="300"
          class="pa-8"
          elevation="24"
          title="Last Night's Sleep"
          v-model="sleepTotal"
          sub-icon="mdi-clock"
          sub-text="Just Updated"
        >
          <!-- v-model="sleepTotal" -->
        </base-material-stats-card>
      </v-col>
      <v-col align-self="center" cols="4">
        <base-material-stats-card
          icon="mdi-run"
          to="/steps"
          max-width="300"
          class="pa-8"
          elevation="24"
          v-model="stepsTotal"
          title="Daily Steps"
          sub-icon="mdi-clock"
          sub-text="Just Updated"
        >
          <!--  v-model="stepsTotal" -->
        </base-material-stats-card></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
// import axios from "axios";
//import _ from "lodash";
export default {
  name: "Dashboard",

  data() {
    return {
      loading: true,
      stepChart: {
        stepData: {
          labels: [],
          series: []
        },
        options: {}
      },
      sleepChart: {
        //date: utcstring,
        //record: {data: [{duration: int, type: int, beginTime: utcstring}], lightSleepTotalTime:int, deepSleepTotalTime: int, lightSleepCount: int, deepSleepCount: int, sleepTime: utcstring, wakeupTime: utcstring, id: int}
        sleepData: {
          labels: [],
          series: []
        },
        options: {}
      },
      BGChart: {
        //date: utcstring,
        //record: {mealPeriodType: int, bloodGlucose: float, recordDate: utcstring, id: int }
        BGData: {
          labels: [],
          series: []
        }
      },
      BPChart: {
        //date: utcstring,
        //record: {sysBloodPresure: int, disBloodPressure: int, hearRate: int, recordTime: utcstring, id: int }
        BPData: {
          labels: [],
          series: []
        },
        options: {}
      },
      HRChart: {
        //date: utcstring,
        //record: {heartRate: int, recordTime: utcstring, id: int}
        HRData: {
          id: [],
          labels: [],
          series: []
        },
        options: {}
      }
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    today() {
      let today = new Date();
      return today.getDate();
    },
    HRToday() {
      if (this.HRChart.HRData.series.length == 0) {
        return "0";
      }
      if (this.HRChart.HRData.series[0]["heartRate"] == null) {
        return 0;
      } else return this.HRChart.HRData.series[0]["heartRate"];
    },
    sysBPToday() {
      if (this.BPChart.BPData.series.length == 0) {
        return "0";
      }

      return this.BPChart.BPData.series[0].record[0].sysBloodPressure;
    },
    disBPToday() {
      if (this.BPChart.BPData.series.length == 0) {
        return "0";
      }
      return this.BPChart.BPData.series[0].record[0].disBloodPressure;
    },
    BGAvg() {
      if (this.BGChart.BGData.series.length == 0) {
        return "0";
      }
      console.log(this.BGChart.BGData.series[0].record);
      const BP = this.BGChart.BGData.series[0].record
        .map(el => el["glucoseLevel"])
        .flat();
      const sum = BP.reduce((acc, cur) => acc + cur, 0);
      return Math.round((sum / BP.length) * 100) / 100 + "";
    },
    stepsTotal() {
      if (this.HRChart.HRData.series.length == 0) {
        return "0";
      }

      const steps = this.stepChart.stepData.series[0].record
        .map(el => el["step"])
        .flat();

      console.log(steps);
      const sum = steps.reduce((acc, cur) => acc + cur, 0);
      return sum + "";
    },
    sleepTotal() {
      if (this.sleepChart.sleepData.series.length == 0) {
        return "0";
      }
      const lightSleepTotalTime = this.sleepChart.sleepData.series[0].record
        .map(el => el["lightSleepTotalTime"])
        .flat();
      const deepSleepTotalTime = this.sleepChart.sleepData.series[0].record
        .map(el => el["deepSleepTotalTime"])
        .flat();
      const totalSleepTime = lightSleepTotalTime.concat(deepSleepTotalTime);
      const length = deepSleepTotalTime.length + lightSleepTotalTime.length;
      const sum = totalSleepTime.reduce((acc, cur) => acc + cur, 0);
      if (!sum || !length) return 0;
      return Math.round(sum / length) + "";
    }
  },
  methods: {
    fetchData() {
      this.fetchHR();
      this.fetchBG();
      this.fetchBP();
      this.fetchSteps();
      this.fetchSleep();
    },
    complete(index) {
      this.list[index] = !this.list[index];
    },
    fetchHR() {
      this.$api.component
        .apiGetHeartRate({ isDescend: true })
        .then(res => {
          this.loading = false;
          res.data["result"].forEach(value => {
            value["record"].forEach(value2 => {
              if (
                this.HRChart.HRData.series.findIndex(
                  row => row.recordTime == value2["recordTime"]
                ) < 0
              ) {
                //push res data into our component data
                // value2["heartRate"] = String.valueOf(value2["heartRate"]);
                var data = {
                  recordTime: value2["recordTime"],
                  heartRate: value2["heartRate"] + ""
                };

                this.HRChart.HRData.series.push(data);
                this.HRChart.HRData.id.push(value2.id);
              }
            });
          });
          this.$set(this, "HRChart", this.HRChart);
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchBG() {
      return this.$api.component
        .apiGetBloodGlucoseRecordRangeList({
          isDescend: true
        })
        .then(res => {
          this.loading = false;
          //result: [{date:string, record: }]
          this.BGChart.BGData.series = res.data.result;
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchBP() {
      this.$api.component
        .apiGetBloodPressureRecordRangeList({
          isDescend: true
        })
        .then(res => {
          this.loading = false;
          this.BPChart.BPData.series = res.data.result;
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchSteps() {
      this.$api.component
        .apiGetStep({ isDescend: true })
        .then(res => {
          this.loading = false;
          this.stepChart.stepData.series = res.data.result;
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchSleep() {
      this.$api.component
        .apiGetSleep({ isDescend: true })
        .then(res => {
          this.loading = false;
          this.sleepChart.sleepData.series = res.data.result;
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>
