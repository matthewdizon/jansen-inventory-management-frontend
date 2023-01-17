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
      <form className="bg-white p-16" onSubmit={handleSubmit}>
        <p onClick={() => setIsOpen(false)}>CLOSE ME</p>
        <p>HELLO</p>
        <select onChange={(e) => setMethod(e.target.value)} value={method}>
          <option value="Cash">Cash</option>
          <option value="Check">Check</option>
        </select>
        <input
          type="number"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          placeholder="amount"
          className="px-4 py-2 rounded-xl"
        />
        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          className="px-4 py-2 rounded-xl"
        />
        <button
          type="submit"
          className="bg-[#3da9fc] text-[#fffffe] px-4 py-2 rounded-lg hover:shadow-lg uppercase"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}

export default AddNewPayment;
