const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");
const addressRoutes = require("./routes/address.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const userRoutes = require("./routes/user.routes");

const paymentRoutes = require("./routes/paymentRoutes");


// Middlewares
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// ===== Core Middlewares =====
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

// ===== Debug Check (REMOVE AFTER FIX) =====console.log('✓ CORS enabled for:', ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']);
console.log('✓ File upload limit: 50MB'); console.log("authRoutes:", typeof authRoutes);
console.log("productRoutes:", typeof productRoutes);
console.log("categoryRoutes:", typeof categoryRoutes);
console.log("orderRoutes:", typeof orderRoutes);
console.log("errorHandler:", typeof errorHandler);

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/users", userRoutes);

// ===== Error Handler =====
app.use(errorHandler);

app.use("/api/payment", paymentRoutes);

module.exports = app;