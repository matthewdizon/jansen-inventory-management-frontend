import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";

function PartSlug() {
  const [data, setData] = useState(null);

  const router = useRouter();
  const { slug } = router.query;
  const { type } = router.query;

  useEffect(() => {
    async function fetchData() {
      // Make sure slug is defined before using it
      if (slug) {
        // Retrieve the JWT from local storage
        const jwt = localStorage.getItem("accessToken");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/transactions/${type}/` +
            slug,
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
  }, [slug, type]);

  console.log(router.query);
  console.log(data);

  return (
    <Layout>
      <p>{slug}</p>
    </Layout>
  );
}

export default PartSlug;
