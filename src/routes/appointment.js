const router = require('express').Router();

const appointmentController = require('../controllers/appointmentController');


router.post('/', appointmentController.create);
router.delete('/:appointment_id', appointmentController.delete);
router.put('/:appointment_id/cancel', appointmentController.cancel);

router.get('/', appointmentController.list);
router.get('/:appointment_id', appointmentController.find);
router.put('/:appointment_id', appointmentController.update);

module.exports = router;