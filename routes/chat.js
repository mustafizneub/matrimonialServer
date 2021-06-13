const express = require('express');
const { ObjectID } = require('mongodb');
const router = express.Router();
const conversation = require('../model/messageModel');

router.post('/create-conversation', async (req, res, next) => {
    try {
        req.body.messages.userID = req.body.from;
        const Conversation = await conversation.findOne({ roomID: { $in: [req.body.from.concat(req.body.to), req.body.to.concat(req.body.from)] } });
        let resp;
        console.log(Conversation)
        if (Conversation !== null) {
            await Conversation.updateOne({ $push: { messages: req.body.messages } });
            // resp = await conversation.findOne({ roomID: { $in: [req.body.from.concat(req.body.to), req.body.to.concat(req.body.from)] } }).lean();
            resp = await conversation.aggregate([
                {
                    $match: { _id: ObjectID(Conversation._id) }
                },
                {
                    $lookup: {

                        from: "users",
                        localField: (req.query.userID == req.body.to)? "to":"from",
                        foreignField: "_id",
                        as: "userInfo"

                    }
                },
                {
                    $unwind: { path: '$userInfo' }
                },
                {
                    $project: { _id: 1, messages: 1, roomID: 1, "fname": '$userInfo.fname', "userID": '$userInfo._id', "email": '$userInfo.email' }
                }
            ])
            return res.status(200).json({
                statusCode: 200,
                message: 'Successfully updated',
                body:resp[0]
                // body: Object.assign(req.body.messages, { date: new Date().toISOString() })
            })
        } else {
            data = await conversation.create({ ...req.body, roomID: req.body.from.concat(req.body.to) })
            resp = await conversation.aggregate([
                {
                    $match: { _id: ObjectID(data._id) }
                },
                {
                    $lookup: {

                        from: "users",
                        localField: "from",
                        foreignField: "_id",
                        as: "userInfo"

                    }
                },
                {
                    $unwind: { path: '$userInfo' }
                },
                {
                    $project: { _id: 1, messages: 1, roomID: 1, "fname": '$userInfo.fname', "userID": '$userInfo._id', "email": '$userInfo.email' }
                }
            ])
            return res.status(201).json({
                statusCode: 201,
                message: 'Successfully Created',
                body: resp[0]
            })
        }
        // if (resp.nModified === 1) {
        //     return res.status(200).json({
        //         statusCode: 200,
        //         message: 'Successfully updated',
        //         body: Object.assign(req.body.messages, { date: new Date().toISOString() })
        //     })
        // } else {
        //     return res.status(201).json({
        //         statusCode: 201,
        //         message: 'Successfully Created',
        //         body: resp
        //     })
        // }
    } catch (err) {
        next(err)
    }
})

router.get('/conversation/:userId', async (req, res, next) => {
    try {
        console.log(req.params.userId)
        const Conversation = await conversation.findOne({ $or: [{ from: ObjectID(req.params.userId) }, { to: ObjectID(req.params.userId) }] }).lean();
        const data = await conversation.aggregate([
            {
                $match: { $or: [{ from: ObjectID(req.params.userId) }, { to: ObjectID(req.params.userId) }] }
            },
            {
                $lookup: {

                    from: "users",
                    localField: (Conversation.from == req.params.userId)? "to":"from",
                    foreignField: "_id",
                    as: "userInfo"

                }
            },
            {
                $unwind: { path: '$userInfo' }
            },
            {
                $project: { _id: 1, messages: 1, roomID: 1, "fname": '$userInfo.fname', "userID": '$userInfo._id', "email": '$userInfo.email' }
            }
        ])
        console.log(data)

        return res.status(200).json({
            statusCode: 200,
            message: 'Successfully read',
            body: data
        })
    } catch (err) {
        next(err)
    }

})

router.get('/message/:conversationId', async (req, res, next) => {
    try {
        const data = await conversation.findById(req.params.conversationId, { _id: 1, messages: 1 }).lean();
        if (data !== null) {
            return res.status(200).json({
                statusCode: 200,
                message: 'read successfully',
                body: data
            })
        } else {
            return res.status(204).json({
                statusCode: 204,
                message: 'does not match any document',
                body: data
            })
        }
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

