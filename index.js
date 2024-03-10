const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;
const {
  routeItems,
  routeAccounts,
  routeTransactions,
} = require("./routers/router");

app.use(require("./middleware/logger.middleware"));
app.use(require("./middleware/errorHandler.middleware"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");

app
  .route("/")
  .get((req, res) => {
    res.render("./ejsFiles/deleteme.ejs");
  })
  .post((req, res) => {
    const { description } = req.body;
    res.json({ description: description });
  })
  .put((req, res) => {})
  .delete((req, res) => {});

app.use("/items", routeItems);
app.use("/accounts", routeAccounts);
app.use("/transactions", routeTransactions);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
