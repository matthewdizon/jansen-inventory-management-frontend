import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";

function PDF() {
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { slug } = router.query;
  const { type } = router.query;
  console.log(router.query);

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

  const SellingData = () => {
    const { collectionDate, customer, date, items, payments, total, user } =
      data;
    const totalPayments = payments
      .map((payment) => payment.amount)
      .reduce((sum, price) => sum + price, 0);
    return (
      <div className="grid bg-white rounded-xl relative divide-y-2 p-8 px-16">
        <div className="flex justify-between rounded-t-xl py-8">
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
          <div className="text-right">
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
        <div className="flex justify-between py-8">
          <div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-xl">Payments Made</p>
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
          <div className="text-right">
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
    const { date, items, total, user } = data;
    return (
      <div className="grid bg-white rounded-xl relative divide-y-2 p-8 px-16">
        <div className="flex justify-between rounded-t-xl py-8">
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
          <div className="text-right">
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

  if (!data) {
    return (
      <Layout>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin"
        >
          <path
            opacity="0.2"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            fill="currentColor"
          />
          <path
            d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
            fill="currentColor"
          />
        </svg>
      </Layout>
    );
  }

  return (
    <div className="p-4 bg-[#d8eefe] !h-screen">
      {type === "selling" ? <SellingData /> : <BuyingData />}
    </div>
  );
}

export default PDF;
