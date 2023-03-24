const { Thought, User } = require('../models');

module.exports = {
    //Get All Thoughts
    getThoughts(req, res) {
        Thought.find().sort({ createdAt: -1 })
        .then((dbThoughtData) => {
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Get Single Thought By ID
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({message: 'No Thought with This ID (SingleThoughtID)'});
            }
            res.json(dbThoughtData);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Create Thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((dbThoughtData) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: dbThoughtData._id }},
                { new: true }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'Thought Created But No User with ID'});
            }
            res.json({ message: 'Thought Created'});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Update Thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $set: req.body}, 
            { runValidators: true, new: true }
        ).then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: "No Thought with ID (updateThought)"});
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Delete Thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId})
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({message: 'No Thought with ID (deleteThought)'});
            }
            //Remove ID from User's Thoughts
            return User.findOneAndUpdate(
                {thoughts: req.params.thoughtId},
                {$pull: {thoughts: req.params.thoughtId}},
                {new: true}
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'Thought created without User'});
            }
            res.json({message: 'Thought Deleted'});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Add Reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No ThoughtID Found (addReaction)'})
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //Remove Reaction
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: { reactionId: req.params.reactionId} }},
            { runValidators: true, new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No Thought ID (removeReaction)'});
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    }
};