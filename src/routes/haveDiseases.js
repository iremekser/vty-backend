const router = require('express').Router();

const haveDiseasesController = require('../controllers/haveDiseasesController');


router.post('/', haveDiseasesController.create);
router.delete('/', haveDiseasesController.delete);

// router.get('/:have_diseases_id', haveDiseasesController.find);
router.get('/', haveDiseasesController.list);
router.put('/', haveDiseasesController.update);

module.exports = router;