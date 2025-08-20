import PieChartIcon from "@mui/icons-material/PieChart";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import { Link } from "react-router-dom";

const Funds = () => {
  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <p className="mb-2">Instant, zero-cost fund transfers with UPI</p>
        <div className="d-flex gap-2">
          <button className="btn btn-success px-4 py-1 rounded">Add Funds</button>
          <button className="btn btn-primary px-4 py-1 rounded">Withdraw</button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <PieChartIcon className="me-2" />
                  Equity
                </h5>
                <div className="d-flex gap-3">
                  <Link to="#" className="text-decoration-none">View statement</Link>
                  <Link to="#" className="text-decoration-none">Help</Link>
                </div>
              </div>

              <div className="border rounded p-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Available margin</span>
                  <span className="text-primary">₹4,043.10</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Used margin</span>
                  <span>₹3,757.30</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Available cash</span>
                  <span>₹4,043.10</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Opening Balance</span>
                  <span>₹4,043.10</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Payin</span>
                  <span>₹4,064.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>SPAN</span>
                  <span>₹0.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery margin</span>
                  <span>₹0.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Exposure</span>
                  <span>₹0.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Options premium</span>
                  <span>₹0.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Collateral (Liquid funds)</span>
                  <span>₹0.00</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Collateral (Equity)</span>
                  <span>₹0.00</span>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <strong>Total Collateral</strong>
                  <strong>₹0.00</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <DataSaverOffIcon className="me-2" />
                  Commodity
                </h5>
                <div className="d-flex gap-3">
                  <Link to="#" className="text-decoration-none">View statement</Link>
                  <Link to="#" className="text-decoration-none">Help</Link>
                </div>
              </div>

              <div className="border rounded p-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Available margin</span>
                  <span className="text-primary">₹4,043.10</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Used margin</span>
                  <span>₹3,757.30</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Available cash</span>
                  <span>₹4,043.10</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Opening Balance</span>
                  <span>₹4,043.10</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Payin</span>
                  <span>₹4,064.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>SPAN</span>
                  <span>₹0.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery margin</span>
                  <span>₹0.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Exposure</span>
                  <span>₹0.00</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Options premium</span>
                  <span>₹0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="mb-2">You don't have a commodity account</p>
        <Link to="#" className="btn open-account">Open Account</Link>
      </div>
    </div>
  );
};

export default Funds;