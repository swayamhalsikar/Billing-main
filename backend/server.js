require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const storeRoutes = require("./routes/store");
const inventoryRoutes = require("./routes/inventory");
const invoiceRoutes = require("./routes/invoice");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection configuration
// const mongoUrl = "";
const mongoUrl = process.env.MONGODB_URI; 
const dbName = "billing";

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
    return client.db(dbName);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

// Initialize the server after database connection is established
async function startServer() {
  const db = await connectToDatabase();

  // Setup routes with MongoDB database instance
  app.use("/api", authRoutes(db));
  app.use("/api", storeRoutes(db));
  app.use("/api", inventoryRoutes(db));
  app.use("/api", invoiceRoutes(db));

  app.listen(5000, () => console.log("Server running on port 5000"));
}

startServer();
