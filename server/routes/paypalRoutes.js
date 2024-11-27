const express = require('express');
const router = express.Router();
const {ObjectId} = require("mongodb");
const { getConnectedClient } = require("../database");
const paypal = require('paypal-rest-sdk');
const querystring = require('querystring');

paypal.configure({
    'mode': process.env.PAYPAL_MODE, 
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});


const getOrders = () => {
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("orders");
    return collection;
}

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("gamer").collection("item");
    return collection;
}

// "return_url": `https://limitless-basin-41407-c6cf4d184767.herokuapp.com/success?userId=${userId}&total=${total}&${serializedShippingAddress}`,
// "cancel_url": "https://limitless-basin-41407-c6cf4d184767.herokuapp.com/cancel"
// PayPal payment routes
router.post('/pay', (req, res) => {
    let {cartParam, total, shippingAddress, userId} = req.body;
    total = parseFloat(total).toFixed(2);
    const serializedShippingAddress = querystring.stringify(shippingAddress);
    // console.log("i went here at paypal routes");
    // console.log(total, shippingAddress, userId);
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            // "return_url": `http://localhost:3000/success?userId=${userId}&total=${total}&${serializedShippingAddress}`,
            // "cancel_url": "http://localhost:3000/cancel"
            "return_url": `https://limitless-basin-41407-c6cf4d184767.herokuapp.com/success?userId=${userId}&total=${total}&${serializedShippingAddress}`,
            "cancel_url": "https://limitless-basin-41407-c6cf4d184767.herokuapp.com/cancel"
        },
        "transactions": [{
            "item_list": {  
                "items": cartParam
            },
            "amount": {
                "currency": "PHP",
                "total": total
            },
            "description": "This is your order:"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.error(error);
            res.status(500).send(error);
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.json({ url: payment.links[i].href });
                    return;
                }
            }
            res.status(500).send('No redirect URL found');
        }
    });
});

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const totalAmount = req.query.total;
    const shippingAddress = {
        street: req.query.street,
        city: req.query.city,
        province: req.query.province,
        zip: req.query.zip,
        country: req.query.country
    };

    if (!totalAmount) {
        return res.status(400).send('Total amount is required');
    }

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "PHP",
                "total": totalAmount
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.error(error.response);
            res.status(500).send(error);
        } else {
            console.log("Get Payment Response");
            // console.log(JSON.stringify(payment));

            res.send({
                message: 'Success',
                shippingAddress: shippingAddress
            });
        }
    });
});

module.exports = router;