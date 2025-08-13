import React, { useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";

const Holdings = ({ tick }) => {
  const [allHoldings, setAllHoldings] = useState([]);
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = (list) => {
    generalContext.openBuyWindow(list);
  };

  const handleSellClick = (list) => {
    generalContext.openSellWindow(list);
  };

  useEffect(() => {
    let isMounted = true;
    axios.get("http://localhost:3002/allholding").then((res) => {
      if (isMounted) setAllHoldings(res.data);
    });
    return () => {
      isMounted = false;
    };
  }, [tick]);

  // Combine totalInvest and currentValue calculation
  const { totalInvest, currentValue } = useMemo(() => {
    let totalInvestCalc = 0;
    let currentValueCalc = 0;

    allHoldings.forEach(({ avg, price, qty }) => {
      totalInvestCalc += avg * qty;
      currentValueCalc += price * qty;
    });

    return {
      totalInvest: Number(totalInvestCalc.toFixed(2)),
      currentValue: Number(currentValueCalc.toFixed(2)),
    };
  }, [allHoldings]);

  const pl = useMemo(() => currentValue - totalInvest, [currentValue, totalInvest]);

  const labels = useMemo(() => allHoldings.map((h) => h.name), [allHoldings]);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }), [labels, allHoldings]);

  return (
    <>
      <h3>Holdings ({allHoldings.length})</h3>
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
            ₹{pl.toFixed(2)} ({pl >= 0 ? "+" : "-"}{((pl * 100) / totalInvest).toFixed(2)}%)
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
            {allHoldings.map((stock) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "text-primary" : "text-danger";

              return (
                <tr key={stock._id || stock.name}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{(curValue - stock.avg * stock.qty).toFixed(2)}</td>
                  <td className={profClass}>{(((stock.price - stock.avg) * 100) / stock.avg).toFixed(2)}</td>
                  <td className="d-flex gap-3">
                    <button onClick={() => handleBuyClick(stock)} className="px-2 bg-primary text-light">B</button>
                    <button onClick={() => handleSellClick(stock)} className="px-2 bg-danger text-light">S</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <VerticalGraph data={data} />
      </div>
    </>
  );
};

export default Holdings;
