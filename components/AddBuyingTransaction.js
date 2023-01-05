import { useState } from "react";

export default function AddBuyingTransactionForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const jwt = localStorage.getItem("accessToken");

    const partDetails = {
      name,
      quantity,
      supplier,
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

  const [items, setItems] = useState([{ item: "", quantity: "", price: "" }]);
  console.log("ITEMS", items);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { item: "", quantity: "", price: "" }]);
  };

  return (
    <form>
      {items.map((item, index) => (
        <div key={index}>
          <select
            name="item"
            value={item.item}
            onChange={(e) => handleChange(e, index)}
          >
            <option value="">Select an item</option>
            {/* Add options for the select element */}
          </select>
          <input
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={(e) => handleChange(e, index)}
          />
          <input
            type="number"
            name="price"
            value={item.price}
            onChange={(e) => handleChange(e, index)}
          />
          {index === items.length - 1 && (
            <button type="button" onClick={handleAddItem}>
              +
            </button>
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}
