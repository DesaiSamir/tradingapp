var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');
const order = require('../db/order');

router.get('/', async function  (req, res, next)  {
    
})

router.post('/', async function  (req, res, next)  {
    const payload = req.body;
    const url = '/v2/orders';
    const orderData = await helper.send(req, res, 'POST', url, payload);

    if(orderData){
        payload.response = orderData;
        console.log(payload)
        order.createStopOrder(payload);
        res.send(orderData);
    }
})

router.put('/', async function  (req, res, next)  {
    const payload = req.body.payload;
    const order_id = req.body.order_id;
    const url = `/v2/orders/${order_id}`;
    const orderData = await helper.send(req, res, 'PUT', url, payload);

    if(orderData){
        payload.response = orderData;
        console.log(payload)
        order.updateStopOrder(payload);
        res.send(orderData);
    }
})

router.delete('/', async function  (req, res, next)  {
    const order_id = req.body.order_id;
    const url = `/v2/orders/${order_id}`;
    const orderData = await helper.send(req, res, 'DELETE', url);

    if(orderData){
        console.log(orderData)
        order.updateStopOrder(orderData);
        res.send(orderData);
    }
})

module.exports = router;