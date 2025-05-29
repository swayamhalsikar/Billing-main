const express = require("express");
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const inventoryCollection = db.collection('inventory');

  router.post("/inventory", async (req, res) => {
    try {
      const { userId, itemName, price } = req.body;
      
      const result = await inventoryCollection.insertOne({
        userId: new ObjectId(userId),
        itemName,
        price: parseFloat(price),
        createdAt: new Date()
      });
      
      res.json({ 
        success: true, 
        message: "Item added",
        itemId: result.insertedId
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  router.get("/inventory/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const items = await inventoryCollection.find({ 
        userId: new ObjectId(userId) 
      }).toArray();
      
      res.json({ 
        success: true, 
        data: items 
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  return router;
};
