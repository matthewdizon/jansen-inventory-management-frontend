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
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 relative">
            {data?.map((part, index) => {
              return (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {part.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {part.quantity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {part.supplier}
                  </td>
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

                                <Link
                                  href={`/parts/${part._id}`}
                                  className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                  role="menuitem"
                                >
                                  View Part
                                </Link>
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
