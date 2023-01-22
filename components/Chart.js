import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function ChartComponent({ data }) {
  console.log("CHART DATA", data);
  const { expensesPerMonth, profitPerMonth } = data;

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
          "Aug",
          "Sept",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            id: 1,
            label: "Profit",
            data: profitPerMonth,
          },
          {
            id: 2,
            label: "Expenses",
            data: expensesPerMonth,
          },
        ],
      }}
    />
  );
}
