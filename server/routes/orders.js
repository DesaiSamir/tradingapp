var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');

router.get('/:key', async function  (req, res, next)  {
    const tsRegX = /\d+/g;
    const key = parseInt(req.params.key.match(tsRegX));
    
    if(key){
        const today = new Date();
        const url = `/v2/accounts/${req.params.key}/orders?since=${helper.getDate()}`;
        const accountOrders = await helper.send(req, res, 'GET', url);
        const statuses = ['UROut', 'Canceled', 'Rejected'];
        if(accountOrders && accountOrders.length > 0){
            const retOrders = accountOrders.filter(order => !statuses.includes(order.StatusDescription));
            res.send(retOrders);
        }
    } else {
        res.send([]);
    }
})

router.post('/', async function  (req, res, next)  {
    const payload = req.body;
    const url = '/v2/orders';
    const orderData = await helper.send(req, res, 'POST', url, payload);

    if(orderData){
        payload.response = orderData;
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
        res.send(orderData);
    }
})

router.post('/close', async function  (req, res, next)  {
    const payload = req.body.payload;
    const url = `/v2/orders`;
    const orderData = await helper.send(req, res, 'POST', url, payload);

    if(orderData){
        payload.response = orderData;
        res.send(orderData);
    }
})

router.delete('/:orderid', async function  (req, res, next)  {
    const order_id = req.params.orderid;
    const url = `/v2/orders/${order_id}`;
    const orderData = await helper.send(req, res, 'DELETE', url);

    if(orderData){
        res.send(orderData);
    }
})

module.exports = router;