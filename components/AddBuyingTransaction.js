import { useState, useEffect } from "react";

export default function AddBuyingTransactionForm() {
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [items, setItems] = useState([
    { part: "", quantity: "", price: "", supplier: "" },
  ]);
  const [allItems, setAllItems] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { part: "", quantity: "", price: "", supplier: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSearch = (e) => {
    console.log("e", e);
    const value = e.target.value;
    console.log("value", value);
    // Filter the list of all items based on the text entered by the user
    const itemOptions = allItems.filter((item) =>
      item?.name?.toLowerCase()?.includes(value.toLowerCase())
    );
    setItemOptions(itemOptions);
  };

  useEffect(() => {
    async function fetchData() {
      // Retrieve the JWT from local storage
      const jwt = localStorage.getItem("accessToken");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/parts`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      try {
        const data = await res.json();
        setAllItems(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  console.log("HERE YOU GO", allItems);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jwt = localStorage.getItem("accessToken");

    const buyingTransactionDetails = {
      date: transactionDate,
      items: items,
      deliveryFee: deliveryFee,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/transactions/buying`,
      {
        method: "POST",
        body: JSON.stringify(buyingTransactionDetails),
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

      setTransactionDate(new Date().toISOString().substring(0, 10));
      setItems([{ part: "", quantity: "", price: "", supplier: "" }]);
      setDeliveryFee(0);
    } else {
      // Set error message
      setMessage("Error: Invalid email or password");
      setShowMessage(true);
    }
  };

  return (
    <>
      <form className="grid gap-2" onSubmit={handleSubmit}>
        <label>date of transaction</label>
        <input
          type="date"
          onChange={(e) => setTransactionDate(e.target.value)}
          value={transactionDate}
          className="px-4 py-2 rounded-xl"
        />
        <input
          type="number"
          name="delivery fee"
          className="px-4 py-2 rounded-xl"
          placeholder="delivery fee"
          // value={item.quantity}
          onChange={(e) => setDeliveryFee(e.target.value)}
        />
        <label>items</label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              list="item-options"
              name="part"
              className="px-4 py-2 rounded-xl"
              placeholder="item name"
              value={item.part}
              onChange={(e) => handleChange(e, index)}
              onInput={handleSearch}
            />
            <datalist id="item-options">
              {itemOptions.map((item) => (
                <option key={item.name} value={item.name} label={item.name} />
              ))}
            </datalist>
            <input
              type="number"
              name="quantity"
              className="px-4 py-2 rounded-xl"
              placeholder="quantity"
              value={item.quantity}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              type="number"
              name="price"
              className="px-4 py-2 rounded-xl"
              placeholder="price"
              value={item.price}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              type="text"
              name="supplier"
              className="px-4 py-2 rounded-xl"
              placeholder="supplier"
              value={item.supplier}
              onChange={(e) => handleChange(e, index)}
            />
            {items.length > 1 && (
              <button type="button" onClick={() => handleRemoveItem(index)}>
                -
              </button>
            )}
            {index === items.length - 1 && (
              <button type="button" onClick={handleAddItem}>
                +
              </button>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-[#3da9fc] text-[#fffffe] px-4 py-2 rounded-lg hover:shadow-lg uppercase"
        >
          Submit
        </button>
      </form>
      {showMessage && (
        <div className="bg-blue-500 text-white p-4 rounded-xl">{message}</div>
      )}
    </>
  );
}
