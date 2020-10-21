const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/pms", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
var conn = mongoose.Collection;
var productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  quality: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

var productModel = mongoose.model("products", productSchema);
module.exports = productModel;
