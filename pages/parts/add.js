import { useState } from "react";
import Layout from "../../components/layout";

export default function AddPart() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [quantityThreshold, setQuantityThreshold] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jwt = localStorage.getItem("accessToken");

    const partDetails = {
      name,
      quantity,
      supplier,
      quantityThreshold,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/parts`,
      {
        method: "POST",
        body: JSON.stringify(partDetails),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (res.ok) {
      // Set success message
      setMessage("Successfully added part");
      setShowMessage(true);

      setName("");
      setQuantity("");
      setSupplier("");
    } else {
      // Set error message
      setMessage("Error: Invalid email or password");
      setShowMessage(true);
    }
  };

  return (
    <Layout>
      <p>Add Part</p>
      <form onSubmit={handleSubmit} className="grid gap-2 my-8">
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="name"
          className="px-4 py-2 rounded-xl"
        />
        <div className="flex gap-4">
          <input
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            placeholder="quantity"
            className="px-4 py-2 rounded-xl"
          />
          <input
            type="number"
            onChange={(e) => setQuantityThreshold(e.target.value)}
            value={quantityThreshold}
            placeholder="quantity threshold"
            className="px-4 py-2 rounded-xl"
          />
        </div>
        <input
          type="text"
          onChange={(e) => setSupplier(e.target.value)}
          value={supplier}
          placeholder="supplier"
          className="px-4 py-2 rounded-xl"
        />
        <button className="bg-[#3da9fc] text-[#fffffe] px-4 py-2 rounded-lg hover:shadow-lg uppercase">
          Add Part
        </button>
      </form>
      {showMessage && (
        <div className="bg-blue-500 text-white p-4 rounded-xl">{message}</div>
      )}
    </Layout>
  );
}
