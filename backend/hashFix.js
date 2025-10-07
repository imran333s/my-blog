require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin"); // ✅ adjust this if your model is elsewhere

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB");

    const admin = await Admin.findOne({ email: "imran33s786@gmail.com" });

    if (admin) {
      const hashed = await bcrypt.hash(admin.password, 10);
      admin.password = hashed;
      await admin.save();
      console.log("✅ Password hashed successfully!");
    } else {
      console.log("❌ Admin not found!");
    }

    mongoose.connection.close();
  })
  .catch((err) => console.error("MongoDB connection error:", err));
