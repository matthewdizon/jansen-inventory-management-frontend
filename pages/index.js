import { useEffect, useState } from "react";
import Layout from "../components/layout";
import Chart from "../components/Chart";

export default function Home() {
  const [productsCount, setProductsCount] = useState(0);
  const [transactionsMonthlyTotal, setTransactionsMonthlyTotal] = useState({
    totalProfit: 0,
    totalExpenses: 0,
  });
  const [upcomingAndOverduePayments, setUpcomingAndOverduePayments] = useState(
    []
  );
  const [lowQuantityParts, setLowQuantityParts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Retrieve the JWT from local storage
      const jwt = localStorage.getItem("accessToken");

      try {
        const [api1, api2, api3, api4] = await Promise.all([
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
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/dashboard/lowQuantityParts`,
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          ),
        ]);
        const data = await Promise.all([
          api1.json(),
          api2.json(),
          api3.json(),
          api4.json(),
        ]);
        console.log("HERE HERE HERE", data);
        setProductsCount(data[0].count);
        setTransactionsMonthlyTotal({
          totalProfit: data[1].totalProfit,
          totalExpenses: data[1].totalExpenses,
        });
        setUpcomingAndOverduePayments(data[2].payments);
        setLowQuantityParts(data[3].parts);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <Layout>
      <p>Home Dashboard</p>
      <div className="grid grid-cols-3 gap-8 my-8">
        <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
          <p className="text-sm font-medium mx-auto">Total Products</p>
          <p className="text-5xl font-extrabold mx-auto">{productsCount}</p>
        </div>
        <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
          <p className="text-sm font-medium mx-auto">Total Profit</p>
          <p className="text-5xl font-extrabold mx-auto">
            ₱{transactionsMonthlyTotal.totalProfit.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
          <p className="text-sm font-medium mx-auto">Total Expenses</p>
          <p className="text-5xl font-extrabold mx-auto">
            ₱{transactionsMonthlyTotal.totalExpenses.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="rounded-2xl p-8 bg-gray-100 col-span-2 flex flex-col items-center justify-center mb-auto">
          <p className="font-bold uppercase text-xl pb-4">
            Annual Graph (Profit VS Expenses )
          </p>
          <Chart />
        </div>
        <div className="grid gap-8">
          <div className="rounded-2xl p-8 bg-gray-100">
            <p className="font-bold uppercase text-xl pb-4">
              Low Quantity Parts
            </p>
            {lowQuantityParts.length !== 0 && (
              <div className="grid grid-cols-3 py-1 font-bold text-xs uppercase">
                <p>Part</p>
                <p>Quantity</p>
                <p>Threshold</p>
              </div>
            )}
            <div>
              {lowQuantityParts.map((part, index) => {
                return (
                  <div key={index} className="grid grid-cols-3 py-1">
                    <p>{part.name}</p>
                    <p>{part.quantity}</p>
                    <p>{part.quantityThreshold}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl p-8 bg-gray-100">
            <p className="font-bold uppercase text-xl pb-4">
              Upcoming Payments
            </p>
            <div className="grid divide-y-2">
              {upcomingAndOverduePayments?.map((payment, index) => {
                const totalPayments = payment.payments
                  .map((payment) => payment.amount)
                  .reduce((sum, price) => sum + price, 0);

                const isAfterToday =
                  new Date().toISOString().substring(0, 10) >
                  payment.collectionDate;

                return (
                  <div key={index} className="py-1">
                    <div
                      className={`${
                        isAfterToday ? "text-red-400" : ""
                      } flex justify-between text-sm font-thin`}
                    >
                      <p>
                        {Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(payment.collectionDate))}
                      </p>
                      <p>{isAfterToday ? " (Overdue)" : " (Upcoming)"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>{payment.customer}</p>
                      <p>₱{(payment.total - totalPayments).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
