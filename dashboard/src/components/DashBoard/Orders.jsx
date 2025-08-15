import { useEffect, useState } from "react";
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
    return (
      <div className="m-4 p-4 bg-light rounded-3 text-center shadow-sm">
        <h4 className="text-muted">No orders found.</h4>
      </div>
    );
  }

  return (
    <div className="m-4">
      <h2 className="mb-4 fw-bold">Orders</h2>

      <div className="table-responsive shadow-sm rounded-3 overflow-hidden">
        <table className="table table-hover table-striped mb-0">
          <thead className="table-dark">
            <tr>
              <th scope="col">Instrument</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price (₹)</th>
              <th scope="col">Mode</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(({ _id, name, qty, price, mode }) => (
              <tr key={_id} className="align-middle">
                <td>{name}</td>
                <td>{qty}</td>
                <td>{price.toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${mode === "BUY" ? "bg-success" : "bg-danger"
                      }`}
                  >
                    {mode}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;