const { model, Schema } = require("mongoose");

const paymentSchema = new Schema(
  {
    userId: Number,
    amount: Number,
    trxID: String,
    paymentID: String,
    date: String,
    name: String,
    contact: Number,
    thana: String,
    district: String,
    address: String,
    paymentType: String,
    productName: String,
  },
  { timestamps: true }
);

module.exports = model("payment", paymentSchema);
