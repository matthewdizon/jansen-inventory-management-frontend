import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import Link from "next/link";

function Parts() {
  const [data, setData] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  const toggleMenu = (index) => {
    if (showMenu === index) {
      setShowMenu(null);
    } else {
      setShowMenu(index);
    }
  };

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

    fetchData();
  }, []);

  const deletePart = async (id) => {
    const jwt = localStorage.getItem("accessToken");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/parts/` + id,
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

  return (
    <Layout>
      <div className="flex items-center justify-between pb-4">
        <h1 className="font-bold text-[#094067]">Parts</h1>
        <Link
          href={"/parts/add"}
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
      <div className="rounded-xl border border-gray-200 shadow-lg w-full bg-[#fffffe]">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="bg-gray-100 px-4 py-2 text-left">
                <label className="sr-only" for="SelectAll">
                  Select All
                </label>

                <input
                  className="h-4 w-4 rounded border-gray-200 hover:cursor-pointer"
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
              {/* <th className="whitespace-nowrap px-4 py-2 text-left text-gray-900">
                Price (₱)
              </th> */}
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

          <tbody className="divide-y divide-gray-200 relative">
            {data?.map((part, index) => {
              return (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <label className="sr-only" for="Row1">
                      Row 1
                    </label>

                    <input
                      className="h-4 w-4 rounded border-gray-200 hover:cursor-pointer"
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
                    {part.supplier}
                  </td>
                  {/* <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {part.price}
                  </td> */}
                  <td className="whitespace-nowrap px-4 py-2 text-gray-400">
                    <div className="inline-flex items-stretch rounded-md border bg-white">
                      <div className="relative">
                        <button
                          type="button"
                          className="inline-flex h-full items-center justify-center rounded-r-md border-l border-gray-100 px-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                          onClick={() => toggleMenu(index)}
                        >
                          <span className="sr-only">Menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>

                        <div
                          class={`${
                            showMenu === index ? "block" : "hidden"
                          } absolute right-0 z-10 mt-4 w-56 origin-top-right rounded-md border border-gray-100 bg-white shadow-lg`}
                          role="menu"
                        >
                          <div className="flow-root py-2">
                            <div className="-my-2 divide-y divide-gray-100">
                              <div className="p-2">
                                <strong className="block p-2 text-xs font-medium uppercase text-gray-400">
                                  General
                                </strong>

                                <a
                                  href="#"
                                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                  role="menuitem"
                                >
                                  View on Storefront
                                </a>

                                <a
                                  href="#"
                                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                  role="menuitem"
                                >
                                  View Warehouse Info
                                </a>

                                <a
                                  href="#"
                                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                  role="menuitem"
                                >
                                  Duplicate Product
                                </a>

                                <a
                                  href="#"
                                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                  role="menuitem"
                                >
                                  Unpublish Product
                                </a>
                              </div>

                              <div className="p-2">
                                <strong className="block p-2 text-xs font-medium uppercase text-gray-400">
                                  Danger Zone
                                </strong>

                                <div>
                                  <button
                                    type="submit"
                                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                    role="menuitem"
                                    onClick={() => deletePart(part._id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      stroke-width="2"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                    Delete Product
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Parts;
