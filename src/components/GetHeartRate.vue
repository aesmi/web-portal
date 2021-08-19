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
    <v-card v-else class="mx-auto" color="grey lighten-4" max-width="700">
      <v-row align="start">
        <v-col cols="12" sm="1">
          <v-menu
            top
            left
            :offset-x="true"
            :close-on-content-click="false"
            v-model="setDate"
          >
            <v-btn elevation="0" slot="activator" @click="setDate = !setDate">
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
            <template v-if="setDate">
              <v-date-picker dark v-model="dates" range></v-date-picker>
            </template>
          </v-menu>
        </v-col>

        <v-col cols="12" sm="11">
          <v-text-field
            v-model="dateRangeText"
            label="Date range"
            prepend-icon="mdi-event"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>

      <v-card-title dark>
        <v-icon
          :color="checking ? 'red lighten-2' : 'red darken-2'"
          class="mr-12"
          size="64"
        >
          mdi-heart-pulse
        </v-icon>
        <v-row>
          <v-col cols="12" sm="6"
            ><div class="caption grey--text text-uppercase">
              Average HeartRate
            </div></v-col
          >
          <v-col cols="12" sm="6">
            <div>
              <span
                class="display-2 font-weight-black"
                v-text="avg || '—'"
              ></span>
              <strong v-if="avg">BPM</strong>
            </div>
          </v-col>
        </v-row>

        <v-spacer></v-spacer>
      </v-card-title>

      <ve-line :data="currentData"></ve-line>
    </v-card>
  </v-container>
</template>

<script>
//Todo
// 1. grab data
// 2. push into data
// 3. select date
// 4. extract recordTimes from chartData.row
// 5. parseToMs for new arr
// 6. filter new arr
// 7. convert new arr back to human-readable format
// 8. update chartData
import moment from "moment";
// import loading from "vue-loading-overlay";
export default {
  name: "GetHeartRate",
  data: () => ({
    chartSettings: {
      labelMap: {
        heartRate: "HR"
      }
    },
    dates: [null, null],
    loading: true,
    checking: false,
    id: [],

    setDate: false,
    chartData: {
      columns: ["recordTime", "heartRate"],
      rows: [] //push 2d object into an array here
    },
    recordTime: []
  }),
  created() {
    this.grabData();
  },
  computed: {
    // events() {
    //   return this.grabData().rows.find(record => moment(record.date));
    // },
    dateRangeText() {
      return this.dates.join(" to ");
    },
    changeData() {
      if (this.chartData === null || undefined) {
        return;
      }

      return this.parseToDDMMYY(
        this.filterData(
          [+moment(this.dates[0]), +moment(this.dates[1])],
          this.parseToMs(this.chartData.rows, "recordTime"),
          "recordTime"
        ),
        "recordTime"
      );
    },
    currentData() {
      return { columns: this.chartData.columns, rows: this.changeData };
    },
    avg() {
      const sum = this.currentData.rows
        .map(r => r.heartRate)
        .reduce((acc, cur) => acc + cur, 0);
      const length = this.currentData.rows.length;
      if (!sum && !length) return 0;
      return Math.ceil(sum / length);
    }
  },
  methods: {
    //add method to find information by address using v-bind for dates selector component
    //use indexOf method for date and use said index to extract heartrate
    async grabData() {
      await this.$api.component
        .apiGetHeartRate({
          isDescend: true
        })
        .then(res => {
          this.loading = false;

          //access result key
          res.data["result"].forEach(value => {
            value["record"].forEach(value2 => {
              if (
                this.chartData.rows.findIndex(
                  row => row.recordTime == value2["recordTime"]
                ) < 0
              ) {
                //push res data into our component data
                var data = {
                  recordTime: value2["recordTime"],
                  heartRate: value2["heartRate"]
                };

                this.chartData.rows.push(data);
                this.id.push(value2.id);
              }
            });
          });
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    parseToMs(arr, prop = null) {
      let arr2 = arr
        .map(b => ({ ...b, [prop]: +moment(b[prop]) }))
        .sort((a, b) => a[prop] - b[prop]);
      return arr2;
    },
    //parseToMs(a) { console.log(a) },
    parseToDDMMYY(arr, prop = null) {
      return arr.map(c => ({
        ...c,
        [prop]: moment(c[prop]).format("DD MM YYYY HH:mm")
      }));
    },
    filterData(dates, data, prop = null) {
      if (dates[0] === null || dates[1] === null) {
        return data;
      }
      return data.filter(
        point => point[prop] >= dates[0] && point[prop] <= dates[1]
      );
    }
  }
};
</script>
