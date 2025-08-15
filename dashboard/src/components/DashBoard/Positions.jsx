import { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3002/positions").then((res) => {
      setPositions(res.data);
    });
  }, []);

  if (!positions.length) {
    return (
      <div className="m-4 p-4 bg-light rounded shadow-sm text-center">
        <h5 className="text-muted">No Positions Found</h5>
      </div>
    );
  }

  return (
    <div className="m-4">
      <h3 className="mb-3">Positions ({positions.length})</h3>

      <div className="table-responsive shadow-sm rounded-3">
        <table className="table table-striped table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const profitLoss = curValue - stock.avg * stock.qty;
              const isProfit = profitLoss >= 0;
              const profClass = isProfit ? "text-success" : "text-danger";
              const dayClass = stock.isLoss ? "text-danger" : "text-success";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>{profitLoss.toFixed(2)}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Positions;