const { Router } = require('express');
const participantesController = require('../controllers/participantesController');

const router = Router();

router.get('/', participantesController.getParticipantes);
router.post('/', participantesController.postParticipante);
router.delete('/:id', participantesController.deleteParticipante);

module.exports = router;
