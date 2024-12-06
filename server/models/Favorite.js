// models/Favorites.js
const mongoose = require("mongoose");

const FavoritesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Service", // Reference to the Service model
  },
}, { timestamps: true });

module.exports = mongoose.model("Favorites", FavoritesSchema);
