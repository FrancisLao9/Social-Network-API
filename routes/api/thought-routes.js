const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require('../../controllers/thought');

// /api/thoughts
router.route('/').get(getThoughts).post(createThought);
// :thoughtId
router.route('/:thoughtId').get(getSingleThought).put(updateThought).delete(deleteThought);
// :reactions
router.route('/:thoughtId/reactions').post(addReaction);
// :reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;