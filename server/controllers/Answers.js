import mongoose from "mongoose";
import Questions from "../models/Questions.js";
import User from "../models/auth.js"

// add an asnwer to specific question **************************************************

export const postAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { noOfAnswers, userAnswered, answerBody, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("Question unavailable!");
    }

    try {
        // Update the question with the new answer
        const updatedQuestion = await Questions.findByIdAndUpdate(
            _id,
            { 
                $addToSet: { answer: { answerBody, userAnswered, userId } },
                $inc: { noOfAnswers: 1 } // Increment `noOfAnswers` by 1
            },
            { new: true } // Return the updated document
        );

        // Reward the user with 5 points for answering
        await User.findByIdAndUpdate(
            userId,
            { $inc: { points: 5 } },
            { new: true }
        );

        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.log(error);
        res.status(500).json("Error adding answer");
    }
};


const updateNoOfAnswers = async(_id, noOfAnswers) => {
    try {
        await Questions.findByIdAndUpdate(_id, {$set: { noOfAnswers: noOfAnswers }});
    } catch (error) {
        console.log(error.message);
    }
}



// deleting a specific answer from a question ***************************************

export const deleteAnswer = async (req, res) => {
    const { id: _id } = req.params;
    const { noOfAnswers, answerId } = req.body;
    const userId = req.userId

    if (!mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(answerId)) {
        return res.status(404).json("Question unavailable!");
    }

    try {
        const question = await Questions.findByIdAndUpdate(
            _id,
            {$pull: { "answer": { _id: answerId } } ,
            $inc: { noOfAnswers: -1 }},
            { new: true }
        );

        // Deduct 5 points from user for answer deletion
        await User.findByIdAndUpdate(
            userId,
            { $inc: { points: -5 } },
            { new: true }
        );

        res.status(200).json({ message: "Answer deleted successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json("Error deleting answer");
    }
};


export const getBadges = async (req, res)=>{
    try {
        const id = req.params.id
        const user = await User.findOne({
            _id : id
        })
        res.status(200).json({
            badge : user.points
        })
    } catch (error) {
        console.log(error)
    }
}

export const transferPoints = async (req, res) => {
    const {toUserId, points } = req.body;
    const fromUserId = req.userId

    try {
        const fromUser = await User.findById(fromUserId);

        if (fromUser.points < 10) {
            return res.status(400).json("Insufficient points for transfer.");
        }

        // Deduct points from sender and add to recipient
        await User.findByIdAndUpdate(fromUserId, { $inc: { points: -points } }, { new: true });
        await User.findByIdAndUpdate(toUserId, { $inc: { points: points } }, { new: true });

        res.status(200).json("Points transferred successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).json("Error transferring points");
    }
};
