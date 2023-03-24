const {User, Thought} = require('../models');

module.exports = {
    //Get All Users
    getUsers(req, res) {
        User.find().select('-__v')
        .then((dbUserData) => {
            res.json(dbUserData);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Get Single User By ID
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId})
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user found (Single User)'});
            }
            res.json(dbUserData);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Create New User
    createUser(req, res) {
        User.create(req.body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(500).json(err));
    },
    //Update User
    updateUser(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            { $set: req.body },
            {
                runValidators: true,
                new: true,
            }
        ).then((dbUserData) => {
            if(!dbUserData) {
                return res.status(404).json({ message: 'No user found (UpdateUser)'});
            }
            res.json(dbUserData);
        });
    },
    //Delete User
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId})
            .then((dbUserData) => {
                if(!dbUserData) {
                    return res.status(404).json({message: 'No User Found (DeleteUser)'});
                }
            }).then(() => {
                res.json({message: 'User Deleted'});
            }).catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    //Add Friend
    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: {friends: req.params.friendId}}, {new: true})
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No User with this ID (addFriend)'});
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Remove Friend
    removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId }}, { new: true})
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No User with this ID (removeFriend)'});
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
    }
};