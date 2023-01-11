import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Link from "next/link";

function Transactions() {
  const [sellingData, setSellingData] = useState(null);
  const [buyingData, setBuyingData] = useState(null);
  const [transactionsType, setTransactionsType] = useState("Selling");

  const [showMenu, setShowMenu] = useState(null);

  const toggleMenu = (index) => {
    if (showMenu === index) {
      setShowMenu(null);
    } else {
      setShowMenu(index);
    }
  };

  const deleteSellingTransaction = async (id) => {
    const jwt = localStorage.getItem("accessToken");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/transactions/selling/` +
        id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // const json = await res.json();

    // if (res.ok) {
    //   router.push(router.asPath);
    // }
  };

  useEffect(() => {
    async function fetchData() {
      // Retrieve the JWT from local storage
      const jwt = localStorage.getItem("accessToken");

      const sellingRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/transactions/selling`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const buyingRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/transactions/buying`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      try {
        const sellingData = await sellingRes.json();
        const buyingData = await buyingRes.json();
        setSellingData(sellingData);
        setBuyingData(buyingData);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  const SellingDataTable = () => {
    return (
      <div className="overflow-hidden overflow-x-auto rounded-b-xl border border-gray-200 shadow-lg w-full bg-[#fffffe]">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Customer
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Transaction Date
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Total
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Collection Date
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Charge
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                View
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 relative">
            {sellingData?.map((part, index) => {
              const totalPayments = part.payments
                .map((payment) => payment.amount)
                .reduce((sum, price) => sum + price, 0);

              return (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {part.customer}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(part.date))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {part.total}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(part.collectionDate))}
                  </td>
                  <td>{part.total - totalPayments}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <Link
                      href={`/transactions/${part._id}?type=selling`}
                      className="block rounded-lg max-w-max px-2 py-1 text-sm text-gray-500 border-[1px] hover:bg-gray-50 hover:text-gray-700"
                      role="menuitem"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                          fill="currentColor"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12 3C17.5915 3 22.2898 6.82432 23.6219 12C22.2898 17.1757 17.5915 21 12 21C6.40848 21 1.71018 17.1757 0.378052 12C1.71018 6.82432 6.40848 3 12 3ZM12 19C7.52443 19 3.73132 16.0581 2.45723 12C3.73132 7.94186 7.52443 5 12 5C16.4756 5 20.2687 7.94186 21.5428 12C20.2687 16.0581 16.4756 19 12 19Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const BuyingDataTable = () => {
    return (
      <div className="overflow-hidden overflow-x-auto rounded-b-xl border border-gray-200 shadow-lg w-full bg-[#fffffe]">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Date
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Delivery Fee
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Total
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                View
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 relative">
            {buyingData?.map((part, index) => {
              console.log("weird", part.items, part.date);
              return (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(part.date))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {part.deliveryFee}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {part.total}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {part.items.map((item, index) => {
                      return (
                        <div key={index} className="flex gap-2">
                          <p>{item.part} x</p>
                          <p>{item.quantity} pcs @</p>
                          <p>{item.price} PHP each</p>
                        </div>
                      );
                    })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <Link
                      href={`/transactions/${part._id}?type=buying`}
                      className="block rounded-lg max-w-max px-2 py-1 text-sm text-gray-500 border-[1px] hover:bg-gray-50 hover:text-gray-700"
                      role="menuitem"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                          fill="currentColor"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12 3C17.5915 3 22.2898 6.82432 23.6219 12C22.2898 17.1757 17.5915 21 12 21C6.40848 21 1.71018 17.1757 0.378052 12C1.71018 6.82432 6.40848 3 12 3ZM12 19C7.52443 19 3.73132 16.0581 2.45723 12C3.73132 7.94186 7.52443 5 12 5C16.4756 5 20.2687 7.94186 21.5428 12C20.2687 16.0581 16.4756 19 12 19Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex items-center justify-between pb-4">
        <h1 className="font-bold text-[#094067]">Transactions</h1>
        <Link
          href={"/transactions/add"}
          className="flex items-center bg-[#90b4ce] text-[#fffffe] rounded-lg p-2 px-4 gap-2 hover:opacity-50 duration-500 transition"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7Z"
              fill="currentColor"
            />
          </svg>
          <p>New</p>
        </Link>
      </div>
      <ul className="flex border-b border-gray-200 text-center gap-1">
        <li>
          <div
            className={`${
              transactionsType === "Selling"
                ? "border-gray-200 bg-white underline"
                : ""
            } block bg-gray-100 p-4 px-16 text-sm font-medium text-gray-500 ring-1 ring-inset ring-white max-w-max rounded-t-xl hover:cursor-pointer`}
            onClick={() => setTransactionsType("Selling")}
          >
            Selling
          </div>
        </li>
        <li>
          <div
            className={`${
              transactionsType === "Buying"
                ? "border-gray-200 bg-white underline"
                : ""
            } block bg-gray-100 p-4 px-16 text-sm font-medium text-gray-500 ring-1 ring-inset ring-white max-w-max rounded-t-xl hover:cursor-pointer`}
            onClick={() => setTransactionsType("Buying")}
          >
            Buying
          </div>
        </li>
      </ul>
      {transactionsType === "Selling" ? (
        <SellingDataTable />
      ) : (
        <BuyingDataTable />
      )}
    </Layout>
  );
}

export default Transactions;
