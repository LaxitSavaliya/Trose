import React, { useState ,useEffect } from "react";
import axios, { all } from "axios";

const Positions = () => {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3002/allposition").then((res) => {
      setPositions(res.data);
    });
  }, []);

  return (
    <>
      <h3 className="">Positions ({positions.length})</h3>

      <div>
        <table className="table border">
          <thead>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg.</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Chg.</th>
          </tr>
          </thead>
          {positions.map((stock, index) => {
            const curValue = stock.price * stock.qty;
            const isProfit = curValue - stock.avg * stock.qty >= 0.0;
            const profClass = isProfit ? "text-primary" : "text-danger";
            const dayClass = stock.isLoss ? "text-danger" : "text-primary";

            return (
              <tbody>
              <tr key={index}>
                <td>{stock.product}</td>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td className={profClass}>
                  {(curValue - stock.avg * stock.qty).toFixed(2)}
                </td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Positions;
