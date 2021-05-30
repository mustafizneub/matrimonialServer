const express = require('express');

const router = express.Router();
const conversation = require('../model/messageModel');

router.post('/create-conversation', async (req, res, next) => {
    try {
        req.body.messages.userID = req.body.from;
        await conversation.findOne({ roomID: req.body.from.concat(req.body.to) || req.body.to.concat(req.body.from) }, async (err, doc) => {
            if (err) {
                next(err)
            }
            if (doc) {
                await conversation.updateOne(
                    { _id: doc._id },
                    { $push: { messages: req.body.messages } },
                    (err, resp) => {
                        if (err) {
                            next(err)
                        }
                        res.status(200).json({
                            statusCode: 200,
                            message: 'Successfully updated',
                            body: resp
                        })

                    }
                )
            } else {
                console.log('body', req.body)
                const doc = new conversation(req.body);
                doc.roomID = req.body.from.concat(req.body.to)
                console.log(doc)
                await doc.save(function (err) {
                    console.log(err)
                    if (err) next(err)
                    res.status(201).json({
                        statusCode: 201,
                        message: 'Successfully added',
                        body: doc
                    })
                })
            }
        })
    } catch (err) {

        next(err)
    }




})

router.get('/conversation/:userId', async (req, res, next) => {
    try {
        await conversation.aggregate([
            {
                $match: { from: req.params.userId },
                $lookup: {

                    from: "conversation",
                    localField: "from",
                    foreignField: "_id",
                    as: "userInfo"

                }
            }
        ]).exec(err, result => {
            if (err) {
                next(err)
            }
            res.status(200).json({
                statusCode: 200,
                message: 'Successfully added',
                body: result
            })
        })
    } catch (err) {
        next(err)
    }

})

router.get('/message/:conversationId', async (req, res, next) => {
    try {
        await conversation.findById(req.params.conversationId, (err, doc) => {
            if (err) {
                next(err)
            }
            res.status(200).json({
                statusCode: 200,
                message: 'read successfully',
                body: doc
            })
        })
    } catch (err) {
        next(err)
    }

})

router.delete('/delete-conversation/:id', async (req, res, next) => {
    try {
        await conversation.deleteOne({ _id: req.params.id }, (err) => {
            if (err) {
                console.log(err)
                next(err)
            }
            res.status(200).json({
                statusCode: 200,
                message: 'Deleted successfully',
            })
        })
    } catch (err) {
        next(err)
    }

})

router.post('block-user/:userId', async (req, res, next) => {
    try {
        await conversation.updateOne(
            { _id: req.params.userId },
            {
                $set: {
                    blocked: req.body.blocked
                }
            },
            (err, res) => {
                if (err) {
                    next(err)
                }
                res.status(200).json({
                    statusCode: 200,
                    message: req.body.blocked == 0 ? 'user unblocked successfully' : 'user blocked successfully',
                    body: res
                })
            }
        )
    } catch (err) {
        next(err)
    }

})

module.exports = router

