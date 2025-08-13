import React, { useState, useEffect } from "react";
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
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GeneralContextProvider>
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12 col-lg-4 d-flex flex-column">
            <WatchList tick={tick} />
          </div>

          <div className="col-12 col-lg-8 p-4 d-flex flex-column">
            <Routes>
              <Route exact path="/" element={<Summary />} />
              <Route path="/orders" element={<Orders tick={tick} />} />
              <Route path="/holdings" element={<Holdings tick={tick} />} />
              <Route path="/positions" element={<Positions />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/apps" element={<Apps />} />
            </Routes>
          </div>
        </div>
      </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;