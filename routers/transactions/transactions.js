const express = require("express");
const router = express.Router();
const pool = require("../../database/databasePG");

router
  .route("/")
  .get((req, res) => {
    res.json({ message: "Wellcome" });
  })
  .post((req, res) => {})
  .put((req, res) => {})
  .delete((req, res) => {});

module.exports = router;
