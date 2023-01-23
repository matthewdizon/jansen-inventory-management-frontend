import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import generateSellingPDF from "../../utils/generateSellingPDF";
import AddNewPayment from "../../components/AddNewPayment";
import Link from "next/link";
import useSWR from "swr";

function PartSlug() {
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { slug } = router.query;
  const { type } = router.query;

  let jwt;
  if (typeof window !== "undefined") {
    jwt = localStorage.getItem("accessToken");
  }

  const { data: swrData, error } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/transactions/${type}/` +
      slug,
    (url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }).then((response) => response.json()),
    {
      refreshInterval: 1000,
    }
  );

  console.log("swrswrswr", swrData);

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
    const { collectionDate, customer, date, items, payments, total, user } =
      swrData;
    const totalPayments = payments
      .map((payment) => payment.amount)
      .reduce((sum, price) => sum + price, 0);
    return (
      <div className="grid bg-white rounded-xl relative divide-y-2 p-8 px-16">
        <div className="grid grid-cols-2 rounded-t-xl py-8">
          <Link
            className="absolute right-4 top-4 bg-gray-200 text-gray-600 p-4 rounded-md hover:cursor-pointer"
            href={`/transactions/pdf?slug=${slug}&type=${type}`}
            target="_blank"
          >
            Download PDF
          </Link>
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
        <div className="py-8">
          <p className="font-bold text-xl">Items Sold</p>
          <div className="grid grid-cols-4 font-semibold">
            <p>Part</p>
            <p>Quantity</p>
            <p>Price</p>
            <p>Subtotal</p>
          </div>
          {items.map((item, index) => {
            console.log(item);
            return (
              <div key={index} className="grid grid-cols-4">
                <p>
                  {item.part.name} ({item.part.supplier})
                </p>
                <p>{item.quantity} pcs</p>
                <p>₱{item.price} each</p>
                <p>₱{item.price * item.quantity}</p>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-2 py-8">
          <div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-xl">Payments Made</p>
              <div
                className="bg-gray-200 text-gray-600 rounded-md hover:cursor-pointer max-w-max p-2 px-4"
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
                    <span className="font-extrabold text-lg">
                      ₱{payment.amount}
                    </span>{" "}
                    payment made through {payment.method}
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
        <div className="py-8 flex justify-between">
          <div>
            <span className="text-xs font-thin uppercase">
              (Invoice Number)
            </span>{" "}
            <p className="font-bold">{slug}</p>
          </div>
          <div>
            <span className="text-xs font-thin uppercase">
              (Transaction Owner)
            </span>{" "}
            <p className="font-bold">{user}</p>
          </div>
        </div>
      </div>
    );
  };

  const BuyingData = () => {
    const { date, items, total, user, deliveryFee } = swrData;

    return (
      <div className="grid bg-white rounded-xl relative divide-y-2 p-8 px-16">
        <div className="grid grid-cols-2 rounded-t-xl py-8">
          <Link
            className="absolute right-4 top-4 bg-gray-200 text-gray-600 p-4 rounded-md hover:cursor-pointer"
            href={`/transactions/pdf?slug=${slug}&type=${type}`}
            target="_blank"
          >
            Download PDF
          </Link>
          <div>
            <p className="grid">
              <span className="text-xs font-thin uppercase">
                (Date of Transaction)
              </span>
            </p>
            <p className="font-bold text-4xl">
              {Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(date))}{" "}
            </p>
          </div>
          <div>
            <p className="grid">
              <span className="text-xs font-thin uppercase">
                (Total Payment Made)
              </span>
            </p>
            <p className="font-bold text-4xl">₱{total}</p>
          </div>
        </div>
        <div className="py-8">
          <p className="font-bold text-xl">Items Sold</p>
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
        <div className="py-8 flex justify-between">
          <div>
            <span className="text-xs font-thin uppercase">
              (Invoice Number)
            </span>{" "}
            <p className="font-bold">{slug}</p>
          </div>
          <div>
            <span className="text-xs font-thin uppercase">
              (Transaction Owner)
            </span>{" "}
            <p className="font-bold">{user}</p>
          </div>
        </div>
      </div>
    );
  };

  if (!swrData) {
    return <div>Loading</div>;
  }

  return (
    <Layout>
      <p className="mb-8">Invoice: {slug}</p>
      {type === "selling" ? <SellingData /> : <BuyingData />}
    </Layout>
  );
}

export default PartSlug;
