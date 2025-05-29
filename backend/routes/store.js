const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (db) => {
  const storesCollection = db.collection("stores");

  // Middleware to validate request body for POST /store
  const validateStoreData = (req, res, next) => {
    const { userId, name, phone, address } = req.body;

    if (!userId || !name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields (userId, name, phone, address) are required",
      });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    next();
  };

  // Save or update store details
  router.post("/store", validateStoreData, async (req, res) => {
    const { userId, name, phone, address, logo } = req.body;

    try {
      await storesCollection.updateOne(
        { userId: new ObjectId(userId) },
        {
          $set: {
            name,
            phone,
            address,
            logo: logo || null,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      res.json({
        success: true,
        message: "Store details saved/updated",
      });
    } catch (err) {
      console.error("Error saving/updating store:", err);
      res.status(500).json({
        success: false,
        message: "Failed to save/update store details",
      });
    }
  });

  // Fetch store details by user ID
  router.get("/store/:userId", async (req, res) => {
    const userId = req.params.userId;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    try {
      const store = await storesCollection.findOne({
        userId: new ObjectId(userId),
      });

      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store not found for this user ID",
        });
      }

      res.json({
        success: true,
        data: store,
      });
    } catch (err) {
      console.error("Error fetching store:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch store details",
      });
    }
  });

  return router;
};
