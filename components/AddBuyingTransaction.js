import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";

export default function AddBuyingTransactionForm() {
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [items, setItems] = useState([
    { isNew: false, part: "", quantity: "", price: "", supplier: "" },
  ]);
  const [allItems, setAllItems] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const { user } = useContext(UserContext);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    console.log(index, name, value);
    if (name === "isNew") {
      var isTrue = value === "false";
      const newItems = [...items];
      newItems[index][name] = isTrue;
      setItems(newItems);
    } else {
      const newItems = [...items];
      newItems[index][name] = value;
      setItems(newItems);
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { isNew: false, part: "", quantity: "", price: "", supplier: "" },
    ]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jwt = localStorage.getItem("accessToken");

    const buyingTransactionDetails = {
      date: transactionDate,
      items: items,
      deliveryFee: deliveryFee,
      user: user.email,
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
      setMessage("Successfully added Buying Transaction");
      setShowMessage(true);

      setTransactionDate(new Date().toISOString().substring(0, 10));
      setItems([
        { isNew: false, part: "", quantity: "", price: "", supplier: "" },
      ]);
      setDeliveryFee(0);
    } else {
      // Set error message
      setMessage("Error: Invalid email or password");
      setShowMessage(true);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 px-12">
      <p className="font-bold text-lg">Add New Buying Transaction</p>
      <form className="grid gap-2" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 items-center">
          <label>date of transaction</label>
          <input
            type="date"
            onChange={(e) => setTransactionDate(e.target.value)}
            value={transactionDate}
            className="px-4 py-2 rounded-xl border-2 border-gray-200"
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <p>Delivery Fee</p>
          <input
            type="number"
            name="delivery fee"
            className="px-4 py-2 rounded-xl border-2 border-gray-200"
            placeholder="delivery fee"
            onChange={(e) => setDeliveryFee(e.target.value)}
          />
        </div>
        <div className="grid gap-4">
          <div className="flex gap-4 items-center">
            <label>Items</label>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-gray-200 rounded-xl p-2 px-6"
            >
              Add Another Item
            </button>
          </div>
          <div className="grid gap-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-2 relative items-center"
              >
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    name="isNew"
                    onChange={(e) => handleChange(e, index)}
                    value={item.isNew}
                    checked={item.isNew}
                  />
                  <p>New Item</p>
                </div>
                {item.isNew ? (
                  <input
                    name="part"
                    className="px-4 py-2 rounded-xl border-2 border-gray-200"
                    placeholder="item name"
                    value={item.part}
                    onChange={(e) => handleChange(e, index)}
                  />
                ) : (
                  <select
                    className="h-full rounded-lg p-4"
                    value={item.part}
                    name="part"
                    onChange={(e) => handleChange(e, index)}
                    required
                  >
                    <option value="">Select Part</option>
                    {allItems.map((item, index) => {
                      return (
                        <option value={item._id} key={index}>
                          {item.name} ({item.supplier})
                        </option>
                      );
                    })}
                  </select>
                )}
                <input
                  type="number"
                  name="quantity"
                  className="px-4 py-2 rounded-xl border-2 border-gray-200"
                  placeholder="quantity"
                  value={item.quantity}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                <input
                  type="number"
                  name="price"
                  className="px-4 py-2 rounded-xl border-2 border-gray-200"
                  placeholder="price"
                  value={item.price}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                {item.isNew && (
                  <input
                    name="supplier"
                    className="px-4 py-2 rounded-xl border-2 border-gray-200"
                    placeholder="supplier"
                    value={item.supplier}
                    onChange={(e) => handleChange(e, index)}
                  />
                )}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="absolute -right-4"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#3da9fc] text-[#fffffe] px-8 py-2 rounded-lg hover:shadow-lg uppercase max-w-max"
          >
            Submit
          </button>
        </div>
      </form>
      {showMessage && (
        <div className="bg-blue-500 text-white p-4 rounded-xl my-4">
          {message}
        </div>
      )}
    </div>
  );
}
