const router = require('express').Router();

const patientController = require('../controllers/patientController');
const checkAuth = require('../checkAuth');

router.post('/', patientController.create);
router.delete('/:patient_id', patientController.delete);

router.get('/app-count', checkAuth, patientController.appCountByDoctor);
router.get('/disease-count', patientController.diseaseCountByDoctor);
router.get('/:patient_id', patientController.find);
router.get('/', patientController.list);
router.put('/:patient_id', patientController.update);


module.exports = router;