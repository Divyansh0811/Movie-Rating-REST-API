const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
 {
  moviename: {
   type: String,
   required: [true, "Please add a movie name"],
   unique: true
  },
  ratings: [
   {
    username: String,
    rating: mongoose.Schema.Types.Mixed,
   },
  ],
 },
 {
  timestamps: true,
 }
);
module.exports = mongoose.model("Movie", movieSchema);
