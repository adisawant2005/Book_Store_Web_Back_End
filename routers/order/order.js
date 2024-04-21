const express = require("express");
const router = express.Router();
const db = require("../../database/databasePG");

router
  .route("/")
  .get(async (req, res) => {
    console.log("working on GET........................");
    const { customer_email } = req.query;
    try {
      const currentDate = new Date();
      const current_date_string = currentDate.toISOString().slice(0, 10);

      const account_query = await db.query(
        "SELECT user_id FROM account WHERE email = $1",
        [customer_email]
      );

      const customer_id = account_query.rows[0].user_id;
      const orders = await db.query(
        "SELECT * FROM orders WHERE customer_id = $1",
        [customer_id]
      );

      for (const order of orders.rows) {
        if (
          (new Date() - new Date(current_date_string)) / (1000 * 60 * 60 * 24) <
          2
        ) {
          const order_status = "Ordered";

          const updateOrder = await db.query(
            "UPDATE orders SET order_status = $1 WHERE order_id = $2 ;",
            [order_status, order.order_id]
          );
        } else if (
          (new Date() - new Date(current_date_string)) / (1000 * 60 * 60 * 24) <
          4
        ) {
          const order_status = "Shipped";
          const updateOrder = await db.query(
            "UPDATE orders SET order_status = $1 WHERE order_id = $2 ;",
            [order_status, order.order_id]
          );
        } else if (
          (new Date() - new Date(current_date_string)) / (1000 * 60 * 60 * 24) <
          6
        ) {
          const order_status = "Out for Delivery";
          const updateOrder = await db.query(
            "UPDATE orders SET order_status = $1 WHERE order_id = $2 ;",
            [order_status, order.order_id]
          );
        } else {
          const order_status = "Delivered";
          const payment_status = "Paid";
          const updateOrder = await db.query(
            "UPDATE orders SET order_status = $1 WHERE order_id = $2 ;",
            [order_status, order.order_id]
          );
          const transaction = await db.query(
            "UPDATE transactions SET payment_status = $1 WHERE order_id = $2 ;",
            [payment_status, order.order_id]
          );
        }
      }

      res.json({ success: true, orders: orders.rows });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  })
  .post(async (req, res) => {
    console.log("working on POST........................");

    const {
      customer_email,
      product_id,
      product_image_address,
      product_name,
      product_description,
      quantity,
      unit_price,
      payment_method,
      card_number,
      card_cvv,
      card_expiry_date,
      upi_id,
      tax_rate,
      shipping_cost,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_zip_code,
      shipping_country,
      shipping_method,
    } = req.body;

    console.log(customer_email);

    const currentDate = new Date();
    const current_date_string = currentDate.toISOString().slice(0, 10);
    console.log(current_date_string);
    const order_status = "Shipped";
    let payment_status = "";

    if (payment_method === "card" || payment_method === "upi") {
      payment_status = "Paid";
    } else {
      payment_status = "Pending";
    }

    const dateIncreBy6 = new Date().setDate(currentDate.getDate() + 6);
    const dateIncreBy7 = new Date().setDate(currentDate.getDate() + 7);
    const estimated_delivery_date = new Date(dateIncreBy6)
      .toISOString()
      .slice(0, 10);
    const actual_delivery_date = new Date(dateIncreBy7)
      .toISOString()
      .slice(0, 10);
    console.log(estimated_delivery_date, actual_delivery_date);

    const total_price = unit_price * quantity;
    const tax_amount = (total_price * tax_rate) / 100;
    const final_price = total_price + tax_amount + shipping_cost;

    try {
      const account_query = await db.query(
        "SELECT user_id FROM account WHERE email = $1",
        [customer_email]
      );
      const customer_id = account_query.rows[0].user_id;

      const transaction = await db.query(
        "INSERT INTO transactions (transaction_date, customer_id, product_id, total_price, payment_method, payment_status, city, state, country, shipping_cost, tax_rate, tax_amount, card_number, card_cvv, card_expiry_date, upi_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;",
        [
          current_date_string,
          customer_id,
          product_id,
          (final_price * 100) / 1,
          payment_method,
          payment_status,
          shipping_city,
          shipping_state,
          shipping_country,
          (shipping_cost * 100) / 1,
          tax_rate,
          (tax_amount * 100) / 1,
          payment_method === "card" ? card_number : "",
          payment_method === "card" ? card_cvv : "",
          payment_method === "card" ? card_expiry_date : "1111-11-11",
          payment_method === "upi" ? upi_id : "",
        ]
      );

      const orderedItem = await db.query(
        "INSERT INTO orders ( customer_id ,product_id,  product_image_address, product_name, product_description, order_date ,transaction_id ,quantity ,unit_price ,shipping_address ,shipping_city ,shipping_state ,shipping_zip_code ,shipping_country ,shipping_method ,order_status ,estimated_delivery_date ,actual_delivery_date ) VALUES ( $1, $2 ,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING * ;",
        [
          customer_id,
          product_id,
          product_image_address,
          product_name,
          product_description,
          current_date_string,
          transaction.rows[0].transaction_id,
          quantity,
          (unit_price * 100) / 1,
          shipping_address,
          shipping_city,
          shipping_state,
          shipping_zip_code,
          shipping_country,
          shipping_method,
          order_status,
          estimated_delivery_date,
          actual_delivery_date,
        ]
      );

      // const updateItem = await db.query(
      //   "UPDATE items SET item_quantity = item_quantity - $1 WHERE item_id = $2 RETURNING *;",
      //   [quantity, product_id]
      // );

      res.status(201).json({
        transaction: transaction.rows[0],
        orderedItem: orderedItem.rows[0],
        // updateItem: updateItem.rows,
      });
    } catch (error) {
      res.status(400).json({ error: error.message, message: "backend error" });
      console.log({ error: error.message });
    }
  })
  .put(async (req, res) => {})
  .delete(async (req, res) => {
    console.log("working on DELETE........................");
    const { customer_id, order_id } = req.body;
    console.log(customer_id, order_id);
    const payment_status = "Refunded";

    try {
      const orderCancled = await db.query(
        "DELETE FROM orders WHERE customer_id = $1 AND order_id = $2 RETURNING * ",
        [customer_id, order_id]
      );
      console.log(orderCancled.rows[0]);
      const transaction = await db.query(
        "UPDATE transactions SET payment_status = $1 WHERE transaction_id = $2 RETURNING *",
        [payment_status, orderCancled.rows[0].transaction_id]
      );
      res.status(200).json({
        success: true,
        message: "orderCancled",
        orderCancled: orderCancled.rows,
        payment_status: transaction.rows[0].payment_status,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Can not find the Order",
        error: error.message,
      });
    }
  });

module.exports = router;

//Example data:-
// {
//   "card_cvv": "564",
//   "card_expiry_date": "2024-03-23",
//   "card_number": "1111 1111 1111 1111",
//   "customer_email": "adisawant454+leetcodesignup@gmail.com",
//   "payment_method": "card",
//   "product_id": "2eeb83ef-967a-453d-8261-1e43fe42e86d",
//   "quantity": 1,
//   "shipping_address": "JSPMS ICOER (Imperial college of engineering and research), Gat No: 720, 2, Nagar Rd, Wagholi, Pune, Maharashtra 412207",
//   "shipping_city": "Pune",
//   "shipping_cost": 70,
//   "shipping_country": "India",
//   "shipping_method": "Express",
//   "shipping_state": "Maharashtra",
//   "shipping_zip_code": "412207",
//   "tax_rate": 12,
//   "unit_price": 600,
//   "upi_id": ""
// }
