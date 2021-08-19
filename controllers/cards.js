const Card = require("../models/card");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest(
          "Переданы некорректные данные в методы создания карточки"
        );
      } else {
        res.status(500).send({ message: err.message });
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findOneAndRemove({ owner: req.user._id, _id: req.params.id })
    .then((card) => {
      if (!card) {
        throw new NotFound("Карточка не найдена");
      }
      return res.status(200).send("Карточка удалена");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest(
          "Переданы некорректные данные в методы удалении карточки"
        );
      } else {
        res.status(500).send({ message: err.message });
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        throw new NotFound("Нет данных");
      }
      return res.status(200).send("Лайк поставлен");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Переданы некорректные данные для лайка");
      } else {
        res.status(500).send({ message: err.message });
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        throw new NotFound("Нет данных");
      }
      return res.status(200).send("Лайк убран");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Переданы некорректные данные для удаления лайка");
      } else {
        res.status(500).send({ message: err.message });
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
