import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";

export default function AddSellingTransactionForm() {
  const [name, setName] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [items, setItems] = useState([{ part: "", quantity: "", price: "" }]);
  const [allItems, setAllItems] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [initialPayment, setInitialPayment] = useState({
    method: "Cash",
    amount: 0,
  });
  const [collectionDate, setCollectionDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const { user } = useContext(UserContext);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { part: "", quantity: "", price: "" }]);
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

    const sellingTransactionDetails = {
      customer: name,
      date: transactionDate,
      items: items,
      collectionDate: collectionDate,
      initialPayment: { ...initialPayment, date: transactionDate },
      user: user.email,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/transactions/selling`,
      {
        method: "POST",
        body: JSON.stringify(sellingTransactionDetails),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (res.ok) {
      // Set success message
      setMessage("Successfully added Selling Transaction");
      setShowMessage(true);

      setName("");
      setTransactionDate(new Date().toISOString().substring(0, 10));
      setItems([{ part: "", quantity: "", price: "" }]);
      setInitialPayment({
        method: "Cash",
        amount: 0,
      });
      setCollectionDate(new Date().toISOString().substring(0, 10));
    } else {
      const json = await res.json();
      // Set error message
      setMessage(`Error: ${json.error}`);
      setShowMessage(true);
    }
  };

  console.log(items);

  return (
    <div className="bg-white rounded-xl p-8 px-12">
      <p className="font-bold text-lg">Add New Selling Transaction</p>
      <form className="grid gap-2" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 items-center">
          <p>Customer Name</p>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name"
            className="px-4 py-2 rounded-xl border-2 border-gray-200"
            required
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <p>Date of Transaction</p>
          <input
            type="date"
            onChange={(e) => setTransactionDate(e.target.value)}
            value={transactionDate}
            className="px-4 py-2 rounded-xl border-2 border-gray-200"
            required
          />
        </div>
        <div className="grid grid-cols-2 items-center">
          <label>Initial Payment</label>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-thin">Payment Method</p>
              <select
                onChange={(e) =>
                  setInitialPayment({
                    ...initialPayment,
                    method: e.target.value,
                  })
                }
                className="h-full rounded-lg w-full px-4"
              >
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
              </select>
            </div>
            <div>
              <p className="text-xs font-thin">Amount</p>
              <input
                type="number"
                onChange={(e) =>
                  setInitialPayment({
                    ...initialPayment,
                    amount: e.target.value,
                  })
                }
                value={initialPayment.amount}
                placeholder="amount"
                className="px-4 w-full h-full rounded-xl border-2 border-gray-200"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center mt-6">
          <label>Collection Date</label>
          <input
            type="date"
            onChange={(e) => setCollectionDate(e.target.value)}
            value={collectionDate}
            className="px-4 py-2 rounded-xl border-2 border-gray-200"
            required
          />
        </div>
        <div className="grid grid-cols-2">
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
                className="grid grid-cols-3 gap-2 relative items-center"
              >
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
                        {item.name} ({item.supplier}) - {item.quantity} pcs
                      </option>
                    );
                  })}
                </select>
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
