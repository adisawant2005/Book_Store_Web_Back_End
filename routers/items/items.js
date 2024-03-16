const express = require("express");
const router = express.Router();
const db = require("../../database/databasePG");
const path = require("path");
require("dotenv").config();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/Items-images"));
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
    try {
      const result = await db.query("SELECT * FROM items");
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    res.json({ message: "Wellcome to post" });
  })
  .put(async (req, res) => {
    const { item_id, reduced_quantity } = req.body;
    try {
      console.log({ item_id: item_id, reduced_quantity: reduced_quantity });
      const item_query = await db.query(
        "SELECT * FROM items  WHERE item_id = $1",
        [item_id]
      );
      console.log(item_query.rows[0]);
      if (item_query.rows[0].item_quantity >= reduced_quantity) {
        const quantity_after_reduction =
          parseInt(item_query.rows[0].item_quantity) -
          parseInt(reduced_quantity);
        console.log(quantity_after_reduction);
        const result = await db.query(
          "UPDATE items SET item_quantity = $2 WHERE item_id = $1 RETURNING *",
          [item_id, quantity_after_reduction]
        );
        console.log(result.rows[0]);
        res.json({
          success: true,
          message: "quantity updated",
          data: result.rows[0],
        });
      } else {
        res.status(304).json({
          success: false,
          message: "quantity not updated",
          data: item_query.rows[0],
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    res.json({ message: "Wellcome to delete" });
  });
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
