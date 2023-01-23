import { useState } from "react";

function AddNewPayment({ isOpen, setIsOpen, id }) {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("Cash");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jwt = localStorage.getItem("accessToken");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/transactions/selling/` +
        id,
      {
        method: "PATCH",
        body: JSON.stringify({ amount, method, date }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    console.log("called", res, id);

    if (res.ok) {
      setAmount(0);
      setMethod("Cash");
      setDate(new Date().toISOString().substring(0, 10));
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? "visible" : "hidden"
      }`}
      style={{ background: "rgba(50, 50, 50, 0.8)" }}
    >
      <form
        className="bg-white p-16 rounded-2xl relative"
        onSubmit={handleSubmit}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 hover:cursor-pointer"
        >
          <path
            d="M16.3394 9.32245C16.7434 8.94589 16.7657 8.31312 16.3891 7.90911C16.0126 7.50509 15.3798 7.48283 14.9758 7.85938L12.0497 10.5866L9.32245 7.66048C8.94589 7.25647 8.31312 7.23421 7.90911 7.61076C7.50509 7.98731 7.48283 8.62008 7.85938 9.0241L10.5866 11.9502L7.66048 14.6775C7.25647 15.054 7.23421 15.6868 7.61076 16.0908C7.98731 16.4948 8.62008 16.5171 9.0241 16.1405L11.9502 13.4133L14.6775 16.3394C15.054 16.7434 15.6868 16.7657 16.0908 16.3891C16.4948 16.0126 16.5171 15.3798 16.1405 14.9758L13.4133 12.0497L16.3394 9.32245Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
            fill="currentColor"
          />
        </svg>
        <p className="font-bold text-xl">Add New Payment</p>
        <div className="grid gap-8 py-8">
          <div className="grid grid-cols-2">
            <p>Payment Method</p>
            <select
              onChange={(e) => setMethod(e.target.value)}
              value={method}
              className="p-4 rounded-lg select-p-4"
            >
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
            </select>
          </div>
          <div className="grid grid-cols-2">
            <p>Amount</p>
            <input
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              placeholder="amount"
              className="px-4 py-2 rounded-xl border-2 border-gray-200"
            />
          </div>
          <div className="grid grid-cols-2">
            <p>Date</p>
            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
              className="px-4 py-2 rounded-xl border-2 border-gray-200"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#3da9fc] text-[#fffffe] px-4 py-2 rounded-lg hover:shadow-lg uppercase"
          >
            Submit Payment
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNewPayment;
