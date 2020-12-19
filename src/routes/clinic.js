const router = require('express').Router();

const clinicController = require('../controllers/clinicController');


router.post('/', clinicController.create);
router.delete('/:clinic_id', clinicController.delete);

router.get('/:clinic_id', clinicController.find);
router.get('/', clinicController.list);
router.put('/:clinic_id', clinicController.update);

module.exports = router;