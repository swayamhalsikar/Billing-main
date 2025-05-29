const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (db) => {
  const usersCollection = db.collection('users');

  router.post("/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert new user
      const result = await usersCollection.insertOne({
        email,
        password: hashedPassword,
        createdAt: new Date()
      });
      
      res.json({ 
        success: true, 
        message: "User registered",
        userId: result.insertedId
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
      
      // Compare passwords
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
      
      res.json({ 
        success: true, 
        userId: user._id 
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  return router;
};
