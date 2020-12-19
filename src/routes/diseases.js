const router = require('express').Router();

const diseasesController = require('../controllers/diseasesController');

router.get('/:diseases_id', diseasesController.find);
router.get('/', diseasesController.list);
router.post('/', diseasesController.create);
router.delete('/:diseases_id', diseasesController.delete);
router.put('/:diseases_id', diseasesController.update);


module.exports = router;