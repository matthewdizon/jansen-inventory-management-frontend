import { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";

function SideNav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    Router.push("/login");
  };

  return (
    <div className="w-[20vw] p-8 flex flex-col justify-between text-[#5f6c7b]">
      <h1 className="font-bold uppercase text-3xl text-[#094067]">Autobest</h1>
      <div>
        <ul className="grid gap-4 font-semibold">
          <Link
            href={"/"}
            className="flex gap-2 hover:cursor-pointer max-w-max hover:text-[#094067]"
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
                d="M6 22.8787C4.34315 22.8787 3 21.5355 3 19.8787V9.87866C3 9.84477 3.00169 9.81126 3.00498 9.77823H3C3 9.20227 3.2288 8.64989 3.63607 8.24262L9.87868 2.00002C11.0502 0.828445 12.9497 0.828445 14.1213 2.00002L20.3639 8.24264C20.7712 8.6499 21 9.20227 21 9.77823H20.995C20.9983 9.81126 21 9.84477 21 9.87866V19.8787C21 21.5355 19.6569 22.8787 18 22.8787H6ZM12.7071 3.41423L19 9.70713V19.8787C19 20.4309 18.5523 20.8787 18 20.8787H15V15.8787C15 14.2218 13.6569 12.8787 12 12.8787C10.3431 12.8787 9 14.2218 9 15.8787V20.8787H6C5.44772 20.8787 5 20.4309 5 19.8787V9.7072L11.2929 3.41423C11.6834 3.02371 12.3166 3.02371 12.7071 3.41423Z"
                fill="currentColor"
              />
            </svg>
            <p>Home</p>
          </Link>
          <Link
            href={"/parts"}
            className="flex gap-2 hover:cursor-pointer max-w-max hover:text-[#094067]"
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
                d="M17 5.5H20C21.1046 5.5 22 6.39543 22 7.5V19.5C22 20.6046 21.1046 21.5 20 21.5H4C2.89543 21.5 2 20.6046 2 19.5V7.5C2 6.39543 2.89543 5.5 4 5.5H7C7 3.84315 8.34315 2.5 10 2.5H14C15.6569 2.5 17 3.84315 17 5.5ZM14 4.5H10C9.44772 4.5 9 4.94772 9 5.5H15C15 4.94772 14.5523 4.5 14 4.5ZM20 7.5H4V9.5H20V7.5ZM4 19.5V11.5H7V13.5H11V11.5H13V13.5H17V11.5H20V19.5H4Z"
                fill="currentColor"
              />
            </svg>
            <p>Parts</p>
          </Link>
          <Link
            href={"/suppliers"}
            className="flex gap-2 hover:cursor-pointer max-w-max hover:text-[#094067]"
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
                d="M5.79166 2H1V4H4.2184L6.9872 16.6776H7V17H20V16.7519L22.1932 7.09095L22.5308 6H6.6552L6.08485 3.38852L5.79166 2ZM19.9869 8H7.092L8.62081 15H18.3978L19.9869 8Z"
                fill="currentColor"
              />
              <path
                d="M10 22C11.1046 22 12 21.1046 12 20C12 18.8954 11.1046 18 10 18C8.89543 18 8 18.8954 8 20C8 21.1046 8.89543 22 10 22Z"
                fill="currentColor"
              />
              <path
                d="M19 20C19 21.1046 18.1046 22 17 22C15.8954 22 15 21.1046 15 20C15 18.8954 15.8954 18 17 18C18.1046 18 19 18.8954 19 20Z"
                fill="currentColor"
              />
            </svg>
            <p>Suppliers</p>
          </Link>
          <Link
            href={"/transactions"}
            className="flex gap-2 hover:cursor-pointer max-w-max hover:text-[#094067]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 18H17V16H7V18Z" fill="currentColor" />
              <path d="M17 14H7V12H17V14Z" fill="currentColor" />
              <path d="M7 10H11V8H7V10Z" fill="currentColor" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z"
                fill="currentColor"
              />
            </svg>
            <p>Transactions</p>
          </Link>
          <Link
            href={"/users"}
            className="flex gap-2 hover:cursor-pointer max-w-max hover:text-[#094067]"
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
                d="M8 11C10.2091 11 12 9.20914 12 7C12 4.79086 10.2091 3 8 3C5.79086 3 4 4.79086 4 7C4 9.20914 5.79086 11 8 11ZM8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z"
                fill="currentColor"
              />
              <path
                d="M11 14C11.5523 14 12 14.4477 12 15V21H14V15C14 13.3431 12.6569 12 11 12H5C3.34315 12 2 13.3431 2 15V21H4V15C4 14.4477 4.44772 14 5 14H11Z"
                fill="currentColor"
              />
              <path d="M22 11H16V13H22V11Z" fill="currentColor" />
              <path d="M16 15H22V17H16V15Z" fill="currentColor" />
              <path d="M22 7H16V9H22V7Z" fill="currentColor" />
            </svg>
            <p>Users</p>
          </Link>
        </ul>
      </div>
      <div>
        <hr className="py-4" />
        {user ? (
          // <button
          //   onClick={() => logout()}
          //   className="bg-[#3da9fc] text-[#fffffe] px-4 py-2 rounded-lg hover:shadow-lg uppercase"
          // >
          //   Logout
          // </button>
          <div className="flex gap-2 items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hover:cursor-pointer"
              onClick={() => logout()}
            >
              <path
                d="M8.51428 20H4.51428C3.40971 20 2.51428 19.1046 2.51428 18V6C2.51428 4.89543 3.40971 4 4.51428 4H8.51428V6H4.51428V18H8.51428V20Z"
                fill="currentColor"
              />
              <path
                d="M13.8418 17.385L15.262 15.9768L11.3428 12.0242L20.4857 12.0242C21.038 12.0242 21.4857 11.5765 21.4857 11.0242C21.4857 10.4719 21.038 10.0242 20.4857 10.0242L11.3236 10.0242L15.304 6.0774L13.8958 4.6572L7.5049 10.9941L13.8418 17.385Z"
                fill="currentColor"
              />
            </svg>
            <p>Welcome, {user.email}!</p>
          </div>
        ) : (
          <Link href={"/login"} className="flex gap-2 items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hover:cursor-pointer"
            >
              <path
                d="M15.4857 20H19.4857C20.5903 20 21.4857 19.1046 21.4857 18V6C21.4857 4.89543 20.5903 4 19.4857 4H15.4857V6H19.4857V18H15.4857V20Z"
                fill="currentColor"
              />
              <path
                d="M10.1582 17.385L8.73801 15.9768L12.6572 12.0242L3.51428 12.0242C2.96199 12.0242 2.51428 11.5765 2.51428 11.0242C2.51429 10.4719 2.962 10.0242 3.51429 10.0242L12.6765 10.0242L8.69599 6.0774L10.1042 4.6572L16.4951 10.9941L10.1582 17.385Z"
                fill="currentColor"
              />
            </svg>
            <p>Login</p>
          </Link>
        )}
      </div>
    </div>
  );
}

export default SideNav;
