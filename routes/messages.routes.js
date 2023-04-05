var express = require("express")
var router = express.Router()

const { getAll, getAllFromMatch, sendMessage } = require("../controllers/message.controller")

router.route('/').get(getAll)
router.route('/all/:matchid').get(getAllFromMatch)
router.route('/send').post(sendMessage)

module.exports = router