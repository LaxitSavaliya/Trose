import React, { useState, useEffect, useCallback } from "react";
import BuyActionWindow from "../components/Actions/BuyActionWindow";
import SellActionWindow from "../components/Actions/SellActionWindow";

const GeneralContext = React.createContext(null);

export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const openBuyWindow = useCallback((stock) => {
    setSelectedStock(stock);
    setIsBuyWindowOpen(true);
  }, []);

  const openSellWindow = useCallback((stock) => {
    setSelectedStock(stock);
    setIsSellWindowOpen(true);
  }, []);

  const closeWindow = useCallback(() => {
    setIsBuyWindowOpen(false);
    setIsSellWindowOpen(false);
    setSelectedStock(null);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isBuyWindowOpen || isSellWindowOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isBuyWindowOpen, isSellWindowOpen]);

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow,
        openSellWindow,
        closeWindow,
      }}
    >
      {children}

      {isBuyWindowOpen && selectedStock && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1050 }}
        >
          <BuyActionWindow stock={selectedStock} />
        </div>
      )}

      {isSellWindowOpen && selectedStock && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1050 }}
        >
          <SellActionWindow stock={selectedStock} />
        </div>
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;