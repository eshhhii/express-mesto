const router = require("express").Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");
const {
  validationUpdateAvatar,
  validationUpdateProfile,
  validationUserId,
} = require("../middlewares/validation");

router.get("/users", getUsers);
router.get("/users/me", validationUserId, getCurrentUser);
router.get("/users/:id", getUser);
router.patch("/users/me", validationUpdateProfile, updateProfile);
router.patch("/users/me/avatar", validationUpdateAvatar, updateAvatar);

module.exports = router;
