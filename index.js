const express = require("express");
const cors = require("cors");

const app = express();
const { connectDB } = require("./utils/db");
const { port } = require("./utils/config");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Hello world." });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/inquiries", inquiryRoutes);

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    status: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: false,
    error: "Something went wrong!",
    message: err.message,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API base URL: http://localhost:${port}/api`);
});

module.exports = app;
