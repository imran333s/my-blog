require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin"); // adjust path

const NEW_PASSWORD = "Sahrukh"; // plain password

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB");

    const admin = await Admin.findOne({ email: "imran33s786@gmail.com" });
    if (!admin) {
      console.log("Admin not found!");
      mongoose.connection.close();
      return;
    }

    admin.password = NEW_PASSWORD; // store plain password
    await admin.save();

    console.log("Password reset to plain text!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
