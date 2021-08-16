const router = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/signin", login);
router.post("/signup", createUser);
router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
