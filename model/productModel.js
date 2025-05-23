const { default: mongoose } = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
