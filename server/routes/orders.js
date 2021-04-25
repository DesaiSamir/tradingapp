var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');
const order = require('../db/order');

router.get('/:key', async function  (req, res, next)  {
    
    const url = `/v2/accounts/${req.params.key}/orders?since=${helper.getDate()}`;
    const accountOrders = await helper.send(req, res, 'GET', url);

    if(accountOrders){
        if(accountOrders.length > 0){
            const orderIds =  Array.prototype.map.call(accountOrders, o => o.OrderID).toString();
            const dbOrders = await order.getOrderByProviderListOfOrderIds(orderIds);
            if(dbOrders){
                const dbOrderIds = Array.prototype.map.call(dbOrders, o => o.provider_order_id);
                const retOrders = accountOrders.filter(order => dbOrderIds.includes(order.OrderID.toString()));
                res.send({retOrders, dbOrders});
            }
        }
    }
})

router.post('/', async function  (req, res, next)  {
    const payload = req.body;
    const url = '/v2/orders';
    const orderData = await helper.send(req, res, 'POST', url, payload);

    if(orderData){
        payload.response = orderData;
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
        order.updateStopOrder(payload);
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