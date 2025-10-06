const mongoose = require("mongoose");
require("dotenv").config(); // will read .env in the same folder

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Blog = mongoose.model("Blog", new mongoose.Schema({}, { strict: false }));

async function updateStatus() {
  try {
    const result = await Blog.updateMany(
      { status: { $exists: false } }, // only documents without status
      { $set: { status: "Active" } } // set status to Active
    );
    console.log(`Updated ${result.modifiedCount} blog(s)`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

updateStatus();
