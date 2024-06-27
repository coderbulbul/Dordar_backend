const { model, Schema } = require("mongoose");

const paymentSchema = new Schema(
  {
    userId: Number,
    amount: Number,
    trxID: String,
    paymentID: String,
    data: String,
  },
  { timestamps: true }
);

module.exports = model("payment", paymentSchema);
