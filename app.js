const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const dotenv = require("dotenv");
dotenv.config();

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

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", auth, userRouter);
app.use("/", auth, cardRouter);
app.use((req, res) => {
  res.status(404).send({ message: "Роутер не найден" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
