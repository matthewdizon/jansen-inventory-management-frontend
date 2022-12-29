import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import Layout from "../components/layout";

export default function Home() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Retrieve the JWT from local storage
      const jwt = localStorage.getItem("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/parts`,
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

    async function getUser() {
      const jwt = localStorage.getItem("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/users/user`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      try {
        const data = await res.json();
        if (!data.error) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    Router.push("/login");
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold text-[#094067]">
        Inventory Management System
      </h1>
      <div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="bg-gray-100 px-4 py-2 text-left">
                <label className="sr-only" for="SelectAll">
                  Select All
                </label>

                <input
                  className="h-5 w-5 rounded border-gray-200"
                  type="checkbox"
                  id="SelectAll"
                />
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Name
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Quantity
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Supplier
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Price (₱)
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
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
                    d="M7 3C8.86384 3 10.4299 4.27477 10.874 6H19V8H10.874C10.4299 9.72523 8.86384 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3ZM7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17 20C15.1362 20 13.5701 18.7252 13.126 17H5V15H13.126C13.5701 13.2748 15.1362 12 17 12C19.2091 12 21 13.7909 21 16C21 18.2091 19.2091 20 17 20ZM17 18C18.1046 18 19 17.1046 19 16C19 14.8954 18.1046 14 17 14C15.8954 14 15 14.8954 15 16C15 17.1046 15.8954 18 17 18Z"
                    fill="currentColor"
                  />
                </svg>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data?.map((part, index) => {
              console.log(part);
              return (
                <tr key={index}>
                  <td className="bg-white px-4 py-2">
                    <label className="sr-only" for="Row1">
                      Row 1
                    </label>

                    <input
                      className="h-5 w-5 rounded border-gray-200"
                      type="checkbox"
                      id="Row1"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {part.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {part.quantity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <Link
                      href={`/suppliers/${part.supplier[0]?._id}`}
                      className="hover:underline"
                    >
                      {part.supplier[0]?.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {part.price}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="hover:cursor-pointer"
                    >
                      <path
                        d="M14 6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6Z"
                        fill="currentColor"
                      />
                      <path
                        d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                        fill="currentColor"
                      />
                      <path
                        d="M14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18Z"
                        fill="currentColor"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {user && <div>Welcome, {user.email}!</div>}
      {data ? (
        <button
          onClick={() => logout()}
          className="bg-[#3da9fc] text-[#fffffe] px-4 py-2 rounded-lg hover:shadow-lg uppercase"
        >
          Logout
        </button>
      ) : (
        <Link href={"/login"}>Login</Link>
      )}
    </Layout>
  );
}
