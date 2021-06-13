const express = require('express');
const router = express.Router();
const transactions = require('../model/transactionModel');
const enquiry = require('../model/contactModel');


router.post('/transaction', async (req, res, next) => {
    const data = await transactions.create({ ...req.body })

    if (data) {
        return res.status(201).json({
            statusCode: 201,
            message: 'Transaction created Successfully',
            body: data
        })
    } else {
        next(data)
    }
})

router.get('get/transaction', async (req, res, next) => {
    const data = await transactions.find({ })

    if (data) {
        return res.status(200).json({
            statusCode: 201,
            message: 'Transaction read Successfully',
            body: data
        })
    } else {
        next(data)
    }
})

router.post('/contact', async (req, res, next) => {
    const data = await enquiry.create({ ...req.body })
    if (data) {
        return res.status(201).json({
            statusCode: 201,
            message: 'enquiry submitted successfully',
            body: data
        })
    } else {
        next(data)
    }
})

router.get('get/contact', async (req, res, next) => {
    const data = await enquiry.find({ })
    if (data) {
        return res.status(201).json({
            statusCode: 201,
            message: 'enquiry submitted successfully',
            body: data
        })
    } else {
        next(data)
    }
})

module.exports = router;