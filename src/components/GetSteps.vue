<template>
  <!--<vue-core-video-player src="./videos/your_video.mp4"></vue-core-video-player>-->
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
    <!-- <v-card
      v-else
      class="mx-auto elevation-12"
      color="grey lighten-4"
      max-width="700"
    > -->
    <v-select
      v-model="setDate"
      :items="dateList()"
      item-value="recordDate"
      label="Date"
    ></v-select>
    <!-- <v-data-table :items="currentData.rows" :loading="isLoading"></v-data-table> -->
    <ve-line :data="currentData" :settings="chartSettings"></ve-line>
    <!-- </v-card> -->
  </v-container>
</template>

<script>
import moment from "moment";
//import VueCoreVideoPlayer from "vue-core-video-player";

export default {
  name: "GetSteps",
  data() {
    return {
      chartSettings: {
        labelMap: {
          step: "Steps"
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
  components: {
    //VueCoreVideoPlayer,
  },
  created() {
    this.getData();
  },
  computed: {
    stepsAvg() {
      const steps = this.data
        .map(record => record["record"].map(el => el["step"]))
        .flat();
      const length = steps.length;
      const sum = steps.reduce((acc, cur) => acc + cur, 0);
      if (!sum || !length) return 0;
      return Math.floor(sum / length);
    },
    stepsTotal() {
      const steps = this.data
        .map(record => record["record"].map(el => el["step"]))
        .flat();
      const sum = steps.reduce((acc, cur) => acc + cur, 0);
      return sum;
    },
    isLoading() {
      return true;
    },
    currentData() {
      let rows = this.data.find(record =>
        //isSame is a moment method that works as an == logical operator except with date objects
        moment(record.date).isSame(moment(this.setDate))
      ) || { record: [] };
      return {
        columns: ["date", "step"],
        //rows: [...rows["record"], rows["records"]]
        rows: rows.record
          .filter(
            (val, index) =>
              rows.record.findIndex(
                val2 => val2.recordTime == val["recordTime"]
              ) == index
          )
          .flat()
          .sort((a, b) => moment(a.recordTime) - moment(b.recordTime))
          .map(step => ({
            ...step,
            date: this.convertTime(step.recordTime)
          }))
      };
    }
  },
  methods: {
    dateList() {
      return this.data.map(result => moment(result.date).format("YYYY-MM-DD"));
    },
    getData() {
      this.loading = true;
      this.$api.component
        .apiGetStep({
          isDescend: true
        })
        .then(res => {
          this.loading = false;
          this.data = res.data.result;
          //console.log(this.currentData.rows);
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    convertTime(arg) {
      return moment(arg).format("DD-MM-YY HH:mm:SS");
    }
  }
};
</script>
