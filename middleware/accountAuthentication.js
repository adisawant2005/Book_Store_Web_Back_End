const accountAuthentication = (req, res, next) => {
  const { user_email } = req.body;
  if (user_email !== "") return next();
  res
    .status(404)
    .json({
      success: false,
      authentication: "fail",
      message: "email is empty",
    });
};

module.exports = accountAuthentication;
