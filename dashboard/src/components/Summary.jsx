import React from "react";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const Summary = () => {
  return (
    <>
      <div className="row p-3">
        <h3 className="pb-2">Hi, Demo</h3>
        <hr />
        <div className="d-flex justify-content-between mb-4 py-3">
          <div className="">
            <h6 className="text-muted">
              <PieChartOutlineIcon className="fs-4" /> Equity
            </h6>
            <h2>1L</h2>
            <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
              Margin available
            </p>
          </div>
          <div className="mt-1 pt-2 border-start ps-4">
            <p className="mb-1">
              Margins used: <strong>0</strong>
            </p>
            <p className="mb-1">
              Opening balance: <strong>1L</strong>
            </p>
            <a href="#" className="text-primary" style={{ fontSize: "14px" }}>
              View statement
            </a>
          </div>

          <div className="">
            <h6 className="text-muted">
              <DataUsageIcon className="fs-4" /> commodity
            </h6>
            <h2>50k</h2>
            <p className="mb-1 text-muted" style={{ fontSize: "14px" }}>
              Margin available
            </p>
          </div>
          <div className="mt-1 pt-2 border-start ps-4">
            <p className="mb-1">
              Margins used: <strong>0</strong>
            </p>
            <p className="mb-1">
              Opening balance: <strong>50k</strong>
            </p>
            <a href="#" className="text-primary" style={{ fontSize: "14px" }}>
              View statement
            </a>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-8">
            <div className="d-flex justify-content-between align-items-center mt-5 me-5 pe-5">
              <div>
                <h6 className="text-muted mb-1">
                  <BusinessCenterIcon className="fs-4" /> Holdings (17)
                </h6>
                <h3 className="text-success mb-2 mt-3">
                  2.24k <small className="text-success">+16.90%</small>
                </h3>
                <p className="mb-1">P&L</p>
              </div>
              <div className="border-start mt-3 ps-5">
                <p className="mb-1 pt-0">
                  Current value: <strong>15.46k</strong>
                </p>
                <p className="mb-1">
                  Investment: <strong>13.23k</strong>
                </p>
              </div>
            </div>

            <div className="mt-4 d-flex">
              {[
                "#4254f5",
                "#00aaff",
                "#2196f3",
                "#9c27b0",
                "#673ab7",
                "#3f51b5",
                "#00bcd4",
                "#4caf50",
                "#8bc34a",
                "#cddc39",
                "#ffc107",
                "#ff9800",
                "#ffeb3b",
              ].map((color, i) => (
                <div
                  key={i}
                  style={{ height: "20px", backgroundColor: color, flex: 1 }}
                ></div>
              ))}
            </div>

            <div className="d-flex justify-content-between">
              <p className="mt-2">₹15,463.77</p>

              <div className="mt-2">
                <label className="me-3">
                  <input type="radio" checked readOnly /> Current value
                </label>
                <label className="me-3">
                  <input type="radio" readOnly /> Investment value
                </label>
                <label>
                  <input type="radio" readOnly /> P&L
                </label>
              </div>
            </div>
          </div>
          <div className="col-4 mt-4">
            <a href="#">
              <img
                className="w-100 h-100"
                src="Screenshot 2025-07-23 152205.png"
                alt="Invite Reward"
                style={{ height: "100px" }}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
