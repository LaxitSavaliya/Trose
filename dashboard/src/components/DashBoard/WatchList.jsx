import { useState, useContext, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Tooltip } from "@mui/material";
import GeneralContext from "../../Context/GeneralContext";
import { DoughnutChart } from "../Charts/DoughnoutChart";

function WatchList({ tick }) {
  const [allStock, setAllStock] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    axios
      .get("http://localhost:3002/stocks")
      .then((res) => setAllStock(res.data))
      .catch(console.error);
  }, [tick]);

  const filteredStock = useMemo(() => {
    if (!searchTerm) return allStock;
    return allStock.filter((stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allStock]);

  const chartData = useMemo(() => {
    const labels = filteredStock.map((stock) => stock.name);
    const prices = filteredStock.map((stock) => stock.price);
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
  }, [filteredStock]);

  const handleBuyClick = useCallback(
    (stock) => generalContext.openBuyWindow(stock),
    [generalContext]
  );

  const handleSellClick = useCallback(
    (stock) => generalContext.openSellWindow(stock),
    [generalContext]
  );

  return (
    <>
      <div
        className="d-flex align-items-center m-1 rounded-3"
        style={{ border: "2px solid #ccc" }}
      >
        <label
          htmlFor="stock"
          style={{
            padding: "8px 10px",
            backgroundColor: "#ccc",
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px",
            cursor: "pointer"
          }}
        >
          <SearchIcon className="fs-3" />
        </label>
        <input
          id="stock"
          type="text"
          name="search"
          placeholder="Search using stock name..."
          className="fw-semibold"
          style={{
            width: "98%",
            border: "none",
            outline: "none",
            fontSize: "17px",
            padding: "0 0 0 10px"
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStock.map((stock) => {
        const priceDiff = stock.price - stock.initialprice;
        const pricePercent = (priceDiff * 100) / stock.initialprice;
        const isUp = priceDiff >= 0;
        const textClass = isUp ? "text-success" : "text-danger";

        return (
          <div
            key={stock._id}
            onMouseEnter={() => setHoveredId(stock._id)}
            onMouseLeave={() => setHoveredId(null)}
            className="ms-1 ps-3 border pt-3 position-relative m-1 rounded-3 bg-white shadow-sm"
            style={{ width: "98%" }}
          >
            <div className="d-flex justify-content-between">
              <p className={`w-50 ${textClass} fw-semibold`} style={{ fontSize: "15px" }}>
                {stock.name}
              </p>
              <div style={{ fontSize: "13.2px" }} className="w-50 text-end d-flex">
                <p className={`w-25 ${textClass} fw-semibold`}>{priceDiff.toFixed(2)}</p>
                <p className={`w-25 ${textClass} fw-semibold`}>{pricePercent.toFixed(2)}</p>
                <p style={{ width: "15%" }} className={`${textClass} fw-semibold`}>
                  {isUp ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </p>
                <p className={`w-25 ${textClass} fw-semibold`}>{stock.price}</p>
              </div>

              {hoveredId === stock._id && (
                <div className="position-absolute" style={{ right: "20px" }}>
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