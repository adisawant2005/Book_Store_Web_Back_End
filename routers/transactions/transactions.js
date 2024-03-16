const express = require("express");
const router = express.Router();
const db = require("../../database/databasePG");

router
  .route("/")
  .get((req, res) => {
    res.json({ message: "Wellcome to get" });
  })
  .post((req, res) => {
    res.json({ message: "Wellcome to post" });
  })
  .put((req, res) => {
    res.json({ message: "Wellcome to put" });
  })
  .delete((req, res) => {
    res.json({ message: "Wellcome to delete" });
  });

module.exports = router;
