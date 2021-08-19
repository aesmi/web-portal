<template>
  <v-container>
    <v-card class="mt-4 mx-auto" max-width="800">
      <v-sheet class="v-sheet--offset mx-auto" color="cyan" elevation="12">
      </v-sheet>
      <v-card-text class="pt-0">
        <div class="title font-weight-light mb-2">Report</div>
        <v-divider class="my-2"></v-divider>
      </v-card-text>
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
      <div style="text-align:left " class="pl-6 pb-3">Name</div>

      <!-- use v-for to show all the plan on the list -->
      <li style="list-style:none" v-for="item in recordPlan" :key="item.planId">
        <!-- each plan has one data table -->
        <v-data-table
          :items="[item] || []"
          :headers="headers"
          item-key="planId"
          group-by="planName"
          mobile-breakpoint="0"
          hide-default-footer
          hide-default-header
        >
          <!-- Data table header setup (name,collapse the plan ) -->
          <template v-slot:group.header="{ group, headers, toggle, isOpen }">
            <!-- when user clicks the header, api will be called and display item(togglePlan Method) -->
            <td
              colspan="3"
              @click.stop="togglePlan(toggle, item.planId, isOpen)"
              :ref="group"
              :plan-open="isOpen"
              style="height:100%; width:100%"
            >
              <v-icon>{{ isOpen ? "$minus" : "$plus" }}</v-icon>

              <span style="font-weight:bold;">
                {{ group }} {{ item.assessmentDate }}
              </span>
            </td>
          </template>

          <!-- Display the item of plan by using data-table  -->
          <template v-slot:item>
            <v-data-table
              :headers="headersPlan"
              :items="getRecord(item.planId) || []"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              group-by="profileName"
              hide-default-footer
              mobile-breakpoint="0"
              @page-count="pageCount = $event"
            >
              <!--Optional: Collapse all grouped rows  -->
              <template v-slot:top>
                <v-row>
                  <v-col :cols="9">
                    <v-btn small color="#66B2FF" @click="closeItem"
                      >collapse All</v-btn
                    >
                  </v-col>
                  <v-col :cols="3">
                    <v-icon text>mdi-chart-line</v-icon>
                    (Chart)
                  </v-col>
                </v-row>
              </template>
              <!-- Item grouped header setup -->
              <template
                v-slot:group.header="{
                  group,
                  headers,
                  toggle,
                  isOpen
                }"
              >
                <!-- Collapse the all item in the grouped headers -->

                <td
                  colspan="3"
                  @click="toggle"
                  :ref="group"
                  :item-open="isOpen"
                  style="height:100%; width:100%"
                >
                  <v-icon>{{ isOpen ? "$minus" : "$plus" }}</v-icon>

                  <span style="font-weight:bold;">{{ group }}</span>
                </td>
              </template>
              <!-- Item layout -->
              <template v-slot:item.resultWithUnit="{ item }">
                <!-- display dialog of chart by clicking an item -->
                <v-dialog
                  v-model="dialogItem[item.result]"
                  :key="item.result"
                  @keydown.esc="$set(dialogItem, item.result, false)"
                  hide-overlay
                  :retain-focus="false"
                  v-if="!isNaN(item.result)"
                  max-width="500"
                >
                  <!-- The color,line of chart would be different depend on the value of item -->
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      :color="getColor(item.result, item.ref_Min, item.ref_Max)"
                      text
                      v-on="on"
                      v-bind="attrs"
                      :loading="!isNaN(item)"
                      @click.stop="
                        $set(dialogItem, item.result, true) +
                          setColor(item) +
                          setRange(item)
                      "
                    >
                      {{ item.resultWithUnit }}
                      <v-icon right text>mdi-chart-line</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-col cols="12 pt-0">
                      <v-row justify="end">
                        <v-col class="pa-0">
                          <v-card-actions>
                            <!-- display the closing button( close the dialog, the condition of that dialog would set to false) -->
                            <v-btn
                              @click.stop="$set(dialogItem, item.result, false)"
                              text
                              >X</v-btn
                            >
                          </v-card-actions>
                        </v-col>
                        <v-col cols="auto pa-0">
                          <v-card-title class="pl-7 ml-0 ">
                            <strong style="font-size:25px">
                              {{ item.itemName }}</strong
                            >
                          </v-card-title>
                        </v-col>
                      </v-row>

                      <div style="font-size:20px">
                        <v-col cols="12 pt-0">
                          <v-row align="start" justify="center">
                            <v-col cols="6" class="pt-0">
                              {{ "Result: " }}
                              <strong>{{ item.result }}</strong>
                            </v-col>
                            <v-col cols="6" v-if="!showMin(item)" class="pt-0">
                              {{ "Safe Range : " }}

                              <strong>{{ item.ref_Max }}</strong>
                            </v-col>
                            <v-col cols="6" v-if="showMin(item)" class="pt-0">
                              {{ "Safe Range : " }}
                              <strong
                                >{{ item.ref_Min }}{{ " - "
                                }}{{ item.ref_Max }}</strong
                              >
                            </v-col>
                          </v-row>
                        </v-col>
                      </div>
                      <div>
                        <v-row justify="center">
                          <v-col cols="auto">
                            <!-- Histogram(chart) to display -->
                            <ve-histogram
                              :data="itemChart(item)"
                              :extend="chartExtend"
                              :settings="chartSetting"
                              :mark-line="markLine"
                              :y-axis="yaxis"
                              width="300px"
                            ></ve-histogram>
                          </v-col>
                        </v-row>
                      </div>
                    </v-col>
                  </v-card>
                </v-dialog>

                <div v-else>
                  <v-chip
                    :color="getColor(item.result, item.ref_Min, item.ref_Max)"
                    text
                    >{{ item.resultWithUnit }}</v-chip
                  >
                </div>
              </template>
            </v-data-table>
            <!-- Page pagination -->

            <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </template>
        </v-data-table>
      </li>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      //open and close dialog in data table
      //avoid all dialog of grouped items opening
      dialogItem: {},
      planId: [],
      planName: [],
      assessmentDate: [],
      //get record from recordPlan
      recordPlan: [],
      userHealthRecordId: [],
      profileList: [],
      profileName: [],
      itemListResult: [],
      date: null,
      expanded: [],
      //pagination
      page: 1,
      pageCount: 0,
      itemsPerPage: 30,
      //v-data-table headers
      headers: [{ text: "Name", value: "data-table-expand" }],
      headersPlan: [
        { text: "Profile", value: "profileName" },
        { text: "Name", value: "itemName" },
        { text: "Result", value: "resultWithUnit" },
        { text: "Safe Range", value: "safeRange" }
      ],
      // Safe Rnage
      itemMin: [],
      itemMax: [],
      itemResult: [],

      //Chart Extend (v-chart)
      itemColor: [],

      //loading dialog
      loading: true
    };
  },
  async mounted() {
    const planPromise = this.getRecordPlan();

    // const listPromise = this.getRecordItem();

    await Promise.all([planPromise]);
    this.closeItem();
    this.closePlan();
  },
  computed: {
    //Chart Color
    chartExtend() {
      return {
        color: [this.itemColor, "red"]
      };
    },
    //Chart Setting
    chartSetting() {
      return {
        showLine: ["ref_Max"],
        min: [this.itemMin],
        result: [this.itemResult],
        max: [this.itemMax],
        legendName: {
          ref_Max: "Safe Range"
        }
      };
    },

    // get items

    getPlan() {
      return this.recordPlan;
    }
  },
  watch: {
    async page() {
      await this.$nextTick();
      this.closeItem();
    }
  },
  methods: {
    getRecord(id) {
      if (id == this.planid) return this.itemListResult;
      else return null;
    },
    showMin(item) {
      if (item.ref_Min != "") return true;
      else return false;
    },
    itemClick(item) {
      return isNaN(item.result);
    },
    setColor(item) {
      this.itemColor = this.getColor(item.result, item.ref_Min, item.ref_Max);
    },
    setRange(item) {
      this.itemMin = item.ref_Min;
      this.itemResult = item.result;
      this.itemMax = item.ref_Max;
    },
    async togglePlan(toggle, id, open) {
      if (open == false) {
        await this.getRecordItem(id);
      } else {
        ("");
      }
      toggle();
      await this.$nextTick();
      this.closeItem();
    },
    //collapse all grouped rows
    closeItem() {
      Object.keys(this.$refs).forEach(k => {
        if (this.$refs[k][0] && this.$refs[k][0].attributes["item-open"]) {
          this.$refs[k][0].click();
        }
      });
    },
    closePlan() {
      Object.keys(this.$refs).forEach(k => {
        if (this.$refs[k][0] && this.$refs[k][0].attributes["plan-open"]) {
          this.$refs[k][0].click();
        }
      });
    },
    //Display color of result
    getColor(result, min, max) {
      if (isNaN(result) && result == "Negative") return "red";
      else if (isNaN(result)) return "white";
      else if (result > parseFloat(max)) return "red";
      else if (result < parseFloat(min)) return "grey";
      else return "green";
    },

    getRecordPlan() {
      return this.$api.component
        .apiGetRecordPlan({
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        })

        .then(response => {
          this.loading = false;

          // let a = { planId: 123, planName: "hello" };

          // response.data.result.push(a);

          response.data.result.forEach(v => {
            this.planId.push(v.planId);

            this.planName.push(v.planName);
            //Get the date of report
            v.assessmentDate = moment(v.assessmentDate).format("YYYY-MM-DD");
            this.assessmentDate.push(v.assessmentDate);

            this.recordPlan.push(v);
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //only get one record plan
    getRecordItem(id) {
      const config = {
        params: { type: 1, planId: id },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      };
      return this.$api.component
        .apiGetRecordList(config)
        .then(response => {
          this.loading = false;
          this.itemListResult = [];
          this.planid = id;
          response.data.result["profileList"].forEach(list => {
            this.profileName = list.profileName;

            list.assessmentDate = moment(this.assessmentDate).format(
              "YYYY-MM-DD"
            );
            list.planId = this.planId;

            this.profileList.push(list);

            list.itemLists.forEach(items => {
              items.profileName = this.profileName;
              //convert an array to a string
              items.resultWithUnit = items.result.concat(
                " ",
                items.result_Unit
              );
              if (items.ref_Min != "") {
                items.safeRange = items.ref_Min.concat(
                  "",
                  items.result_Unit,
                  " ~ ",
                  items.ref_Max,
                  "",
                  items.result_Unit
                );
              } else if (items.ref_Max != "") {
                items.safeRange = items.ref_Max.concat("", items.result_Unit);
              } else {
                items.safeRange = "Nil";
              }
              items.date = moment(items.assessmentDate).format("YYYY-MM-DD");
              //remove the previous values of array
              this.itemListResult.push(items);
            });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // Item Chart
    itemChart(item) {
      //let rows = Object.entries(item);
      if (!isNaN(item.result)) {
        item.result = parseFloat(item.result);
      }
      this.yaxis = {
        min: 0
      };
      this.markLine = {
        data: [{ name: "Safe Range", type: "max" }]
      };
      return {
        columns: ["itemName", "result", "ref_Max"],
        rows: [item] || []
      };
    },
    //Chart color with corresponding result
    getChartColor() {
      let items = this.getRecord;

      return this.getColor(items.result, items.ref_Min, items.ref_Max);
    }
  }
};
</script>
