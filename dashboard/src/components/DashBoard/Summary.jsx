import { useState, useEffect, useMemo } from "react";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import axios from "axios";
import invite from "../../Assets/Images/invite.png";

const Summary = ({ tick }) => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [viewMode, setViewMode] = useState("current");

  useEffect(() => {
    let isMounted = true;
    axios.get("http://localhost:3002/holdings").then((res) => {
      if (isMounted) setAllHoldings(res.data || []);
    });
    return () => { isMounted = false; };
  }, [tick]);

  const { totalInvest, currentValue, pl, plPercent } = useMemo(() => {
    let totalInvestCalc = 0;
    let currentValueCalc = 0;

    allHoldings.forEach(stock => {
      const invest = stock.orderPrice * stock.qty;
      const curValue = stock.price * stock.qty;
      totalInvestCalc += invest;
      currentValueCalc += curValue;
    });

    const plCalc = currentValueCalc - totalInvestCalc;

    return {
      totalInvest: Number(totalInvestCalc.toFixed(2)),
      currentValue: Number(currentValueCalc.toFixed(2)),
      pl: Number(plCalc.toFixed(2)),
      plPercent: totalInvestCalc ? Number(((plCalc * 100) / totalInvestCalc).toFixed(2)) : 0
    };
  }, [allHoldings]);

  const colors = [
    "#4254f5", "#00aaff", "#2196f3", "#9c27b0", "#673ab7",
    "#3f51b5", "#00bcd4", "#4caf50", "#8bc34a", "#cddc39",
    "#ffc107", "#ff9800", "#ffeb3b"
  ];

  const barSegments = useMemo(() => {
    let totalForWidth = viewMode === "current" ? currentValue
      : viewMode === "investment" ? totalInvest
        : Math.abs(pl);

    if (!totalForWidth) return [];

    return allHoldings.map((stock, i) => {
      const value = viewMode === "current" ? stock.price * stock.qty
        : viewMode === "investment" ? stock.orderPrice * stock.qty
          : Math.abs(stock.price * stock.qty - stock.orderPrice * stock.qty);

      return {
        width: (value / totalForWidth) * 100,
        color: colors[i % colors.length],
        label: `${stock.name}: ₹${value.toFixed(2)}`
      };
    });
  }, [viewMode, allHoldings, currentValue, totalInvest, pl]);

  return (
    <div className="summary-container p-3">
      <h3 className="mb-3">Hi, Demo</h3>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <div className="card summary-card">
          <div className="card-body">
            <h6 className="text-muted">
              <PieChartOutlineIcon /> Equity
            </h6>
            <h2>₹1,00,000</h2>
            <p className="text-muted mb-2">Margin available</p>
            <p className="mb-1">Margins used: <strong>0</strong></p>
            <p className="mb-1">Opening balance: <strong>₹1,00,000</strong></p>
            <a href="#" className="text-primary">View statement</a>
          </div>
        </div>
        <div className="card summary-card">
          <div className="card-body">
            <h6 className="text-muted">
              <DataUsageIcon /> Commodity
            </h6>
            <h2>₹50,000</h2>
            <p className="text-muted mb-2">Margin available</p>
            <p className="mb-1">Margins used: <strong>0</strong></p>
            <p className="mb-1">Opening balance: <strong>₹50,000</strong></p>
            <a href="#" className="text-primary">View statement</a>
          </div>
        </div>
      </div>

      <hr />

      <div className="row align-items-center">
        <div className="col-lg-8 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-muted"><BusinessCenterIcon /> Holdings ({allHoldings.length})</h6>
              <h3 className={pl >= 0 ? "text-success" : "text-danger"}>
                ₹{pl} <small className={pl >= 0 ? "text-success" : "text-danger"}>({plPercent}%)</small>
              </h3>
              <p>P&L</p>
            </div>
            <div className="ms-4 border-start ps-3">
              <p className="mb-1">Current value: <strong>₹{currentValue}</strong></p>
              <p className="mb-1">Investment: <strong>₹{totalInvest}</strong></p>
            </div>
          </div>

          <div className="bar-container mt-3">
            {barSegments.map((segment, i) => (
              <div
                key={i}
                className="bar-segment"
                style={{ backgroundColor: segment.color, width: `${segment.width}%` }}
                title={segment.label}
              />
            ))}
          </div>

          <div className="d-flex justify-content-start gap-3 mt-3">
            {["current", "investment", "pl"].map((mode) => (
              <button
                key={mode}
                className={`toggle-btn ${viewMode === mode ? "active" : ""}`}
                onClick={() => setViewMode(mode)}
              >
                {mode === "current" ? "Current value" : mode === "investment" ? "Investment value" : "P&L"}
              </button>
            ))}
          </div>
        </div>

        <div className="col-lg-4 text-center">
          <a href="#">
            <img
              src={invite}
              alt="Invite Reward"
              style={{ width: "95%" }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Summary;