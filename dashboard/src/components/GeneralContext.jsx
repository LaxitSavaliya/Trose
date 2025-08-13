import React, { useState, useEffect, useCallback } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext(null);

export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const handleOpenBuyWindow = useCallback((stock) => {
    setSelectedStock(stock);
    setIsBuyWindowOpen(true);
  }, []);

  const handleOpenSellWindow = useCallback((stock) => {
    setSelectedStock(stock);
    setIsSellWindowOpen(true);
  }, []);

  const handleCloseWindows = useCallback(() => {
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
        openBuyWindow: handleOpenBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeWindow: handleCloseWindows,
      }}
    >
      {children}

      {isBuyWindowOpen && <BuyActionWindow stock={selectedStock} />}
      {isSellWindowOpen && <SellActionWindow stock={selectedStock} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;