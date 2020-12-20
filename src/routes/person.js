const router = require('express').Router();
const checkAuth = require('../checkAuth');

const personController = require('../controllers/personController');

router.post('/login', checkAuth, personController.login);
router.get('/:tc_no', checkAuth, personController.find);
router.get('/', checkAuth, personController.list);
router.post('/', personController.register);
router.delete('/:tc_no', checkAuth, personController.delete);
router.put('/:tc_no', checkAuth, personController.update);


module.exports = router;