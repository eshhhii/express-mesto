const router = require("express").Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.get("/users/me", getCurrentUser);
router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
