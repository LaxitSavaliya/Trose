import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const SellActionWindow = ({ stock }) => {
  const [availableQty, setAvailableQty] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(stock.price);
  const [error, setError] = useState("");

  const { closeWindow } = useContext(GeneralContext);

  useEffect(() => {
    let isMounted = true;
    axios.get("http://localhost:3002/holdings").then((res) => {
      if (isMounted) {
        const foundStock = res.data.find(item => item.name === stock.name);
        setAvailableQty(foundStock ? foundStock.qty : 0);
      }
    });
    return () => { isMounted = false; };
  }, [stock.name]);

  const handleCancelClick = () => closeWindow();

  const handleQtyChange = (value) => {
    const qty = Number(value);
    setStockQuantity(qty);
    if (qty > availableQty) {
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
    <div className="container buy-modal" id="sell-window">
      <div className="header" draggable="true">
        <h3>
          Sell Order <span>({stock.name})</span>
        </h3>
      </div>

      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              max={availableQty}
              value={stockQuantity}
              onChange={(e) => handleQtyChange(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              min="0"
              value={stockPrice}
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
            className={`btn btn-danger me-3 ${error ? "disabled" : ""}`}
            onClick={handleSellClick}
          >
            Sell
          </Link>
          <Link to="#" className="btn btn-secondary" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;