const router = require('express').Router();

const personController = require('../controllers/personController');

router.get('/:tc_no', personController.find);
router.get('/', personController.list);
router.post('/', personController.create);
router.delete('/:tc_no', personController.delete);
router.put('/:tc_no', personController.update);


module.exports = router;