import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = ({ tick }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders and all stocks in parallel
        const [ordersRes, allStockRes] = await Promise.all([
          axios.get("http://localhost:3002/allorder"),
          axios.get("http://localhost:3002/allstock"),
        ]);

        const orders = ordersRes.data;
        const allStockData = allStockRes.data;

        setStocks(orders);

        // Create a map for instant stock lookup
        const stockPriceMap = {};
        allStockData.forEach(stock => {
          stockPriceMap[stock.name] = stock.price;
        });

        // Filter orders that meet the buy condition
        const eligibleOrders = orders.filter(order => {
          const matchPrice = stockPriceMap[order.name];
          if (matchPrice === undefined) return false;
          const diff = matchPrice - order.price;
          return Math.abs(diff) >= 2; // >=2 or <=-2
        });

        // Send POST requests in parallel (non-blocking)
        if (eligibleOrders.length > 0) {
          await Promise.all(
            eligibleOrders.map(order =>
              axios.post("http://localhost:3002/newholding", {
                name: order.name,
                qty: order.qty,
                avg: order.price,
              }).catch(err => console.error(`Post error for ${order.name}:`, err))
            )
          );
          console.log(`✅ Posted ${eligibleOrders.length} new holdings`);
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [tick]);

  return (
    <div className="m-4">
      <h2 className="mb-4">Stock List</h2>
      <table className="table border table-striped">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Price</th>
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock._id}>
              <td>{stock.name}</td>
              <td>{stock.qty}</td>
              <td>{stock.price}</td>
              <td>{stock.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
