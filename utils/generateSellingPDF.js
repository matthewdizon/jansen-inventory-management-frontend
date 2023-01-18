import jsPDF from "jspdf";

export default function createInvoice(data) {
  console.log("pdf utils", data);
  const { _id, collectionDate, customer, date, items, payments, total } = data;
  const path = `${new Date(date).toISOString().split("T")[0]}-${customer}.pdf`;
  const paymentsFormattedDates = payments.map((obj) => {
    const date = new Date(obj.date);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      amount: obj.amount,
      method: obj.method,
    };
  });

  const doc = new jsPDF();

  generateHeader(doc, _id);
  generateCustomerInformation(doc, collectionDate, customer, total);
  generateTables(doc, items, paymentsFormattedDates);

  doc.save(path);
}

function generateHeader(doc, _id) {
  doc.text("AutoBest", 10, 10);
  doc.text(`Invoice Number: ${_id}`, 200, 10, null, null, "right");
}

function generateCustomerInformation(doc, collectionDate, customer, total) {
  doc.text(`Customer Name: ${customer}`, 10, 20);
  doc.text(`Total Payment: ${total}`, 10, 30);
  doc.text(
    `Collection Date: ${Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(collectionDate))}`,
    10,
    40
  );
}

function createHeaders(keys) {
  const result = [];
  for (var i = 0; i < keys.length; i += 1) {
    result.push({
      id: keys[i],
      name: keys[i],
      prompt: keys[i],
      width: 65,
      align: "center",
      padding: 0,
    });
  }
  return result;
}

const itemsHeaders = createHeaders(["part", "quantity", "price"]);
const paymentsHeaders = createHeaders(["date", "amount", "method"]);

function convertValuesToString(arr) {
  return arr.map((obj) => {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
      newObj[key] = obj[key]?.toString();
    });
    return newObj;
  });
}

function generateTables(doc, items, payments) {
  doc.text("Items Sold", 10, 50);
  doc.table(10, 60, convertValuesToString(items), itemsHeaders, {
    autoSize: false,
  });

  doc.text("Payments Made", 10, 90 + 10 * items.length);
  doc.table(
    10,
    100 + 10 * items.length,
    convertValuesToString(payments),
    paymentsHeaders,
    {
      autoSize: false,
    }
  );
}
