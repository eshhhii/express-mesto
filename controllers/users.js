const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Пользователь не найден" });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message:
            "Переданы некорректные данные в методы получения пользователя",
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({
      message: "Email или пароль могут быть пустыми",
    });
  } else {
    bcrypt.hash(password, 10).then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
        .then((user) => res.status(200).send({ data: user }))
        .catch((err) => {
          if (err.name === "ValidationError") {
            res.status(400).send({
              message:
                "Переданы некорректные данные в методы создания пользователя",
            });
          } else {
            res.status(500).send({ message: err.message });
          }
        });
    });
  }
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные в методы обновления профиля",
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные в методы обновления аватара",
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({
      message: "Email или пароль могут быть пустыми",
    });
  } else {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: "Пользователь не найден" });
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }
        res.send({ data: user });
        return bcrypt.compare(password, user.password);
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(401).send({
            message: "Переданы некорректные данные в методы обновления профиля",
          });
        } else {
          res.status(500).send({ message: err.message });
        }
      });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
