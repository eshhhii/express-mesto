const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "61090f7d9449ec1124df30d7",
  };

  next();
});

app.use("/", userRouter);
app.use("/", cardRouter);
app.use((req, res) => {
  res.status(404).send({ message: "Роутер не найден" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
