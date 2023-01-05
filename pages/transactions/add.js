import { useState } from "react";
import Layout from "../../components/layout";
import AddSellingTransactionForm from "../../components/AddSellingTransaction";
import AddBuyingTransactionForm from "../../components/AddBuyingTransaction";

export default function AddTransaction() {
  const [transactionsType, setTransactionsType] = useState("Selling");

  // const SellingTransactionForm = () => {
  //   return (
  //     <form onSubmit={handleSubmit} className="grid gap-2">
  //       <input
  //         type="text"
  //         onChange={(e) => setName(e.target.value)}
  //         value={name}
  //         placeholder="customer name"
  //         className="px-4 py-2 rounded-xl"
  //       />
  //       <label>date of transaction</label>
  //       <input
  //         type="date"
  //         // onChange={(e) => setQuantity(e.target.value)}
  //         // value={quantity}
  //         className="px-4 py-2 rounded-xl"
  //       />
  //       <input
  //         type="text"
  //         onChange={(e) => setSupplier(e.target.value)}
  //         value={supplier}
  //         placeholder="items"
  //         className="px-4 py-2 rounded-xl"
  //       />
  //       <label>initial payment</label>
  //       <div>
  //         <select>
  //           <option value="Cash">Cash</option>
  //           <option value="Check">Check</option>
  //         </select>
  //         <input
  //           type="number"
  //           onChange={(e) => setSupplier(e.target.value)}
  //           value={supplier}
  //           placeholder="amount"
  //           className="px-4 py-2 rounded-xl"
  //         />
  //         <input
  //           type="date"
  //           onChange={(e) => setSupplier(e.target.value)}
  //           value={supplier}
  //           placeholder="date"
  //           className="px-4 py-2 rounded-xl"
  //         />
  //       </div>
  //       <label>collection date</label>
  //       <input
  //         type="date"
  //         // onChange={(e) => setQuantity(e.target.value)}
  //         // value={quantity}
  //         className="px-4 py-2 rounded-xl"
  //       />
  //       <button className="bg-[#3da9fc] text-[#fffffe] px-4 py-2 rounded-lg hover:shadow-lg uppercase">
  //         Add Selling Transaction
  //       </button>
  //     </form>
  //   );
  // };

  // const BuyingTransactionForm = () => {
  //   return (
  //     <form onSubmit={handleSubmit} className="grid gap-2">
  //       <input
  //         type="text"
  //         onChange={(e) => setName(e.target.value)}
  //         value={name}
  //         placeholder="name"
  //         className="px-4 py-2 rounded-xl"
  //       />
  //       <input
  //         type="number"
  //         onChange={(e) => setQuantity(e.target.value)}
  //         value={quantity}
  //         placeholder="quantity"
  //         className="px-4 py-2 rounded-xl"
  //       />
  //       <input
  //         type="text"
  //         onChange={(e) => setSupplier(e.target.value)}
  //         value={supplier}
  //         placeholder="supplier"
  //         className="px-4 py-2 rounded-xl"
  //       />
  //       <button className="bg-[#3da9fc] text-[#fffffe] px-4 py-2 rounded-lg hover:shadow-lg uppercase">
  //         Add Buying Transaction
  //       </button>
  //     </form>
  //   );
  // };

  return (
    <Layout>
      <p>Add {transactionsType} Transaction</p>
      <ul className="flex border-b border-gray-200 text-center gap-1 my-4">
        <li>
          <div
            className={`${
              transactionsType === "Selling"
                ? "border-gray-200 bg-white underline"
                : ""
            } block bg-gray-100 p-4 px-16 text-sm font-medium text-gray-500 ring-1 ring-inset ring-white max-w-max rounded-xl hover:cursor-pointer`}
            onClick={() => setTransactionsType("Selling")}
          >
            Selling
          </div>
        </li>
        <li>
          <div
            className={`${
              transactionsType === "Buying"
                ? "border-gray-200 bg-white underline"
                : ""
            } block bg-gray-100 p-4 px-16 text-sm font-medium text-gray-500 ring-1 ring-inset ring-white max-w-max rounded-xl hover:cursor-pointer`}
            onClick={() => setTransactionsType("Buying")}
          >
            Buying
          </div>
        </li>
      </ul>
      {transactionsType === "Selling" ? (
        <AddSellingTransactionForm />
      ) : (
        <AddBuyingTransactionForm />
      )}
    </Layout>
  );
}
