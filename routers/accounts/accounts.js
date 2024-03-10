const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../../database/databasePG");
require("dotenv").config();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads"));
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
      const { email, password } = req.body;

      const result = await db.query(
        "SELECT * FROM account WHERE email = $1 AND password = $2",
        [email, password]
      );

      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    } catch (error) {
      console.error("Error during account retrieval:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post(upload.single("avatar"), async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    try {
      // Destructure data from req.body
      const {
        email,
        password,
        firstName,
        lastName,
        age,
        gender,
        country,
        city,
        streetAddress,
        postalCode,
        phoneNumber,
        birthdate,
      } = req.body;

      const imageFileAddress =
        req.file &&
        req.file.fieldname &&
        process.env.UPLOAD_PAGE + req.file.filename;

      try {
        const result = await db.query(
          "INSERT INTO account (email, password, first_name, last_name, age, gender, country, city, street_address, postal_code, phone_number, birthdate, profile_picture_address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
          [
            email,
            password,
            firstName,
            lastName,
            age,
            gender,
            country,
            city,
            streetAddress,
            postalCode,
            phoneNumber,
            birthdate,
            imageFileAddress,
          ]
        );

        res.status(201).json({
          success: true,
          message: "Account created successfully!",
          result: result.rows[0],
        });
      } catch (error) {
        console.error("Error:", error);

        // duplicate key violation (code 23505)
        if (error.code === "23505") {
          return res.status(208).json({
            success: false,
            message: "Account already created successfully!",
            error: error.message,
          });
        }

        res.status(500).json({
          success: false,
          error: "Internal Server Error",
          errorMessage: error.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);

      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        errorMessage: error.message,
      });
    }
  })
  .put(async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        age,
        gender,
        country,
        city,
        streetAddress,
        postalCode,
        phoneNumber,
        birthdate,
        profilePicture,
      } = req.body;

      const result = await db.query(
        `UPDATE account
       SET
         first_name = $1,
         last_name = $2,
         age = $3,
         gender = $4,
         country = $5,
         city = $6,
         street_address = $7,
         postal_code = $8,
         phone_number = $9,
         birthdate = $10,
         profile_picture_address = $11
       WHERE
        email = $12 AND password = $13
       RETURNING *`,
        [
          firstName,
          lastName,
          age,
          gender,
          country,
          city,
          streetAddress,
          postalCode,
          phoneNumber,
          birthdate,
          profilePicture,
          email,
          password,
        ]
      );

      const updated = await db.query(
        "SELECT * FROM account WHERE email = $1 AND password = $2",
        [email, password]
      );

      if (updated.rows.length > 0) {
        res.status(200).json({
          message: "Account updated successfully!",
          dataUpdated: updated.rows[0],
        });
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    } catch (error) {
      console.error("Error:", error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .delete(async (req, res) => {
    try {
      const { email, password } = req.body;

      const result = await db.query(
        "DELETE FROM account WHERE email = $1 AND password = $2 RETURNING *",
        [email, password]
      );

      if (result.rows.length > 0) {
        res.status(200).json({ message: "Account deleted successfully!" });
      } else {
        res.status(404).json({ error: "Account not found" });
      }
    } catch (error) {
      console.error("Error during account deletion:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;

// Dummy data:-
// {
//   "email": "adisawant@gmail.com",
//   "password": "12345678",
//   "firstName": "Aditya",
//   "lastName": "Sawant",
//   "age": 19,
//   "gender": "male",
//   "country": "India",
//   "city": "Pune",
//   "streetAddress": "Sant Nagar, Lohegaon, Pune, 411047",
//   "postalCode": "411047",
//   "phoneNumber": "9623822469",
//   "birthdate": "14/02/2005",
//   "profilePicture": "/images/blueBird.jsg"
// }
