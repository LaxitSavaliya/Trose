import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3002" });

const Orders = ({ tick }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        if (isMounted) setOrders(data);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [tick]);

  if (!orders.length) {
    return <p className="m-4">No orders found.</p>;
  }

  return (
    <div className="m-4">
      <h2 className="mb-4">Order List</h2>
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
          {orders.map(({ _id, name, qty, price, mode }) => (
            <tr key={_id}>
              <td>{name}</td>
              <td>{qty}</td>
              <td>{price.toFixed(2)}</td>
              <td>{mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;