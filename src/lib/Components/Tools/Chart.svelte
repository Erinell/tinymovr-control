<script context="module" lang="ts">
  export enum Type {
    DATE,
    POINT,
  }
</script>

<script lang="ts">
  import Chart from "svelte-frappe-charts";
  let chartRef: Chart;

  export let updateOnChange = false;
  export let title: string | undefined = undefined;
  export let y_point: any = [];
  export const unit: string = "";

  let maxPoints = 100;

  export let x_axis: Array<any> = [];
  export let y_axis: Array<any> = [];

  let data = {
    labels: x_axis,
    datasets: [
      {
        values: y_axis,
        type: "line",
        start: 0,
      },
    ],
  };

  $: {
    if (
      !updateOnChange ||
      (y_point != y_axis[y_axis.length - 1] && updateOnChange)
    ) {
      x_axis = [...x_axis, formatDate(new Date())];
      y_axis = [...y_axis, y_point];
      data.labels = x_axis;
      data.datasets[0].values = y_axis;
      if (data.datasets[0].values.length >= maxPoints) {
        x_axis.shift();
        y_axis.shift();
      }
    }
  }

  export const addX = (x_axis: any) => {
    console.log(x_axis);
  };

  function formatDate(date: Date) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes(),
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(
      2,
      "0",
    )}.${date.getMilliseconds()}`;
  }
</script>

<div class="w-full">
  <Chart
    {title}
    {data}
    type="line"
    bind:this={chartRef}
    lineOptions={{ hideDots: true }}
    axisOptions={{
      xIsSeries: true,
      xAxisMode: "tick",
      shortenYAxisNumbers: true,
    }}
    animate={false}
  />
</div>
