const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    console.log(req.cookies.jwt);
    next(res.status(401).send({ message: "Авторизация не прошла" }));
  } else {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, "secret-key");
    } catch (err) {
      next(res.status(401).send({ message: "Авторизация не прошла" }));
    }
    req.user = payload;

    next();
  }
};

module.exports = auth;
