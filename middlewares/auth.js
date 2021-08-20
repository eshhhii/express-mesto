const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    console.log(req.cookies.jwt);
    next("Авторизация не прошла");
  } else {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, "secret-key");
    } catch (err) {
      next("Авторизация не прошла");
    }
    req.user = payload;

    next();
  }
};

module.exports = auth;
