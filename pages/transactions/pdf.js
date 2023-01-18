import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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
      <div className="grid gap-4 bg-gray-100 rounded-xl px-8 relative">
        <div className="grid grid-cols-2 bg-gray-200 -mx-8 p-8 rounded-t-xl">
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
        <p className="font-bold text-xl">Items Sold</p>
        <div>
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
        <div className="bg-gray-200 -mx-8 p-8 grid grid-cols-2">
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
        <div className="pb-8 flex justify-between">
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
    return <div>Loading</div>;
  }

  return (
    <div className="p-4">
      {type === "selling" ? <SellingData /> : <div>buying</div>}
    </div>
  );
}

export default PDF;
