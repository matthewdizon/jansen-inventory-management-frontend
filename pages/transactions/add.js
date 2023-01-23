import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import AddSellingTransactionForm from "../../components/AddSellingTransaction";
import AddBuyingTransactionForm from "../../components/AddBuyingTransaction";
import { useRouter } from "next/router";

export default function AddTransaction() {
  const router = useRouter();
  const { type } = router.query;

  const [transactionsType, setTransactionsType] = useState(
    type === "buying" ? "Buying" : "Selling"
  );

  console.log("here", type, transactionsType);

  useEffect(() => {
    type === "buying"
      ? setTransactionsType("Buying")
      : setTransactionsType("Selling");
  }, [type]);

  return (
    <Layout>
      {/* <p>Add {transactionsType} Transaction</p> */}
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
