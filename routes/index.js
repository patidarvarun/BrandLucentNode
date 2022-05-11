const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
require("dotenv").config();
const user = require("./userRoutes");
const category = require("./categoryRoutes");
const header = require("./headerRoutes");
const footer = require("./footerRoutes");
const banner = require("./bannerRoutes")
const product = require("./productRoutes");
const Offers = require("./productOfferRoutes");
const Order = require("./orderRoutes");
const newsLetter = require("./newsLetterRoutes");
const cart = require("./cartRoutes");
const account = require("./accountRoutes");
const payment = require("./paymentRoutes")

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.use("/api", user);
app.use("/api", category);
app.use('/api', header);
app.use('/api', footer);
app.use('/api', banner)
app.use("/api", product);
app.use("/api", Offers);
app.use("/api", Order);
app.use("/api", newsLetter);
app.use("/api",cart)
app.use("/api",account)
app.use("/api/payment",payment)

module.exports = app;
