import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Link from "next/link";

function PartSlug() {
  const [data, setData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    async function fetchData() {
      // Make sure slug is defined before using it
      if (slug) {
        // Retrieve the JWT from local storage
        const jwt = localStorage.getItem("accessToken");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/parts/` + slug,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        try {
          const data = await res.json();
          setData(data);
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchData();
  }, [slug]);

  const deletePart = async (id) => {
    const jwt = localStorage.getItem("accessToken");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/parts/` + slug,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (res.ok) router.push("/parts");
  };

  if (!data)
    return (
      <Layout>
        Loading{" "}
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin"
        >
          <path
            opacity="0.2"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            fill="currentColor"
          />
          <path
            d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
            fill="currentColor"
          />
        </svg>
      </Layout>
    );

  const DeleteModal = ({ setShowDeleteModal }) => {
    return (
      <div className="fixed bottom-0 inset-x-0 px-4 pb-6">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirm Delete
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5 text-gray-500">
                    Are you sure you want to delete this item?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-800"
                onClick={() => deletePart(slug)}
              >
                Confirm
              </button>
            </span>
            <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const {
    quantity,
    quantityThreshold,
    name,
    supplier,
    sellingTransactions,
    buyingTransactions,
  } = data;

  console.log(sellingTransactions);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        {showDeleteModal && (
          <DeleteModal setShowDeleteModal={setShowDeleteModal} />
        )}
        <p>Part ID: {slug}</p>
        <div
          className="flex items-center bg-red-400 text-[#fffffe] rounded-lg p-2 px-4 gap-2 hover:opacity-50 duration-500 transition hover:cursor-pointer"
          onClick={() => setShowDeleteModal(true)}
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
              d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z"
              fill="currentColor"
            />
            <path d="M9 9H11V17H9V9Z" fill="currentColor" />
            <path d="M13 9H15V17H13V9Z" fill="currentColor" />
          </svg>
          <p>Delete</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
          <p className="text-sm font-medium mx-auto">Name</p>
          <p className="text-5xl font-extrabold mx-auto">{name}</p>
        </div>
        <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
          <p className="text-sm font-medium mx-auto">Supplier</p>
          <p className="text-5xl font-extrabold mx-auto">{supplier}</p>
        </div>
        <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
          <p className="text-sm font-medium mx-auto">Quantity</p>
          <p className="text-5xl font-extrabold mx-auto">{quantity}</p>
        </div>
        <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
          <p className="text-sm font-medium mx-auto">Quantity Threshold</p>
          <p className="text-5xl font-extrabold mx-auto">{quantityThreshold}</p>
        </div>
      </div>
      <div className="my-8 grid grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-2xl p-8">
          <p className="font-bold text-lg">Selling Transactions</p>
          <div className="grid divide-y-2 h-64 pr-4 overflow-auto">
            {sellingTransactions?.map((transaction, index) => {
              const { _id, date, customer, totalPayments, items, charge } =
                transaction;
              return (
                <Link
                  key={index}
                  className="py-1 hover:bg-gray-200 p-2"
                  href={`/transactions/${_id}?type=selling`}
                >
                  <div className={`flex justify-between text-sm font-thin`}>
                    <p>
                      {Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(date))}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>{customer}</p>
                    <p>₱{totalPayments.toLocaleString()} paid</p>
                  </div>
                  <p className="w-full flex justify-end">
                    ₱{charge.toLocaleString()} charge
                  </p>
                  <div className="w-full flex justify-end">
                    {items.map((item, index) => {
                      return (
                        <div key={index}>
                          <p>
                            {item.quantity} sold @ ₱{item.price} each
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-8">
          <p className="font-bold text-lg">Buying Transactions</p>
          <div className="grid divide-y-2 h-64 pr-4 overflow-auto">
            {buyingTransactions?.map((transaction, index) => {
              const { _id, date, total, items } = transaction;
              return (
                <Link
                  key={index}
                  className="py-1 hover:bg-gray-200 p-2"
                  href={`/transactions/${_id}?type=buying`}
                >
                  <div className={`flex justify-between text-sm font-thin`}>
                    <p>
                      {Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(date))}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>₱{total.toLocaleString()}</p>
                    <div>
                      {items.map((item, index) => {
                        return (
                          <div key={index}>
                            <p>
                              {item.quantity} purchased @ ₱{item.price} each
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default PartSlug;
