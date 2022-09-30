var express = require('express');
const typeController = require('../controller/type')
const { isAdmin } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/types', typeController.getTypes)
router.post('/type', isAdmin, typeController.createType)
router.delete('/type/:typeId', isAdmin, typeController.deleteType)
router.patch('/type/:typeId', isAdmin, typeController.editType)

module.exports = router;
