import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css"; // Assuming shared styles for buy/sell

const SellActionWindow = ({ stock }) => {
  const [availableQty, setAvailableQty] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(stock.price);
  const { closeWindows } = useContext(GeneralContext); // fixed method name

  useEffect(() => {
      axios.get("http://localhost:3002/allholding").then((res) => {
        const stockData = res.data;
        const found = stockData.find(item => item.name === stock.name);
        setAvailableQty(found ? found.qty : 0);
      });
    }, [stock.name]);

  const handleCancelClick = () => {
    closeWindows();
  };

  const handleSellClick = () => {
    if(stockQuantity > availableQty) {
      alert(`You only have ${availableQty} units available to sell.`);
      return;
    }

    axios.post("http://localhost:3002/neworder", {
      name: stock.name,
      qty: stockQuantity,
      price: stockPrice,
      currPrice: stock.price,
      mode: "SELL",
    });
    closeWindows();
  };

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
              name="qty"
              id="qty"
              placeholder="0"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              placeholder="0.00"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div>
          <Link
            to="#"
            className="btn btn-danger me-3"
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
