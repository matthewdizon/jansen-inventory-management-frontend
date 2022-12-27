import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

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

  return (
    <div className="bg-gray-400 h-screen text-center flex justify-center items-center">
      <h1 className="text-4xl font-bold">Inventory Management System</h1>
      <div>
        {data?.map((part, index) => {
          console.log(part);
          return <div key={index}>{part.name}</div>;
        })}
      </div>
    </div>
  );
}
