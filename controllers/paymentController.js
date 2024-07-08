// Import dependencies
const axios = require("axios");
const paymentModel = require("../models/paymentModel");
const globals = require("node-global-storage");
const { v4: uuidv4 } = require("uuid");

class paymentController {
  // Strore Bkash hearder info
  bkash_headers = async () => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: globals.getValue("id_token"),
      "X-App-Key": process.env.bkash_api_key,
    };
  };
  // Route testing
  test = async (req, res) => {
    const { amount, customer } = req.body;
    try {
      const { data } = await axios.post(
        process.env.bkash_create_payment_url,
        {
          // Request parameters
          mode: "0011",
          payerReference: " ",
          callbackURL:
            "https://dordar-backend.vercel.app/bkash/payment/callback",
          amount: amount,
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
        },
        {
          // Request Headers
          headers: await this.bkash_headers(),
        }
      );
      // Return bkashURL
      console.log(data);
      return res.status(200).json({ bkashURL: data });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };

  // Bkash payment create controller
  payment_create = async (req, res) => {
    // Destructure from req.body
    const { amount, customer } = req.body;
    globals.setValue("customer", customer);
    try {
      const { data } = await axios.post(
        process.env.bkash_create_payment_url,
        {
          // Request parameters
          mode: "0011",
          payerReference: " ",
          callbackURL: process.env.SERVER_URL + "/bkash/payment/callback",
          amount: amount,
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5),
        },
        {
          // Request Headers
          headers: await this.bkash_headers(),
        }
      );
      // Return bkashURL
      return res.status(200).json({ bkashURL: data.bkashURL });
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };

  // Bkash callback controller
  call_back = async (req, res) => {
    // Receive form Data
    const customerData = globals.getValue("customer");

    const { paymentID, status } = req.query;
    // Bkash payment cancel or Fail
    if (status === "cancel" || status === "failure") {
      return res.redirect(` ${process.env.CLIENT_URL}/error?message=${status}`);
    }

    // Bkash payment success
    if (status === "success") {
      try {
        const { data } = await axios.post(
          process.env.bkash_execute_payment_url,
          {
            // Request Parameters
            paymentID,
          },
          {
            // Request Headers
            headers: await this.bkash_headers(),
          }
        );
        console.log(data);
        if (data && data.statusCode === "0000") {
          // Store customer & payment data to database
          await paymentModel.create({
            userId: Math.random() * 10 + 1,
            amount: data.amount,
            paymentID,
            trxID: data.trxID,
            date: data.paymentExecuteTime,
            name: customerData.name,
            contact: customerData.contact,
            thana: customerData.thana,
            district: customerData.district,
            paymentType: customerData.paymentType,
          });
          // Redirect to success page
          return res.redirect(`${process.env.CLIENT_URL}/success`);
        } else {
          // Redirect to error page
          return res.redirect(
            `${process.env.CLIENT_URL}/error?message=${data.statusMessage}`
          );
        }
      } catch (error) {
        // Redirect to error page
        return res.redirect(
          `${process.env.CLIENT_URL}/error?message=${error.message}`
        );
      }
    }
  };

  // Bkash refund controller (Admin panel task)
  refund = async (req, res) => {
    // Get necessary data from database
    const { trxID } = req.params;
    // Make request to Bkash for refund
    try {
      const payment = await paymentModel.findOne({ trxID });
      const { data } = await axios.post(
        process.env.bkash_refund_transaction_url,
        {
          // Request parameters
          paymentID: payment.paymentID,
          amount: payment.amount,
          trxID,
          sku: "payment",
          reason: "cashback ",
        },
        {
          // Request headers
          headers: await this.bkash_headers(),
        }
      );
      // Response back
      if (data && data === "0000") {
        return res.status(200).json({ message: "refund success" });
      }
    } catch (error) {
      return res.status(404).json({ message: "refund failed" });
    }
    // Redirect to refund successfull
  };
}

module.exports = new paymentController();
