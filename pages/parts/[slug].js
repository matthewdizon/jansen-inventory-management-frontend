import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";

function PartSlug() {
  const [data, setData] = useState(null);

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

  console.log(router.query);
  console.log(data);

  if (!data) return <div>Loading</div>;

  const { quantity, quantityThreshold, name, supplier } = data;

  return (
    <Layout>
      <p className="mb-8">Part ID: {slug}</p>
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
          <p className="text-sm font-medium mx-auto">Name</p>
          <p className="text-5xl font-extrabold mx-auto">{name}</p>
        </div>
        <div className="bg-gray-100 rounded-2xl p-8 grid items-center justify-center">
          <p className="text-sm font-medium mx-auto">Supplier</p>
          <p className="text-5xl font-extrabold mx-auto">{supplier[0]}</p>
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
    </Layout>
  );
}

export default PartSlug;
