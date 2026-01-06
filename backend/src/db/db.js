const mongoose = require('mongoose');
// logic to how you connect your server to your database
function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        })
}
module.exports = connectDB;