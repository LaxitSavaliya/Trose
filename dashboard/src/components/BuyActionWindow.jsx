import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ stock }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(stock.price);
  const [error, setError] = useState("");
  const { closeWindow } = useContext(GeneralContext);

  const minPrice = stock.price - 5;
  const maxPrice = stock.price + 5;

  const handleCancelClick = () => {
    closeWindow();
  };

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setStockPrice(value);

    if (value < minPrice || value > maxPrice) {
      setError(`You can only add value between ₹${minPrice} and ₹${maxPrice}`);
    } else {
      setError("");
    }
  };

  const handleBuyClick = () => {
    if (error || stockQuantity < 1 || stockPrice <= 0) return;

    axios.post("http://localhost:3002/neworder", {
      name: stock.name,
      qty: stockQuantity,
      price: stockPrice,
      mode: "BUY",
    });
    closeWindow();
  };

  const marginRequired = (stockQuantity * stockPrice).toFixed(2);

  return (
    <div className="container buy-modal" id="buy-window">
      <div className="header" draggable="true">
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
              placeholder="0"
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              value={stockQuantity}
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
