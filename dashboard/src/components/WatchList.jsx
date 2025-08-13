import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Tooltip } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnoutChart";
import axios, { all } from "axios";

function WatchList({tick}) {
  const[allStock, setAllStock] = useState([]);
  const [enter, setEnter] = useState(null);

  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    const fetchStock = async () => {
      try {
    const res = await axios.get("http://localhost:3002/stocks");
      setAllStock(res.data);
    } catch(error) {
      console.log(error);
    }
  };
  fetchStock();
  }, [tick]);

  const handleBuyClick = (stock) => {
    generalContext.openBuyWindow(stock);
  };

  const handleSellClick = (stock) => {
    generalContext.openSellWindow(stock);
  }

  const labels = allStock.map((stock) => stock['name']);

  const data = {
    labels,
    datasets: [
      {
        label : 'Price',
        data: allStock.map((stock) => stock.price),
        backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
      },
    ]
  }

  return (
    <>
      <div className="position-relative w-100 ms-1">
        <SearchIcon className="position-absolute top-50 start-0 translate-middle-y ms-3 fs-5 text-muted" />

        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg: infy, bse, nifty fut weekly, gold mcx"
          className="ps-5 pe-5 py-2 shadow-none"
          style={{ width: "98%" }}
        />

        <p
          className="position-absolute top-50 end-0 translate-middle-y me-3 m-0 text-muted"
          style={{ fontSize: "14px" }}
        >
          {allStock.length}/50
        </p>
      </div>

      {allStock.map((stock) => (
        <div
          key={stock._id}
          onMouseEnter={() => setEnter(stock._id)}
          onMouseLeave={() => setEnter(null)}
          className="ms-1 ps-3 border pt-3"
          style={{ width: "98%" }}
        >
          <div className="d-flex justify-content-between">
            <p
              style={{ fontSize: "14px" }}
              className={`w-50
                  ${
                    (stock.price - stock.initialprice) >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
            >
              {stock.name}
            </p>
            <div style={{ fontSize: "13px" }} className="w-50 text-end d-flex">
              <p className={`w-25 ${
                    (stock.price - stock.initialprice) >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}>
                {(stock.price - stock.initialprice).toFixed(2)}
              </p>
              <p className={`w-25 ${
                    (stock.price - stock.initialprice) >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}>{(((stock.price - stock.initialprice)*100)/stock.initialprice).toFixed(2)}</p>
              <p
                style={{ width: "15%" }}
                className={`
                  ${
                    (stock.price - stock.initialprice) >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}
              >
                {(stock.price - stock.initialprice) >= 0 ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </p>
              <p className={`w-25 ${
                    (stock.price - stock.initialprice) >= 0
                      ? "text-success"
                      : "text-danger"
                  }`}>{stock.price}</p>
            </div>
            {enter === stock._id ? (
              <div
                className="position-absolute"
                style={{ marginLeft: "240px" }}
              >
                <Tooltip
                  title="Buy (B)"
                  placement="top"
                  onClick={() => handleBuyClick(stock)}
                >
                  <button className="px-3 me-2 bg-success text-white rounded">
                    B
                  </button>
                </Tooltip>
                <Tooltip title="Sell (S)" placement="top"
                onClick={() => handleSellClick(stock)}
                >
                  <button className="px-3 me-2 bg-danger  text-white rounded">
                    S
                  </button>
                </Tooltip>
                <Tooltip title="Analytics (A)" placement="top">
                  <button className="px-2 me-2 bg-white rounded">
                    <EqualizerIcon className="fs-5" />
                  </button>
                </Tooltip>
                <Tooltip title="More" placement="top">
                  <button className="px-2 bg-white rounded">
                    <MoreHorizIcon className="fs-5" />
                  </button>
                </Tooltip>
              </div>
            ) : null}
          </div>
        </div>
      ))}

      <DoughnutChart data={data}/>
    </>
  );
}

export default WatchList;
