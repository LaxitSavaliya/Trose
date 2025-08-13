import { useState, useContext, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Tooltip } from "@mui/material";
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnoutChart";

function WatchList({ tick }) {
  const [allStock, setAllStock] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    axios.get("http://localhost:3002/stocks")
      .then(res => setAllStock(res.data))
      .catch(console.error);
  }, [tick]);

  const chartData = useMemo(() => {
    const labels = allStock.map(stock => stock.name);
    const prices = allStock.map(stock => stock.price);
    return {
      labels,
      datasets: [
        {
          label: "Price",
          data: prices,
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    };
  }, [allStock]);

  const handleBuyClick = useCallback(stock => {
    generalContext.openBuyWindow(stock);
  }, [generalContext]);

  const handleSellClick = useCallback(stock => {
    generalContext.openSellWindow(stock);
  }, [generalContext]);

  return (
    <>
      <div className="position-relative w-100 ms-1">
        <SearchIcon className="position-absolute top-50 start-0 translate-middle-y ms-3 fs-5 text-muted" />
        <input
          type="text"
          name="search"
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

      {allStock.map(stock => {
        const priceDiff = stock.price - stock.initialprice;
        const pricePercent = (priceDiff * 100) / stock.initialprice;
        const isUp = priceDiff >= 0;
        const textClass = isUp ? "text-success" : "text-danger";

        return (
          <div
            key={stock._id}
            onMouseEnter={() => setHoveredId(stock._id)}
            onMouseLeave={() => setHoveredId(null)}
            className="ms-1 ps-3 border pt-3 position-relative"
            style={{ width: "98%" }}
          >
            <div className="d-flex justify-content-between">
              <p className={`w-50 ${textClass}`} style={{ fontSize: "14px" }}>
                {stock.name}
              </p>
              <div style={{ fontSize: "13px" }} className="w-50 text-end d-flex">
                <p className={`w-25 ${textClass}`}>{priceDiff.toFixed(2)}</p>
                <p className={`w-25 ${textClass}`}>{pricePercent.toFixed(2)}</p>
                <p style={{ width: "15%" }} className={textClass}>
                  {isUp ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </p>
                <p className={`w-25 ${textClass}`}>{stock.price}</p>
              </div>

              {hoveredId === stock._id && (
                <div className="position-absolute" style={{ marginLeft: "240px" }}>
                  <Tooltip title="Buy (B)" placement="top">
                    <button
                      className="px-3 me-2 bg-success text-white rounded"
                      onClick={() => handleBuyClick(stock)}
                    >
                      B
                    </button>
                  </Tooltip>
                  <Tooltip title="Sell (S)" placement="top">
                    <button
                      className="px-3 me-2 bg-danger text-white rounded"
                      onClick={() => handleSellClick(stock)}
                    >
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
              )}
            </div>
          </div>
        );
      })}

      <DoughnutChart data={chartData} />
    </>
  );
}

export default WatchList;