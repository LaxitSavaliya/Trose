const initialStocks = [
    { name: "ONGC", initialprice: 100, price: 100 },
    { name: "TCS", initialprice: 100, price: 100 },
    { name: "KPITTECH", initialprice: 100, price: 100 },
    { name: "QUICKHEAL", initialprice: 100, price: 100 },
    { name: "WIPRO", initialprice: 100, price: 100 },
    { name: "M&M", initialprice: 100, price: 100 },
    { name: "RELIANCE", initialprice: 100, price: 100 },
    { name: "HUL", initialprice: 100, price: 100 },
    { name: "CNC", initialprice: 100, price: 100 },
    { name: "SUZLON", initialprice: 100, price: 100 },
];

const initialPositions = [
    { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
    { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
];

module.exports = { initialStocks, initialPositions };