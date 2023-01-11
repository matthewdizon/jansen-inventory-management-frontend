import { useState, useEffect } from "react";

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
    amount: "",
  });
  const [collectionDate, setCollectionDate] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

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
      setMessage("Successfully added part");
      setShowMessage(true);

      setName("");
      setTransactionDate(new Date().toISOString().substring(0, 10));
      setItems([{ part: "", quantity: "", price: "" }]);
      setInitialPayment({
        method: "Cash",
        amount: "",
      });
      setCollectionDate("");
    } else {
      // Set error message
      setMessage("Error: Invalid email or password");
      setShowMessage(true);
    }
  };

  console.log(items);

  return (
    <>
      <form className="grid gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="customer name"
          className="px-4 py-2 rounded-xl"
        />
        <label>date of transaction</label>
        <input
          type="date"
          onChange={(e) => setTransactionDate(e.target.value)}
          value={transactionDate}
          className="px-4 py-2 rounded-xl"
        />
        <label>initial payment</label>
        <div>
          <select
            onChange={(e) =>
              setInitialPayment({ ...initialPayment, method: e.target.value })
            }
          >
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
          </select>
          <input
            type="number"
            onChange={(e) =>
              setInitialPayment({ ...initialPayment, amount: e.target.value })
            }
            value={initialPayment.amount}
            placeholder="amount"
            className="px-4 py-2 rounded-xl"
          />
        </div>
        <label>collection date</label>
        <input
          type="date"
          onChange={(e) => setCollectionDate(e.target.value)}
          value={collectionDate}
          className="px-4 py-2 rounded-xl"
        />
        <label>items</label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            {/* <Autocomplete
            getItemValue={(item) => item.name}
            items={itemOptions}
            renderItem={(item, isHighlighted) => (
              <div
                key={item.name}
                style={{ background: isHighlighted ? "lightgray" : "white" }}
              >
                {item.name}
              </div>
            )}
            value={item.item}
            onChange={(e) => handleChange(e, index)}
            onSelect={(value, item) => {
              // Update the item field with the selected item
              const newItems = [...items];
              newItems[index].item = item.name;
              setItems(newItems);
            }}
            // onSearch={handleSearch}
          /> */}
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
