var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');
const pattern = require('../db/pattern');
const setting = require('../db/settings');
var activeOrders = [];
var ordersInterval = 0;

getActiveOrdersRecursive = async (req, res) => {
    clearInterval(ordersInterval);
    ordersInterval = setInterval(async () =>{
        const regularSession = await setting.getSettingsByName('OverrideRegularSession');
        if(parseInt(regularSession.value) === 1){
            getActiveOrders(req, res);
        } 
    }, 1500);
}

getActiveOrders = async (req, res) => {
    const tsRegX = /\d+/g;
    const key = parseInt(req.params.key.match(tsRegX));
    if(key){
        const url = `/v2/accounts/${key}/orders?since=${helper.getDate()}`;
        const accountOrders = await helper.send(req, res, 'GET', url);            
        if(accountOrders && accountOrders.length > 0){
            const statuses = ['UROut', 'Canceled', 'Rejected'];
            activeOrders = accountOrders.filter(order => !statuses.includes(order.StatusDescription));
            const symbols = [...new Set(activeOrders.filter(order => order.StatusDescription !== 'Filled').map(s => `'${s.Symbol}'`))].toString();
            pattern.updatePatternIfHasOrder(symbols);
            activeOrders.filter(o => ['Buy', 'Sell Short'].includes(o.Type)).forEach(order => {
                const triggered = accountOrders.filter(o => parseInt(o.TriggeredBy) === order.OrderID && o.StatusDescription === 'Filled')[0];
                
                if(triggered){
                    switch (order.Type) {
                        case 'Buy':
                            var buy = triggered.FilledPrice - order.FilledPrice;
                            order.TriggeredBy = parseFloat(buy * order.Quantity).toFixed(2);
                            break;

                        case 'Sell Short':
                            var short = order.FilledPrice - triggered.FilledPrice;
                            order.TriggeredBy = parseFloat(short * order.Quantity).toFixed(2);
                            break;
                        default:
                            break;
                    }
                }
            });
            // console.log(activeOrders)
            return activeOrders;
        }
    }
}

router.get('/:key', async function  (req, res, next)  {

    if(activeOrders.length > 0){
        res.send(activeOrders);
    } else {
        getActiveOrdersRecursive(req, res);
        const orders = await getActiveOrders(req, res);
        if(orders){
            res.send(orders);
        } else {
            res.send([]);
        }
    }
})

router.post('/', async function  (req, res, next)  {
    const payload = req.body;
    const url = '/v2/orders';
    const orderData = await helper.send(req, res, 'POST', url, payload);

    if(orderData){
        const orderSuccess = orderData.filter(o => o.OrderStatus === 'Failed').length === 0;
        if(orderSuccess){
            pattern.updatePatternIfHasOrderBySymbol(payload.Symbol);
        }
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