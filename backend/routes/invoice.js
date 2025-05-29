const express = require("express");
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const invoicesCollection = db.collection('invoices');

  router.post("/invoice", async (req, res) => {
    try {
      const { userId, customerName, customerPhone, items, taxRate, totalPrice } = req.body;
      
      const result = await invoicesCollection.insertOne({
        userId: new ObjectId(userId),
        customerName,
        customerPhone,
        items: Array.isArray(items) ? items : JSON.parse(items),
        taxRate: parseFloat(taxRate),
        totalPrice: parseFloat(totalPrice),
        createdAt: new Date()
      });
      
      res.json({ 
        success: true, 
        message: "Invoice saved",
        invoiceId: result.insertedId
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  router.get("/invoices/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const invoices = await invoicesCollection.find({ 
        userId: new ObjectId(userId) 
      }).toArray();
      
      res.json({ 
        success: true, 
        data: invoices 
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  return router;
};
