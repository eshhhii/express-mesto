const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const {
  validationLogin,
  validationCreateUser,
} = require("./middlewares/validation");
const { NotFound } = require("./middlewares/validation");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());
app.use(cookieParser());

app.post("/signin", validationLogin, login);
app.post("/signup", validationCreateUser, createUser);

app.use("/", auth, userRouter);
app.use("/", auth, cardRouter);
app.use((req, res) => {
  throw new NotFound("Роутер не найден");
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});
app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
