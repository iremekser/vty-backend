const router = require('express').Router();

const patientController = require('../controllers/patientController');


router.post('/', patientController.create);
router.delete('/:patient_id', patientController.delete);

router.get('/:patient_id', patientController.find);
router.get('/', patientController.list);
router.put('/:patient_id', patientController.update);

module.exports = router;