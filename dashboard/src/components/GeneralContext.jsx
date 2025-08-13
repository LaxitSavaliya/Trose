import React, { useState, useEffect } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext(null);

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState({});
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);

  const handleOpenBuyWindow = (stock) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(stock);
  };

  const handleOpenSellWindow = (stock) => {
    setIsSellWindowOpen(true);
    setSelectedStockUID(stock);
  };

  const  handleCloseWindows = () => {
    setIsBuyWindowOpen(false);
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
  };

  useEffect(() => {
    document.body.style.overflow = isBuyWindowOpen || isSellWindowOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isBuyWindowOpen, isSellWindowOpen]);

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeWindow: handleCloseWindows,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow stock={selectedStockUID} />}
      {isSellWindowOpen && <SellActionWindow stock={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
