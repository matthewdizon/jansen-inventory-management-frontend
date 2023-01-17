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
    const [filteredData, setFilteredData] = useState(sellingData);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [sortColumn, setSortColumn] = useState("");
    const headers = [
      "Customer",
      "Transaction Date",
      "Total",
      "Collection Date",
      "Charge",
      "View",
    ];

    useEffect(() => {
      sellingData && sortData("transaction date", sellingData);
    }, [sellingData]);

    function handleSearchCriteriaChange(search) {
      setSearch(search);
      const searchedData = sellingData?.filter((data) => {
        return data.customer.toLowerCase().includes(search.toLocaleLowerCase());
      });
      setFilteredData(searchedData);
    }

    const sortData = (header, data) => {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newSortOrder);
      setSortColumn(header);
      const sortedData = [...data].sort((a, b) => {
        let valueA, valueB;
        let newHeader = header;
        // Fix headers into their key property in the object
        // Identifying if the value are dates
        if (header === "transaction date") newHeader = "date";
        if (header === "collection date") newHeader = "collectionDate";

        // Compute charge based on payments array
        if (header === "charge") newHeader = "payments";

        if (newHeader === "date" || newHeader === "collectionDate") {
          // Convert to Date
          valueA = new Date(a[newHeader]);
          valueB = new Date(b[newHeader]);
        } else if (newHeader === "payments") {
          // Calculate Charge
          const totalPaymentsA = a.payments
            .map((payment) => payment.amount)
            .reduce((sum, price) => sum + price, 0);
          const totalPaymentsB = b.payments
            .map((payment) => payment.amount)
            .reduce((sum, price) => sum + price, 0);
          valueA = a.total - totalPaymentsA;
          valueB = b.total - totalPaymentsB;
        } else if (newHeader === "customer") {
          valueA = a[newHeader].toLowerCase();
          valueB = b[newHeader].toLowerCase();
        } else {
          valueA = a[newHeader];
          valueB = b[newHeader];
        }
        if (sortOrder === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
      setFilteredData(sortedData);
    };

    return (
      <div className="overflow-hidden overflow-x-auto rounded-b-xl border border-gray-200 shadow-lg w-full bg-[#fffffe]">
        <div className="flex gap-4">
          <div className="flex relative items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-6"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
                fill="currentColor"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchCriteriaChange(e.target.value)}
              className="bg-gray-100 max-w-max m-4 rounded-2xl p-4 placeholder-gray-400 text-gray-500 border-gray-200 border-2 pl-10"
              placeholder="Search Customer"
            />
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 font-bold">
            <tr>
              {headers.map((header, index) => {
                if (header === "View")
                  return (
                    <th
                      key={index}
                      className="whitespace-nowrap px-4 py-2 text-left text-gray-900"
                    >
                      {header}
                    </th>
                  );
                return (
                  <th
                    key={index}
                    className="whitespace-nowrap px-4 py-2 text-left text-gray-900 hover:cursor-pointer relative"
                    onClick={() => sortData(header.toLowerCase(), sellingData)}
                  >
                    <div>
                      {header}
                      {sortColumn === header.toLowerCase() && (
                        <div className="absolute top-1/2 transform -translate-y-1/2 left-0">
                          {sortOrder === "asc" ? (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.0001 3.67157L13.0001 3.67157L13.0001 16.4999L16.2426 13.2574L17.6568 14.6716L12 20.3284L6.34314 14.6716L7.75735 13.2574L11.0001 16.5001L11.0001 3.67157Z"
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M17.6568 8.96219L16.2393 10.3731L12.9843 7.10285L12.9706 20.7079L10.9706 20.7059L10.9843 7.13806L7.75404 10.3532L6.34314 8.93572L12.0132 3.29211L17.6568 8.96219Z"
                                fill="currentColor"
                              />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 relative">
            {filteredData?.map((part, index) => {
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
    const [filteredData, setFilteredData] = useState(buyingData);
    const [sortOrder, setSortOrder] = useState("");
    const [sortColumn, setSortColumn] = useState("");
    const headers = ["Date", "Delivery Fee", "Total", "View"];

    useEffect(() => {
      buyingData && sortData("date", buyingData);
    }, [buyingData]);

    const sortData = (header, data) => {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newSortOrder);
      setSortColumn(header);
      const sortedData = [...data].sort((a, b) => {
        let valueA, valueB;
        let newHeader = header;

        if (header === "delivery fee") newHeader = "deliveryFee";

        if (newHeader === "date") {
          // Convert to Date
          valueA = new Date(a[newHeader]);
          valueB = new Date(b[newHeader]);
        } else {
          valueA = a[newHeader];
          valueB = b[newHeader];
        }
        if (sortOrder === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
      setFilteredData(sortedData);
    };

    return (
      <div className="overflow-hidden overflow-x-auto rounded-b-xl border border-gray-200 shadow-lg w-full bg-[#fffffe]">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 font-bold">
            <tr>
              {headers.map((header, index) => {
                if (header === "View")
                  return (
                    <th
                      key={index}
                      className="whitespace-nowrap px-4 py-2 text-left text-gray-900"
                    >
                      {header}
                    </th>
                  );
                return (
                  <th
                    key={index}
                    className="whitespace-nowrap px-4 py-2 text-left text-gray-900 hover:cursor-pointer relative"
                    onClick={() => sortData(header.toLowerCase(), buyingData)}
                  >
                    <div>
                      {header}
                      {sortColumn === header.toLowerCase() && (
                        <div className="absolute top-1/2 transform -translate-y-1/2 left-0">
                          {sortOrder === "asc" ? (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.0001 3.67157L13.0001 3.67157L13.0001 16.4999L16.2426 13.2574L17.6568 14.6716L12 20.3284L6.34314 14.6716L7.75735 13.2574L11.0001 16.5001L11.0001 3.67157Z"
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M17.6568 8.96219L16.2393 10.3731L12.9843 7.10285L12.9706 20.7079L10.9706 20.7059L10.9843 7.13806L7.75404 10.3532L6.34314 8.93572L12.0132 3.29211L17.6568 8.96219Z"
                                fill="currentColor"
                              />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 relative">
            {filteredData?.map((part, index) => {
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
