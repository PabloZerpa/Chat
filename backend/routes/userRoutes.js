
const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  prueba,
} = require("../controllers/userControllers");
//const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(allUsers);
router.route("/").post(registerUser);
//router.route("/").post(prueba);
router.post("/login", authUser);

module.exports = router;