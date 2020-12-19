const router = require('express').Router();

const hospitalController = require('../controllers/hospitalController');


router.post('/', hospitalController.create);
router.delete('/:hospital_id', hospitalController.delete);

router.get('/:hospital_id', hospitalController.find);
router.get('/', hospitalController.list);
router.put('/:hospital_id', hospitalController.update);

module.exports = router;