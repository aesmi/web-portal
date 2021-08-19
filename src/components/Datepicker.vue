<template>
  <v-card class="mt-12 mx-auto">
    <v-app-bar flat>
      <!-- click outside, the datepicker would be closed -->

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
          <v-date-picker
            v-model="date"
            half-width
            elevation="20"
            :show-current="false"
            color="grey"
          />
        </template>

        <v-text-field
          class="pt-7"
          :value="date"
          slot="activator"
          label="Date"
          readonly
          shaped
        />
      </v-menu>
    </v-app-bar>

    <v-sheet
      class="v-sheet--offset mx-auto"
      color="white"
      elevation="10"
      max-width="calc(80% )"
      max-height="calc(80%)"
    >
      <div class="pb-100" />
      <span>
        <!-- <v-sparkline
          :value="GetECGList"
          :gradient="gradient"
          :smooth="radius || false"
          :padding="padding"
          :line-width="width"
          :stroke-linecap="lineCap"
          :gradient-direction="gradientDirection"
          :fill="fill"
          :type="type"
          :auto-line-width="autoLineWidth"
          auto-draw
        >
        </v-sparkline>--></span
      ></v-sheet
    ></v-card
  ></template
>
