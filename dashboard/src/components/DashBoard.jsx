import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
  const [tick1s, setTick1s] = useState(0);
  const [tick5s, setTick5s] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick1s((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick5s((prev) => prev + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const NAVBAR_HEIGHT = 56;

  return (
    <GeneralContextProvider>
      <div
        className="row g-0 dashboard-container"
        style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
      >
        <div className="col-12 col-lg-4 watchlist-panel">
          <div className="watchlist-header">WatchList</div>
          <div className="watchlist-content custom-scroll">
            <WatchList tick={tick1s} />
          </div>
        </div>

        <div className="col-12 col-lg-8 main-content custom-scroll">
          <Routes>
            <Route exact path="/" element={<Summary tick={tick5s} />} />
            <Route path="/orders" element={<Orders tick={tick1s} />} />
            <Route path="/holdings" element={<Holdings tick={tick1s} />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/apps" element={<Apps />} />
          </Routes>
        </div>
      </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;