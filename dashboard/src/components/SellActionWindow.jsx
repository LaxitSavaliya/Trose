import { useState, useContext, useEffect } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const SellActionWindow = ({ stock }) => {
  const { closeWindow } = useContext(GeneralContext);

  const [availableQty, setAvailableQty] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(stock.price);
  const [error, setError] = useState("");

  useEffect(() => setStockPrice(stock.price), [stock.price]);

  useEffect(() => {
    let isMounted = true;
    axios.get("http://localhost:3002/holdings").then((res) => {
      if (isMounted) {
        const foundStock = res.data.find((item) => item.name === stock.name);
        if (foundStock) setAvailableQty(foundStock.qty);
        else {
          setAvailableQty(0);
          setError(`You don't have any units of ${stock.name} to sell.`);
        }
      }
    });
    return () => { isMounted = false; };
  }, [stock.name]);

  const handleCancelClick = () => closeWindow();

  const handleQtyChange = (value) => {
    const qty = Number(value);
    setStockQuantity(qty);

    if (availableQty === 0) {
      setError(`You don't have any units of ${stock.name} to sell.`);
    } else if (qty > availableQty) {
      setError(`You only have ${availableQty} units available to sell.`);
    } else {
      setError("");
    }
  };

  const handleSellClick = () => {
    if (error || stockQuantity <= 0 || stockPrice <= 0) return;

    axios.post("http://localhost:3002/orders", {
      name: stock.name,
      qty: stockQuantity,
      price: stockPrice,
      mode: "SELL",
    }).then(() => closeWindow());
  };

  const marginRequired = (stockQuantity * stockPrice).toFixed(2);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1050 }}
    >
      <div className="bg-white p-4 rounded-3 shadow" style={{ maxWidth: "400px", width: "90%" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Sell Order <span className="text-secondary">({stock.name})</span></h5>
          <button className="btn btn-light btn-sm" onClick={handleCancelClick}>✕</button>
        </div>

        <div className="mb-3">
          <div className="mb-3">
            <label className="form-label fw-bold">Quantity</label>
            <input
              type="number"
              className={`form-control ${error ? "border-danger" : ""}`}
              value={stockQuantity}
              max={availableQty}
              onChange={(e) => handleQtyChange(e.target.value)}
            />
            <small className="text-muted">Available: {availableQty}</small>
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">Price</label>
            <input
              type="number"
              step="0.05"
              className="form-control"
              value={stockPrice}
              onChange={(e) => setStockPrice(Number(e.target.value))}
            />
          </div>
          {error && <small className="text-danger">{error}</small>}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="fw-semibold">Margin: ₹{marginRequired}</span>
          <div className="d-flex gap-2">
            <button
              className="btn btn-danger"
              onClick={handleSellClick}
              disabled={!!error || stockQuantity <= 0 || stockPrice <= 0}
            >
              Sell
            </button>
            <button className="btn btn-secondary" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;