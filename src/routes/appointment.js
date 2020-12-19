const router = require('express').Router();

const appointmentController = require('../controllers/appointmentController');


router.post('/', appointmentController.create);
router.delete('/:appointment_id', appointmentController.delete);

router.get('/:appointment_id', appointmentController.find);
router.get('/', appointmentController.list);
router.put('/:appointment_id', appointmentController.update);

module.exports = router;