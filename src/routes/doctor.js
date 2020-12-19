const router = require('express').Router();

const doctorController = require('../controllers/doctorController');

router.get('/:doctor_id', doctorController.find);
router.get('/', doctorController.list);
router.post('/', doctorController.create);
router.delete('/:doctor_id', doctorController.delete);
router.put('/:doctor_id', doctorController.update);


module.exports = router;