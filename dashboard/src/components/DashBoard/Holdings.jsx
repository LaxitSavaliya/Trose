import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { VerticalGraph } from "../Charts/VerticalGraph";
import GeneralContext from "../../Context/GeneralContext";

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
          backgroundColor: "rgba(54, 162, 235, 0.6)"
        }
      ]
    }),
    [processedHoldings]
  );

  if (!allHoldings.length) {
    return (
      <div className="m-4 p-4 bg-light rounded-3 text-center shadow-sm">
        <h5 className="text-muted">No Holdings found</h5>
      </div>
    );
  }

  return (
    <div className="m-4">
      <h3 className="mb-3">Holdings ({processedHoldings.length})</h3>
      <hr />

      <div className="d-flex justify-content-around text-center mb-4 px-3 py-2 bg-light rounded shadow-sm">
        <div>
          <h5>₹{totalInvest}</h5>
          <small className="text-muted">Total Investment</small>
        </div>
        <div>
          <h5>₹{currentValue}</h5>
          <small className="text-muted">Current Value</small>
        </div>
        <div>
          <h5 className={pl >= 0 ? "text-success" : "text-danger"}>
            ₹{pl.toFixed(2)} ({plPercent.toFixed(2)}%)
          </h5>
          <small className="text-muted">P&L</small>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded-3">
        <table className="table table-striped table-hover mb-0">
          <thead className="table-primary">
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. Cost</th>
              <th>LTP</th>
              <th>Cur. Value</th>
              <th>P&L</th>
              <th>Net Chg.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {processedHoldings.map((stock) => (
              <tr key={stock._id || stock.name} className="align-middle">
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.orderPrice.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{stock.curValue.toFixed(2)}</td>
                <td className={stock.isProfit ? "text-success" : "text-danger"}>
                  {stock.profitLoss.toFixed(2)}
                </td>
                <td className={stock.isProfit ? "text-success" : "text-danger"}>
                  {stock.profitLossPercent.toFixed(2)}%
                </td>
                <td className="d-flex gap-2">
                  <button
                    onClick={() => handleBuyClick(stock)}
                    className="btn btn-sm btn-success"
                  >
                    B
                  </button>
                  <button
                    onClick={() => handleSellClick(stock)}
                    className="btn btn-sm btn-danger"
                  >
                    S
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <VerticalGraph data={data} />
      </div>
    </div>
  );
};

export default Holdings;