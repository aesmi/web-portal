<script>
import { Line } from "vue-chartjs";
export default {
  extends: Line,
  props: {
    label: {
      default: "",
      type: String
    },
    chartData: {
      default: () => [],
      type: Array
    },
    options: {
      default: () => {},
      type: Object
    },
    chartColors: {
      default: () => {},
      type: Object
    }
  },
  mounted() {
    const dates = this.chartData.map(d => d.date).reverse();
    const record = this.chartData.map(d => d.record).reverse();
    const {
      borderColor,
      pointBorderColor,
      pointBackgroundColor,
      backgroundColor
    } = this.chartColors;
    this.renderChart(
      {
        labels: dates,
        datasets: [
          {
            label: this.label,
            data: record,
            borderColor: borderColor,
            pointBorderColor: pointBorderColor,
            pointBackgroundColor: pointBackgroundColor,
            backgroundColor: backgroundColor
          }
        ]
      },
      this.options
    );
  }
};
</script>
