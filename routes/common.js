var express = require('express');
const commonController = require('../controller/common')
const { isAdmin, isUser } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/pageList/:featureName', commonController.getPageListItem)

module.exports = router;
