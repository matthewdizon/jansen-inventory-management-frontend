import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function ChartComponent() {
  return (
    <Line
      datasetIdKey="id"
      data={{
        labels: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            id: 1,
            label: "Profit",
            data: [5, 6, 7],
          },
          {
            id: 2,
            label: "Expenses",
            data: [3, 2, 1],
          },
        ],
      }}
    />
  );
}
