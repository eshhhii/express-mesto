const Card = require("../models/card");
const BadRequest = require("../errors/BadRequest");
const NotFound = require("../errors/NotFound");
const Forbidden = require("../errors/Forbidden");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest(
          "Переданы некорректные данные в методы создания карточки",
        );
      } else {
        next(err);
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound("Карточка не найдена");
      }
      if (userId !== String(card.owner)) {
        throw new Forbidden("Недостаточно прав");
      }
      Card.findOneAndRemove(cardId)
        .then((currentCard) => {
          if (!currentCard) {
            throw new NotFound("Карточка не найдена");
          }
          return res.status(200).send({ message: "Карточка удалена" });
        })
        .catch((err) => {
          if (err.name === "CastError") {
            throw new BadRequest(
              "Переданы некорректные данные в методы удалении карточки",
            );
          } else {
            next(err);
          }
        })
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        throw new NotFound("Нет данных");
      }
      return res.status(200).send({ massege: "Лайк поставлен" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Переданы некорректные данные для лайка");
      } else {
        next(err);
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        throw new NotFound("Нет данных");
      }
      return res.status(200).send({ message: "Лайк убран" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequest("Переданы некорректные данные для удаления лайка");
      } else {
        next(err);
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
