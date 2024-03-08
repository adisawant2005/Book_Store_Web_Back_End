const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const {
  routeItems,
  routeAccounts,
  routeTransactions,
} = require("./routers/router");

app.use(logger);
app.use(express.static("public"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app
  .route("/")
  .get((req, res) => {
    res.json({ message: "Wellcome" });
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

function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}
