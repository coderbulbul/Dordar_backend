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
    paymentType: String,
  },
  { timestamps: true }
);

module.exports = model("payment", paymentSchema);
