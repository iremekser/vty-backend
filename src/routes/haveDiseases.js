const router = require('express').Router();

const haveDiseasesController = require('../controllers/haveDiseasesController');


router.post('/', haveDiseasesController.create);
router.delete('/:have_diseases_id', haveDiseasesController.delete);

router.get('/:have_diseases_id', haveDiseasesController.find);
router.get('/', haveDiseasesController.list);
router.put('/:have_diseases_id', haveDiseasesController.update);

module.exports = router;