var express = require('express');
const typeController = require('../controller/type')
const { isAuth } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/types', typeController.getTypes)
router.post('/type', isAuth, typeController.createType)
router.delete('/type/:typeId', isAuth, typeController.deleteType)
router.patch('/type/:typeId', isAuth, typeController.editType)

module.exports = router;
