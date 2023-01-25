import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import Layout from "../../components/layout";
import Link from "next/link";

function PartSlug() {
  const [data, setData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(null);

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

  const UpdateModal = ({
    setShowUpdateModal,
    currName,
    currSupplier,
    currQuantity,
    currThreshold,
  }) => {
    const [name, setName] = useState(currName);
    const [supplier, setSupplier] = useState(currSupplier);
    const [quantity, setQuantity] = useState(currQuantity);
    const [quantityThreshold, setQuantityThreshold] = useState(currThreshold);

    const handleSubmit = async (e) => {
      e.preventDefault();

      const jwt = localStorage.getItem("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/parts/` + slug,
        {
          method: "PATCH",
          body: JSON.stringify({
            slug,
            name,
            supplier,
            quantity,
            quantityThreshold,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (res.ok) {
        console.log(res);
        setShowUpdateModal(false);
      }
    };

    return (
      <div
        className={`fixed inset-0 flex items-center justify-center`}
        style={{ background: "rgba(50, 50, 50, 0.8)" }}
      >
        <form
          className="bg-white p-16 rounded-2xl relative"
          onSubmit={handleSubmit}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setShowUpdateModal(false)}
            className="absolute top-6 right-6 hover:cursor-pointer"
          >
            <path
              d="M16.3394 9.32245C16.7434 8.94589 16.7657 8.31312 16.3891 7.90911C16.0126 7.50509 15.3798 7.48283 14.9758 7.85938L12.0497 10.5866L9.32245 7.66048C8.94589 7.25647 8.31312 7.23421 7.90911 7.61076C7.50509 7.98731 7.48283 8.62008 7.85938 9.0241L10.5866 11.9502L7.66048 14.6775C7.25647 15.054 7.23421 15.6868 7.61076 16.0908C7.98731 16.4948 8.62008 16.5171 9.0241 16.1405L11.9502 13.4133L14.6775 16.3394C15.054 16.7434 15.6868 16.7657 16.0908 16.3891C16.4948 16.0126 16.5171 15.3798 16.1405 14.9758L13.4133 12.0497L16.3394 9.32245Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
              fill="currentColor"
            />
          </svg>
          <p className="font-bold text-xl">Add New Payment</p>
          <div className="grid gap-8 py-8">
            <div className="grid grid-cols-2">
              <p>Name</p>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Name"
                className="px-4 py-2 rounded-xl border-2 border-gray-200"
              />
            </div>
            <div className="grid grid-cols-2">
              <p>Supplier</p>
              <input
                type="text"
                onChange={(e) => setSupplier(e.target.value)}
                value={supplier}
                placeholder="supplier"
                className="px-4 py-2 rounded-xl border-2 border-gray-200"
              />
            </div>
            <div className="grid grid-cols-2">
              <p>Quantity</p>
              <input
                type="number"
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
                placeholder="quantity"
                className="px-4 py-2 rounded-xl border-2 border-gray-200"
              />
            </div>
            <div className="grid grid-cols-2">
              <p>Quantity Threshold</p>
              <input
                type="number"
                onChange={(e) => setQuantityThreshold(e.target.value)}
                value={quantityThreshold}
                placeholder="quantity threshold"
                className="px-4 py-2 rounded-xl border-2 border-gray-200"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#3da9fc] text-[#fffffe] px-4 py-2 rounded-lg hover:shadow-lg uppercase"
            >
              Update Part
            </button>
          </div>
        </form>
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
        {showUpdateModal && (
          <UpdateModal
            setShowUpdateModal={setShowUpdateModal}
            currName={name}
            currSupplier={supplier}
            currQuantity={quantity}
            currThreshold={quantityThreshold}
          />
        )}
        <p>Part ID: {slug}</p>
        <div className="flex gap-4">
          <div
            className="flex items-center bg-blue-400 text-[#fffffe] rounded-lg p-2 px-4 gap-2 hover:opacity-50 duration-500 transition hover:cursor-pointer"
            onClick={() => setShowUpdateModal(true)}
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
                d="M21.2635 2.29289C20.873 1.90237 20.2398 1.90237 19.8493 2.29289L18.9769 3.16525C17.8618 2.63254 16.4857 2.82801 15.5621 3.75165L4.95549 14.3582L10.6123 20.0151L21.2189 9.4085C22.1426 8.48486 22.338 7.1088 21.8053 5.99367L22.6777 5.12132C23.0682 4.7308 23.0682 4.09763 22.6777 3.70711L21.2635 2.29289ZM16.9955 10.8035L10.6123 17.1867L7.78392 14.3582L14.1671 7.9751L16.9955 10.8035ZM18.8138 8.98525L19.8047 7.99429C20.1953 7.60376 20.1953 6.9706 19.8047 6.58007L18.3905 5.16586C18 4.77534 17.3668 4.77534 16.9763 5.16586L15.9853 6.15683L18.8138 8.98525Z"
                fill="currentColor"
              />
              <path
                d="M2 22.9502L4.12171 15.1717L9.77817 20.8289L2 22.9502Z"
                fill="currentColor"
              />
            </svg>
            <p>Update</p>
          </div>
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
