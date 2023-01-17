import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import generateSellingPDF from "../../utils/generateSellingPDF";
import AddNewPayment from "../../components/AddNewPayment";

function PartSlug() {
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const SellingData = () => {
    const { collectionDate, customer, date, items, payments, total } = data;
    const totalPayments = payments
      .map((payment) => payment.amount)
      .reduce((sum, price) => sum + price, 0);
    return (
      <div className="grid gap-4 bg-gray-100 rounded-xl p-8 relative">
        <div
          className="absolute right-4 top-4 bg-white text-gray-600 p-4 rounded-md hover:cursor-pointer"
          onClick={() => generateSellingPDF(data)}
        >
          Download PDF
        </div>
        <div className="grid grid-cols-2 bg-gray-200 -m-8 p-8 rounded-t-xl">
          <div>
            <p className="grid">
              <span className="text-xs font-thin uppercase">
                (Date of Transaction)
              </span>{" "}
              {Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(date))}{" "}
            </p>
            <p className="font-bold text-4xl">{customer}</p>
          </div>
          <div>
            <p className="grid">
              <span className="text-xs font-thin uppercase">
                (Agreed Collection Date)
              </span>{" "}
              {Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(collectionDate))}{" "}
            </p>
            <p className="font-bold text-4xl">₱{total}</p>
          </div>
        </div>
        <p className="font-bold text-xl pt-8">Items Sold</p>
        <div className="pb-8">
          <div className="grid grid-cols-4 font-semibold">
            <p>Part</p>
            <p>Quantity</p>
            <p>Price</p>
            <p>Subtotal</p>
          </div>
          {items.map((item, index) => {
            return (
              <div key={index} className="grid grid-cols-4">
                <p>{item.part}</p>
                <p>{item.quantity} pcs</p>
                <p>₱{item.price} each</p>
                <p>₱{item.price * item.quantity}</p>
              </div>
            );
          })}
        </div>
        <div className="bg-gray-200 -m-8 p-8 rounded-b-xl grid grid-cols-2">
          <div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-xl">Payments Made</p>
              <div
                className="bg-white text-gray-600 rounded-md hover:cursor-pointer max-w-max p-2 px-4"
                onClick={() => setIsOpen(!isOpen)}
              >
                Add New Payment
              </div>
              {isOpen && (
                <AddNewPayment
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  id={slug}
                />
              )}
            </div>
            {payments.map((payment, index) => {
              return (
                <div key={index}>
                  <p>
                    (
                    {Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(payment.date))}
                    )
                  </p>
                  <p>
                    ₱{payment.amount} payment made through {payment.method}
                  </p>
                </div>
              );
            })}
          </div>
          <div>
            <span className="text-xs font-thin uppercase">(Charge)</span>{" "}
            <p className="font-bold text-4xl">₱{total - totalPayments}</p>
          </div>
        </div>
      </div>
    );
  };

  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <Layout>
      <p className="mb-8">Invoice: {slug}</p>
      {type === "selling" ? <SellingData /> : <div>buying</div>}
    </Layout>
  );
}

export default PartSlug;
