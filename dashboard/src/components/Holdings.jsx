import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const Holdings = ({ tick }) => {
  const [allHoldings, setAllHoldings] = useState([]);
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = useCallback(
    (stock) => generalContext.openBuyWindow(stock),
    [generalContext]
  );

  const handleSellClick = useCallback(
    (stock) => generalContext.openSellWindow(stock),
    [generalContext]
  );

  useEffect(() => {
    let isMounted = true;
    axios.get("http://localhost:3002/holdings").then((res) => {
      if (isMounted) setAllHoldings(res.data);
    });
    return () => {
      isMounted = false;
    };
  }, [tick]);

  const { totalInvest, currentValue, pl, plPercent, processedHoldings } = useMemo(() => {
    let totalInvestCalc = 0;
    let currentValueCalc = 0;

    const processed = allHoldings.map((stock) => {
      const curValue = stock.price * stock.qty;
      const invest = stock.orderPrice * stock.qty;
      totalInvestCalc += invest;
      currentValueCalc += curValue;
      const profitLoss = curValue - invest;
      const profitLossPercent = ((stock.price - stock.orderPrice) * 100) / stock.orderPrice;

      return {
        ...stock,
        curValue,
        profitLoss,
        profitLossPercent,
        isProfit: profitLoss >= 0
      };
    });

    const plCalc = currentValueCalc - totalInvestCalc;

    return {
      totalInvest: Number(totalInvestCalc.toFixed(2)),
      currentValue: Number(currentValueCalc.toFixed(2)),
      pl: plCalc,
      plPercent: totalInvestCalc ? (plCalc * 100) / totalInvestCalc : 0,
      processedHoldings: processed
    };
  }, [allHoldings]);

  const data = useMemo(
    () => ({
      labels: processedHoldings.map((h) => h.name),
      datasets: [
        {
          label: "Stock Price",
          data: processedHoldings.map((h) => h.price),
          backgroundColor: "rgba(255, 99, 132, 0.5)"
        }
      ]
    }),
    [processedHoldings]
  );

  return (
    <>
      <h3>Holdings ({processedHoldings.length})</h3>
      <hr />
      <div className="d-flex justify-content-between px-3">
        <div>
          <h5>{totalInvest}</h5>
          <p>Total investment</p>
        </div>
        <div>
          <h5>{currentValue}</h5>
          <p>Current value</p>
        </div>
        <div>
          <h5 className={pl >= 0 ? "text-primary" : "text-danger"}>
            ₹{pl.toFixed(2)} ({pl >= 0 ? "+" : "-"}{plPercent.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      <div>
        <table className="table border">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Buy / Sell</th>
            </tr>
          </thead>
          <tbody>
            {processedHoldings.map((stock) => (
              <tr key={stock._id || stock.name}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.orderPrice.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{stock.curValue.toFixed(2)}</td>
                <td className={stock.isProfit ? "text-primary" : "text-danger"}>
                  {stock.profitLoss.toFixed(2)}
                </td>
                <td className={stock.isProfit ? "text-primary" : "text-danger"}>
                  {stock.profitLossPercent.toFixed(2)}%
                </td>
                <td className="d-flex gap-3">
                  <button
                    onClick={() => handleBuyClick(stock)}
                    className="px-2 bg-primary text-light"
                  >
                    B
                  </button>
                  <button
                    onClick={() => handleSellClick(stock)}
                    className="px-2 bg-danger text-light"
                  >
                    S
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <VerticalGraph data={data} />
      </div>
    </>
  );
};

export default Holdings;