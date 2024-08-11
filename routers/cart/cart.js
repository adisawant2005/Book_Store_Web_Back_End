const express = require("express");
const router = express.Router();
const db = require("../../database/databasePG");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const { customer_email } = req.query;
      console.log(customer_email);
      const account_query = await db.query(
        "SELECT user_id FROM account WHERE email = $1",
        [customer_email]
      );
      const user_id = account_query.rows[0].user_id;
      const items = await db.query(
        "SELECT * FROM cart WHERE customer_id = $1",
        [user_id]
      );
      const result = items.rows.map((item) => {
        return {
          product_id: item.product_id,
          customer_email: customer_email,
          quantity: item.quantity,
        };
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { customer_email, product_id, quantity } = req.body;
      console.log({ customer_email, product_id, quantity });

      const item_query = await db.query(
        "SELECT item_quantity  FROM items WHERE item_id = $1",
        [product_id]
      );
      const item_quantity = item_query.rows[0].item_quantity;
      if (item_quantity >= quantity) {
        const account_query = await db.query(
          "SELECT user_id FROM account WHERE email = $1",
          [customer_email]
        );
        const user_id = account_query.rows[0].user_id;

        const cart_item = await db.query(
          "SELECT * FROM cart WHERE product_id = $1 AND customer_id = $2",
          [product_id, user_id]
        );
        console.log(quantity);

        if (
          cart_item.rows.length > 0 &&
          parseInt(cart_item.rows[0].quantity + parseInt(quantity)) <=
            item_quantity
        ) {
          const cartItem = await db.query(
            "UPDATE cart SET quantity = $1 WHERE product_id = $2 AND customer_id = $3 RETURNING *",
            [
              parseInt(cart_item.rows[0].quantity + parseInt(quantity)),
              product_id,
              user_id,
            ]
          );
          const result = {
            success: true,
            email: customer_email,
            product_id: cartItem.rows[0].product_id,
            quantity: cartItem.rows[0].quantity,
          };
          res.json(result);
          console.log(result, "updated");
        } else if (cart_item.rows.length > 0) {
          const result = {
            success: false,
            message: "cart quantity excided",
            email: customer_email,
            product_id: product_id,
            quantity: cart_item.rows[0].quantity,
          };
          res.json(result);
          console.log(result, "updated");
        } else {
          const cartItem = await db.query(
            "INSERT INTO cart (product_id, customer_id, quantity) VALUES ($1, $2, $3) RETURNING *",
            [product_id, user_id, quantity]
          );
          const result = {
            success: true,
            email: customer_email,
            product_id: cartItem.rows[0].product_id,
            quantity: cartItem.rows[0].quantity,
          };
          console.log(result);
          res.json(result);
          console.log("added");
        }
      } else {
        res.json({ success: false, message: "Not enough stock" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .put(async (req, res) => {})
  .delete(async (req, res) => {
    try {
      const { customer_email, product_id, delete_all = false } = req.body;
      console.log({ customer_email: customer_email, product_id: product_id });
      console.log(req.body);
      const account_query = await db.query(
        "SELECT user_id FROM account WHERE email = $1",
        [customer_email]
      );
      console.log(account_query.rows);
      const user_id = account_query.rows[0].user_id;
      if (delete_all) {
        const deletedItem = await db.query(
          "DELETE FROM cart WHERE customer_id = $1",
          [user_id]
        );
        const result = {
          customer_email: customer_email,
          deleted_all: true,
        };
        console.log(result);
        res.json(result);
      } else {
        const deletedItem = await db.query(
          "DELETE FROM cart WHERE product_id = $1 AND customer_id = $2 RETURNING *",
          [product_id, user_id]
        );
        if (deletedItem.rows[0]) {
          const result = {
            customer_email: customer_email,
            product_id: deletedItem.rows[0].product_id,
            deleted: true,
          };
          console.log(result);
          res.json(result);
        } else {
          const result = {
            message: "item is not there",
            customer_email: customer_email,
            product_id: product_id,
            deleted: false,
          };
          console.log(result);
          res.json(result);
        }
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;

// Dummy data :-
// {
//   "product_id": "7eec2196-f55c-4841-bf78-15e09aa9bb27",
//   "customer_email": "adisawant454+leetcodesignup@gmail.com",
//   "quantity": 4
// }
