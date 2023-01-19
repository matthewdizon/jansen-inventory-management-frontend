import { useEffect, useState } from "react";
import Layout from "../components/layout";

export default function Home() {
  const [productsCount, setProductsCount] = useState(0);
  const [transactionsMonthlyTotal, setTransactionsMonthlyTotal] = useState({
    totalProfit: 0,
    totalExpenses: 0,
  });
  const [upcomingAndOverduePayments, setUpcomingAndOverduePayments] = useState(
    []
  );

  useEffect(() => {
    async function fetchData() {
      // Retrieve the JWT from local storage
      const jwt = localStorage.getItem("accessToken");

      try {
        const [api1, api2, api3] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/dashboard/productsCount`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/dashboard/transactionsMonthlyTotal`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/dashboard/upcomingAndOverduePayments`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          ),
        ]);
        const data = await Promise.all([api1.json(), api2.json(), api3.json()]);
        console.log("HERE HERE HERE", data);
        setProductsCount(data[0].count);
        setTransactionsMonthlyTotal({
          totalProfit: data[1].totalProfit,
          totalExpenses: data[1].totalExpenses,
        });
        setUpcomingAndOverduePayments(data[2].payments);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  console.log("pc", productsCount);
  console.log("tmt", transactionsMonthlyTotal);
  console.log("uaodp", upcomingAndOverduePayments);

  return (
    <Layout>
      <p>Home</p>
      <p>Total Number of Products: {productsCount}</p>
      <p>
        Total Profit of Selling Transactions (month amount):{" "}
        {transactionsMonthlyTotal.totalProfit}
      </p>
      <p>
        Total Expenses of Buying Transactions (month amount):{" "}
        {transactionsMonthlyTotal.totalExpenses}
      </p>
      <p>One graph for both profit and expenses (for the year)</p>
      <p>Emergency Action: Low Quantity Parts</p>
      <p>Emergency Action: Upcoming Payments (overdue or near)</p>
      {upcomingAndOverduePayments?.map((payment, index) => {
        const totalPayments = payment.payments
          .map((payment) => payment.amount)
          .reduce((sum, price) => sum + price, 0);

        const isAfterToday =
          new Date().toISOString().substring(0, 10) > payment.collectionDate;

        return (
          <div key={index} className="py-2">
            <p className={`${isAfterToday ? "text-red-400" : ""}`}>
              {Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(payment.collectionDate))}
              {isAfterToday ? " (Overdue)" : " (Upcoming)"}
            </p>
            <p>{payment.customer}</p>
            <p>{payment.total - totalPayments}</p>
          </div>
        );
      })}
    </Layout>
  );
}
