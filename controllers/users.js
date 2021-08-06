const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: "Нет пользователей" });
        return;
      }
      res.send({ data: users });
    })
    .catch((err) => res.status(400).send({ message: err.message }));
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
    .catch((err) => res.status(400).send({ message: err.message }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  console.log(userId);
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(400).send({ message: err.message }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
