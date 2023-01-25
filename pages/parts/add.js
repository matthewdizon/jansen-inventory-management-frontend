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
      <div className="bg-white rounded-xl p-8 px-12">
        <p className="font-bold text-lg">Add New Part</p>
        <form onSubmit={handleSubmit} className="grid gap-2 my-8">
          <div className="grid grid-cols-2 items-center">
            <label>Part Name</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Name"
              className="px-4 py-2 rounded-xl border-2 border-gray-200"
            />
          </div>
          <div className="grid grid-cols-2 items-center">
            <label>Quantity</label>
            <input
              type="number"
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
              placeholder="quantity"
              className="px-4 py-2 rounded-xl border-2 border-gray-200"
            />
          </div>
          <div className="grid grid-cols-2 items-center">
            <label>Quantity Threshold</label>
            <input
              type="number"
              onChange={(e) => setQuantityThreshold(e.target.value)}
              value={quantityThreshold}
              placeholder="quantity threshold"
              className="px-4 py-2 rounded-xl border-2 border-gray-200"
            />
          </div>
          <div className="grid grid-cols-2 items-center">
            <label>Supplier Name</label>
            <input
              type="text"
              onChange={(e) => setSupplier(e.target.value)}
              value={supplier}
              placeholder="supplier"
              className="px-4 py-2 rounded-xl border-2 border-gray-200"
            />
          </div>
          <div className="flex gap-4"></div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#3da9fc] text-[#fffffe] px-8 py-2 rounded-lg hover:shadow-lg uppercase max-w-max"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {showMessage && (
        <div className="bg-blue-500 text-white p-4 rounded-xl my-4">
          {message}
        </div>
      )}
    </Layout>
  );
}
