var db = require('../database');

//User object constructor
var Order = function(record){
    this.account_id = record.account_id;
    this.provider_order_id = record.provider_order_id;
    this.asset_type = record.asset_type;
    this.symbol = record.symbol;
    this.duration = record.duration;
    this.limit_price = record.limit_price;
    this.stop_price = record.stop_price;
    this.order_type = record.order_type;
    this.quantity = record.quantity;
    this.route = record.route;
    this.trade_action = record.trade_action;
    this.oso_app_order_id = record.oso_app_order_id;
    this.message = record.message;
    this.order_status = record.order_status;
    this.order_confirm_id = record.order_confirm_id;
};

Order.createOrder = async function (newOrder) {
    const qp = newOrder;
    const limit_price = qp.limit_price ? `'${qp.limit_price}'` : null;
    const stop_price = qp.stop_price ? `'${qp.stop_price}'` : null;
    const query = `INSERT INTO orders (account_id, provider_order_id, asset_type, symbol, duration, limit_price, stop_price, order_confirm_id, order_type, quantity, trade_action, order_status, oso_app_order_id, message)
    VALUES (${qp.account_id}, ${qp.provider_order_id}, '${qp.asset_type}', '${qp.symbol}', '${qp.duration}', ${limit_price}, ${stop_price}, 
    '${qp.order_confirm_id}', '${qp.order_type}', '${qp.quantity}', '${qp.trade_action}', '${qp.order_status}', 
    ${qp.oso_app_order_id ? qp.oso_app_order_id : 'null'}, '${qp.message}');`;
    
    const result = await db.crudData(query, newOrder);

    if(result){
        return result;
    }
    return null;
};

Order.updateOrderStatus = async function (existingOrder) {
    const qp = existingOrder;
    const limit_price = qp.limit_price ? `'${qp.limit_price}'` : 'limit_price';
    const stop_price = qp.stop_price ? `'${qp.stop_price}'` : 'stop_price';

    const query = `UPDATE orders
            SET order_Status='${qp.order_status}', limit_price=${limit_price}, stop_price=${stop_price}, updated = current_timestamp()
            WHERE app_order_id=${qp.app_order_id};`;
    
    db.crudData(query, existingOrder);
};

Order.deleteOrder = async function (existingOrder) {
    const qp = existingOrder;
    // const limit_price = qp.limit_price ? `'${qp.limit_price}'` : null;
    // const stop_price = qp.stop_price ? `'${qp.stop_price}'` : null;

    const query = `UPDATE orders
            SET order_Status='${qp.order_status}', updated = current_timestamp()
            WHERE app_order_id=${qp.app_order_id};`;
    
    db.crudData(query, existingOrder);
};

Order.getOrderByProviderOrderId = async function (provider_order_id) {
    const query = `Select * from orders where provider_order_id = ${provider_order_id}`;
    
    const result = await db.getData(query);

    if(result){
        return result[0];
    }
    return null;
};

Order.getOrderByProviderListOfOrderIds = async function (provider_order_id) {
    const query = `Select * from orders where provider_order_id IN (${provider_order_id}) ORDER BY provider_order_id DESC`;
    
    const result = await db.getData(query);

    if(result){
        return result;
    }
    return null;
};

Order.saveOrder = async function (payload){
    var newOrderPayload = new Order({
        account_id: payload.AccountKey,
        provider_order_id: payload.provider_order_id,
        asset_type: payload.AssetType,
        symbol: payload.Symbol,
        duration: payload.Duration,
        limit_price: payload.LimitPrice,
        stop_price: payload.StopPrice,
        order_type: payload.OrderType,
        quantity: payload.Quantity,
        trade_action: payload.TradeAction,
        oso_app_order_id: payload.oso_app_order_id,
        message: payload.message,
        order_status: payload.order_status,
        order_confirm_id: payload.OrderConfirmId,
    });

    const orderExist = await this.getOrderByProviderOrderId(newOrderPayload.provider_order_id);
    if(orderExist){
        newOrderPayload.app_order_id = orderExist.app_order_id;
        this.updateOrderStatus(newOrderPayload);
    } else {
        const newOrder = await this.createOrder(newOrderPayload);
        if(newOrder){
            return newOrder;
        }
    }
}

Order.getOrderResponseData = function(orders, orderStr){
    var order = orders;
    orders.forEach(row => {
        const message = `${row.Message}`.toLocaleUpperCase().replace(/ /g, '');
        if(message.indexOf(orderStr) > 0){
            order = row;
        }
    })
    return order;
}

Order.createStopOrder = async function (payload) {
    const orders = payload.response;
    var order = orders[0];
    try {
        
        if(payload.OSOs.length > 0 && orders.length > 1){
            var osoPayload = payload.OSOs[0].Orders[0];
            var orderStr = `${osoPayload.TradeAction}${osoPayload.Quantity}${osoPayload.Symbol}`.toLocaleUpperCase().replace(' ', '');
            
            order = this.getOrderResponseData(orders, orderStr);

            osoPayload.provider_order_id = order.OrderID;
            osoPayload.order_status = order.OrderStatus;
            osoPayload.message = order.Message;
            const newOrder = await this.saveOrder(osoPayload);

            if(newOrder){
                orderStr = `${payload.TradeAction}${payload.Quantity}${payload.Symbol}`.toLocaleUpperCase().replace(' ', '');
                order = this.getOrderResponseData(orders, orderStr);
                payload.provider_order_id = order.OrderID;
                payload.order_status = order.OrderStatus;
                payload.message = order.Message;
                payload.oso_app_order_id = newOrder.insertId;
                this.saveOrder(payload);
            }

        } else {
            payload.provider_order_id = order.OrderID;
            payload.order_status = order.OrderStatus;
            payload.message = order.Message;
            this.saveOrder(payload);
        }
        
    } catch (error) {
        console.log(error);
    }
};

Order.updateStopOrder = async function (payload) {
    const order = payload.response;
    if(order.OrderStatus === 'Ok'){
        payload.provider_order_id = order.OrderID;
        payload.order_status = order.OrderStatus;
        payload.message = order.Message;
        this.saveOrder(payload);
    }
}

module.exports= Order;