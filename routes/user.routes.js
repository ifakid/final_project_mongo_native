const express = require("express")
const router = express.Router()

const { addUser, editUser, getRandom, getUser, updateLocation,  } = require("../controllers/user.controller")

router.route("/random").get(getRandom)
router.route("/").post(addUser)
router.route("/").patch(editUser)
router.route("/:id").get(getUser)
router.route("/location").patch(updateLocation)

module.exports = router