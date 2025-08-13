import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineStock } from "react-icons/ai";

const watchlist = [
  { name: "NIFTY 50", price: "22,500.50", percent: "+0.52%", isDown: false },
  { name: "BANKNIFTY", price: "48,200.75", percent: "-0.25%", isDown: true },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { text: "Dashboard", link: "/" },
    { text: "Orders", link: "/orders" },
    { text: "Holdings", link: "/holdings" },
    { text: "Positions", link: "/positions" },
    { text: "Funds", link: "/funds" },
    { text: "Apps", link: "/apps" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
      <div className="container-fluid px-3">
        <div className="d-flex align-items-center">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <AiOutlineStock size={30} className="me-2 text-white" />
            <span className="fw-bold fs-5 text-white">Your App</span>
          </Link>
          <button
            className="navbar-toggler ms-2"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* <div className="d-none d-lg-flex align-items-center mx-auto">
          {watchlist.slice(0, 2).map((item, idx) => (
            <div key={idx} className="d-flex align-items-center ms-4">
              <span className="text-white small me-2">{item.name}</span>
              <span
                className={`fw-bold small ${
                  item.isDown ? "text-danger" : "text-success"
                }`}
              >
                {item.price}
              </span>
            </div>
          ))}
        </div> */}

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
        >
          <div className="d-lg-flex ms-auto align-items-center">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navLinks.map((item, index) => (
                <li className="nav-item" key={index}>
                  <Link
                    className={`nav-link ${
                      location.pathname === item.link
                        ? "text-white fw-bold" // Active link is bold white
                        : "text-dark"
                    }`}
                    to={item.link}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="d-flex align-items-center mt-3 mt-lg-0 ms-lg-3">
              <span
                className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "32px", height: "32px", fontSize: "14px" }}
              >
                D
              </span>
              <span className="ms-2 text-white">Demo</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;