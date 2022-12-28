import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";

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
        setUser(data);
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

  console.log(user);

  return (
    <div className="bg-gray-400 h-screen text-center flex flex-col gap-4 justify-center items-center">
      <h1 className="text-4xl font-bold">Inventory Management System</h1>
      <div>
        {data?.map((part, index) => {
          console.log(part);
          return <div key={index}>{part.name}</div>;
        })}
      </div>
      {user && <div>Welcome, {user.email}!</div>}
      {data ? (
        <button onClick={() => logout()}>Logout</button>
      ) : (
        <Link href={"/login"}>Login</Link>
      )}
    </div>
  );
}
