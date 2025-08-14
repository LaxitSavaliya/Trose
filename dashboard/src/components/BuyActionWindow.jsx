import { useState, useContext, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const BuyActionWindow = ({ stock }) => {
  const { closeWindow } = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState("");
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => setStockPrice(stock.price), [stock.price]);

  const minPrice = useMemo(() => stock.price - 5, [stock.price]);
  const maxPrice = useMemo(() => stock.price + 5, [stock.price]);

  const marginRequired = useMemo(
    () => (stockQuantity && stockPrice ? (stockQuantity * stockPrice).toFixed(2) : 0),
    [stockQuantity, stockPrice]
  );

  const handleCancelClick = useCallback(() => closeWindow(), [closeWindow]);

  const handlePriceChange = useCallback(
    (e) => {
      const value = Number(e.target.value);
      setStockPrice(value);

      if (value < minPrice || value > maxPrice) {
        setError(`Price must be between ₹${minPrice} and ₹${maxPrice}`);
      } else {
        setError("");
      }
    },
    [minPrice, maxPrice]
  );

  const handleBuyClick = useCallback(async () => {
    if (error || stockQuantity < 1 || stockPrice <= 0) return;

    try {
      await axios.post("http://localhost:3002/orders", {
        name: stock.name,
        qty: stockQuantity,
        price: stockPrice,
        mode: "BUY",
      });
      closeWindow();
    } catch (err) {
      console.error("Order submission failed:", err);
      setError("Failed to place order. Please try again.");
    }
  }, [error, stockQuantity, stockPrice, stock.name, closeWindow]);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1050 }}
    >
      <div className="bg-white p-4 rounded-3 shadow" style={{ maxWidth: "400px", width: "90%" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Buy Order <span className="text-secondary">({stock.name})</span></h5>
          <button className="btn btn-light btn-sm" onClick={handleCancelClick}>✕</button>
        </div>

        <div className="mb-3">
          <div className="mb-3">
            <label className="form-label fw-bold">Quantity</label>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">Price</label>
            <input
              type="number"
              className={`form-control ${error ? "border-danger" : ""}`}
              value={stockPrice}
              onChange={handlePriceChange}
            />
            {error && <small className="text-danger">{error}</small>}
          </div>
          <small className="text-muted">Allowed range: ₹{minPrice} - ₹{maxPrice}</small>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <span className="fw-semibold">Margin: ₹{marginRequired}</span>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={handleBuyClick}
              disabled={!!error || !stockQuantity || !stockPrice}
            >
              Buy
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

export default BuyActionWindow;