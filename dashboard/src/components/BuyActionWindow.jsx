import React, { useState, useContext, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ stock }) => {
  const { closeWindow } = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(stock.price);
  const [error, setError] = useState("");

  const minPrice = useMemo(() => stock.price - 5, [stock.price]);
  const maxPrice = useMemo(() => stock.price + 5, [stock.price]);

  const marginRequired = useMemo(
    () => (stockQuantity * stockPrice).toFixed(2),
    [stockQuantity, stockPrice]
  );

  const handleCancelClick = useCallback(() => {
    closeWindow();
  }, [closeWindow]);

  const handlePriceChange = useCallback(
    (e) => {
      const value = Number(e.target.value);
      setStockPrice(value);

      if (value < minPrice || value > maxPrice) {
        setError(`You can only set a price between ₹${minPrice} and ₹${maxPrice}`);
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
    <div className="container buy-modal" id="buy-window">
      <div className="header" draggable>
        <h3>
          Buy Order <span>({stock.name})</span>
        </h3>
      </div>

      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Math.max(1, Number(e.target.value)))}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              value={stockPrice}
              onChange={handlePriceChange}
            />
          </fieldset>
        </div>

        {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
      </div>

      <div className="buttons">
        <span>Margin required ₹{marginRequired}</span>
        <div>
          <Link
            to="#"
            className={`btn btn-primary me-3 ${error ? "disabled" : ""}`}
            onClick={handleBuyClick}
          >
            Buy
          </Link>
          <Link
            to="#"
            className="btn btn-secondary"
            onClick={handleCancelClick}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;