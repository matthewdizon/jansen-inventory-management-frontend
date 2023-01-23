import { useEffect, useState } from "react";
import Layout from "../components/layout";
import Chart from "../components/Chart";
import Link from "next/link";

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
  const [profitPerMonth, setProfitPerMonth] = useState({});

  useEffect(() => {
    async function fetchData() {
      // Retrieve the JWT from local storage
      const jwt = localStorage.getItem("accessToken");

      try {
        const [api1, api2, api3, api4, api5] = await Promise.all([
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
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/dashboard/getProfitPerMonth`,
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
          api5.json(),
        ]);
        console.log("HERE HERE HERE", data);
        setProductsCount(data[0].count);
        setTransactionsMonthlyTotal({
          totalProfit: data[1].totalProfit,
          totalExpenses: data[1].totalExpenses,
        });
        setUpcomingAndOverduePayments(data[2].payments);
        setLowQuantityParts(data[3].parts);
        setProfitPerMonth(data[4]);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const monthNames = [
    "January",
    "February",
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
  ];

  return (
    <Layout>
      <p>Home Dashboard</p>
      <div className="flex flex-col gap-8 my-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
            <p className="text-sm font-medium mx-auto">Total Products</p>
            <p className="text-5xl font-extrabold mx-auto">{productsCount}</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
            <p className="text-sm font-medium mx-auto">
              Total Profit for {monthNames[currentMonth]}
            </p>
            <p className="text-5xl font-extrabold mx-auto">
              ₱{transactionsMonthlyTotal.totalProfit.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
            <p className="text-sm font-medium mx-auto">
              Total Expenses for {monthNames[currentMonth]}
            </p>
            <p className="text-5xl font-extrabold mx-auto">
              ₱{transactionsMonthlyTotal.totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="rounded-2xl p-8 bg-gray-100 col-span-2 flex flex-col items-center justify-center">
          <p className="font-bold uppercase text-xl pb-4">
            Annual Graph (Profit VS Expenses )
          </p>
          <Chart data={profitPerMonth} />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="rounded-2xl p-8 bg-gray-100">
            <p className="font-bold uppercase text-xl pb-4">
              Low Quantity Parts ({lowQuantityParts.length})
            </p>
            {lowQuantityParts.length !== 0 && (
              <div className="grid grid-cols-3 py-1 font-bold text-xs uppercase">
                <p>Part</p>
                <p>Quantity</p>
                <p>Threshold</p>
              </div>
            )}
            <div className="grid divide-y-2">
              {lowQuantityParts.map((part, index) => {
                return (
                  <Link
                    key={index}
                    className="grid grid-cols-3 py-1 hover:bg-gray-200 p-2"
                    href={`/parts/${part._id}`}
                  >
                    <p>{part.name}</p>
                    <p>{part.quantity}</p>
                    <p>{part.quantityThreshold}</p>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl p-8 bg-gray-100">
            <p className="font-bold uppercase text-xl pb-4">
              Upcoming Payments ({upcomingAndOverduePayments.length})
            </p>
            <div className="grid divide-y-2 h-64 pr-4 overflow-auto">
              {upcomingAndOverduePayments?.map((payment, index) => {
                const totalPayments = payment.payments
                  .map((payment) => payment.amount)
                  .reduce((sum, price) => sum + price, 0);

                const isAfterToday =
                  new Date().toISOString().substring(0, 10) >
                  payment.collectionDate;

                return (
                  <Link
                    key={index}
                    className="py-1 hover:bg-gray-200 p-2"
                    href={`/transactions/${payment._id}?type=selling`}
                  >
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
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
