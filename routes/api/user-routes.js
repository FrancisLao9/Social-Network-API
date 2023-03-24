const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/user');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

// /friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;