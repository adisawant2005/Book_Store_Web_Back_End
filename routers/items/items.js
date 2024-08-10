const express = require("express");
const router = express.Router();
const db = require("../../database/databasePG");
const path = require("path");
require("dotenv").config();
const accountAuthentication = require("../../middleware/accountAuthentication");
const multer = require("multer");
const { error } = require("console");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/items-images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router
  .route("/")
  .get(async (req, res) => {
    const { user_email, user_password } = req.query;
    try {
      if (user_email) {
        const user = await db.query(
          "SELECT * FROM account WHERE email = $1 AND password = $2",
          [user_email, user_password]
        );
        if (user.rows.length > 0) {
          const user_items = await db.query(
            "SELECT * FROM items WHERE item_seller_id = $1",
            [user.rows[0].user_id]
          );
          console.log({ userLogged: true, body: user_items.rows });
          res.status(200).json(user_items.rows);
        } else {
          res.status(404).json({ error: "User not found" });
        }
      } else {
        const result = await db.query("SELECT * FROM items");
        console.log({ userLogged: false, body: result.rows });
        res.json(result.rows);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(
    accountAuthentication,
    upload.single("item_image"),
    async (req, res) => {
      const {
        user_email,
        user_password,
        item_name,
        item_description,
        item_price,
        item_category,
        item_quantity,
      } = req.body;

      const itemImageAddress =
        req.file &&
        req.file.fieldname &&
        process.env.UPLOAD_PAGE + process.env.ITEMS_PAGE + req.file.filename;

      // Default data:-
      const item_rating = 3;
      const item_reviews = 50;

      try {
        if (user_email) {
          const user = await db.query(
            "SELECT user_id FROM account WHERE email = $1 AND password = $2",
            [user_email, user_password]
          );

          const item_seller_id = user.rows[0] && user.rows[0].user_id;

          if (item_seller_id) {
            const result = await db.query(
              " INSERT INTO items (item_name, item_description, item_price, item_category, item_rating, item_reviews, item_image_url, item_seller_id, item_quantity) VALUES ( $1, $2, $3, $4, $5, $6, $7,$8, $9 ) RETURNING *;",
              [
                item_name,
                item_description,
                item_price,
                item_category,
                item_rating,
                item_reviews,
                itemImageAddress,
                item_seller_id,
                item_quantity,
              ]
            );

            res.json(result.rows[0]);
          } else {
            res.status(404).json({ error: "User not found" });
          }
        } else {
          res.json({ success: false, message: "Please provide the email" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  )
  .put(accountAuthentication, upload.single("item_image"), async (req, res) => {
    const {
      user_email,
      user_password,
      item_id,
      item_name,
      item_description,
      item_price,
      item_category,
      item_quantity,
    } = req.body;

    const itemImageAddress =
      req.file &&
      req.file.fieldname &&
      process.env.UPLOAD_PAGE + process.env.ITEMS_PAGE + req.file.filename;

    // Default data:-
    const item_rating = 3;
    const item_reviews = 50;

    try {
      if (user_email) {
        const user = await db.query(
          "SELECT user_id FROM account WHERE email = $1 AND password = $2",
          [user_email, user_password]
        );

        const item_seller_id = user.rows[0] && user.rows[0].user_id;

        if (item_seller_id) {
          const result = await db.query(
            "UPDATE items SET item_name = $1, item_description = $2, item_price = $3, item_category = $4, item_rating = $5, item_reviews = $6, item_image_url =  CASE WHEN $7 THEN $8 ELSE item_image_url END, item_seller_id = $9, item_quantity = $10 WHERE item_id = $11 RETURNING *;",
            [
              item_name,
              item_description,
              item_price,
              item_category,
              item_rating,
              item_reviews,
              itemImageAddress ? true : false,
              itemImageAddress,
              item_seller_id,
              item_quantity,
              item_id,
            ]
          );

          if (result.rows[0]) {
            res.json({
              success: true,
              message: "item updated",
              data: result.rows,
            });
          } else {
            res.json({
              success: false,
              message: "item not found",
              data: result.rows,
            });
          }
        } else {
          res.status(404).json({ error: "User not found" });
        }
      } else {
        res.json({ success: false, message: "Please provide the email" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    const { item_id, user_email, user_password } = req.body;
    console.log({ item_id, user_email, user_password });
    try {
      if (user_email) {
        const user = await db.query(
          "SELECT user_id FROM account WHERE email = $1 AND password = $2",
          [user_email, user_password]
        );

        const item_seller_id = user.rows[0] && user.rows[0].user_id;

        if (item_seller_id) {
          const result = await db.query(
            "DELETE FROM items WHERE item_id = $1 RETURNING *;",
            [item_id]
          );

          if (result.rows.length !== 0) {
            res.json({
              success: true,
              message: "item deleted",
              data: result.rows,
            });
          } else {
            res.json({
              success: false,
              message: "item not found",
              data: result.rows,
            });
          }
        } else {
          res.status(404).json({ success: false, message: "User not found" });
        }
      } else {
        res.json({ success: false, message: "Please provide the email" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log({ error: error.message });
    }
  });

router
  .route("/search-items")
  .get(async (req, res) => {
    const { search_text } = req.query;

    try {
      const result = await db.query("SELECT * FROM items");
      const items = result.rows;
      if (search_text === "") {
        res.json({ search_text: search_text, items: items });
      } else if (search_text !== "") {
        const textLength = search_text.length;
        const foundItems = items.filter((item) =>
          search_text
            .toLowerCase()
            .includes(item.item_name.slice(0, textLength).toLowerCase())
        );

        res.json({ search_text: search_text, items: foundItems });
      } else {
        res.json({ error: "search_items is not defined" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {})
  .delete(async (req, res) => {});

module.exports = router;

// Dummy data:-
// {
//     "item_id": "7eec2196-f55c-4841-bf78-15e09aa9bb27",
//     "item_name": "Book_Name",
//     "item_description": "Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.\n\nWhen the blazing sun is gone,\nWhen he nothing shines upon,\nThen you show your little light,\nTwinkle, twinkle, all the night.",
//     "item_price": 800,
//     "item_category": "Horror",
//     "item_rating": 4,
//     "item_reviews": 860,
//     "item_image_url": "http://localhost:3000/Items-images/atlas.jpg",
//     "item_seller_id": "618b5735-9b1b-4b0c-bc6b-0f4d7b00434f"
//   }

// {
//   "item_id": "7eec2196-f55c-4841-bf78-15e09aa9bb27",
//   "reduced_quantity": 2
// }
