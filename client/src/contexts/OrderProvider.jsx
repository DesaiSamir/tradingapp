import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserProvider";
import { ChartActionsContext } from "./ChartActionsProvider";
export const OrderContext = createContext(null);
const http = require("../utils/http");

const OrderProvider = ({ children }) => {
    const { equitiesAccountKey } = useContext(UserContext);
    const { symbol } = useContext(ChartActionsContext);
    const [orders, setOrders] = useState(null);
    const [positions, setPositions] = useState(null);
	const [orderOpen, setOrderOpen] = useState(false);
	const [orderSymbol, setOrderSymbol] = useState();
	const [isBullish, setIsBullish] = useState();
	const [stopLimitAction, setStopLimitAction] = useState();
	const [stopLossAction, setStopLossAction] = useState();
	const [stopPrice, setStopPrice] = useState();
	const [limitPrice, setLimitPrice] = useState();
	const [stopLossPrice, setStopLossPrice] = useState();
	const [target1Price, setTarget1Price] = useState();
	const [target2Price, setTarget2Price] = useState();
	const [riskOffset, setRiskOffset] = useState();
	const [trailingStopPrice, setTrailingStopPrice] = useState();
	const [quantity, setQuantity] = useState();
	const [quantityT1, setQuantityT1] = useState();
	const [quantityT2, setQuantityT2] = useState();
	const [orderConfirmId, setOrderConfirmId] = useState();
	const [stopPriceOffset, setStopPriceOffset] = useState();
	const [limitPriceOffset, setLimitPriceOffset] = useState();
	const [stopLossPriceOffset, setStopLossPriceOffset] = useState();
	const [title, setTitle] = useState();
	const [pattern, setPattern] = useState();
	const [highPrice, setHighPrice] = useState();
	const [lowPrice, setLowPrice] = useState();
	const [openPrice, setOpenPrice] = useState();
	const [closePrice, setClosePrice] = useState();
    const [orderResponseData, setOrderResponseData] = useState();
    const [showResponse, setShowResponse] = useState(false);
	const [orderTypeValue, setOrderTypeValue] = useState('');
    
    useEffect(() => {
        http.getAccountOrders(equitiesAccountKey, setOrders);
        http.getAccountPositions(equitiesAccountKey, setPositions);
    }, [equitiesAccountKey]);
    
    const reloadOrders = () => {
        http.getAccountOrders(equitiesAccountKey, setOrders);
    }

	const handleClickOpenTradeDialog = (candle) => {
		setOrderOpen(true);
		const c = candle;
        const cSymbol = c.orderSymbol ? c.orderSymbol : symbol;
		const cIsBullish = c.close > c.open;
		const cStopLimitAction = cIsBullish ? 'BUY' : 'SELLSHORT';
		const cStopLossAction = cIsBullish ? 'SELL' : 'BUYTOCOVER';
		const spo = 0.01;
		const lpo = 0.03;
		const slpo = 0.01;
		const cStopPrice = cIsBullish ? c.high + spo : c.low - spo;
		const cLimitPrice = cIsBullish ? c.high + lpo : c.low - lpo;
		var cStopLossPrice = cIsBullish ? c.low - slpo : c.high + slpo;
		const cTrailingStopPrice = cIsBullish ? cStopPrice - cStopLossPrice : cStopLossPrice - cStopPrice;
		const cQuantity = Math.floor(100000/ cStopPrice);
        const cQuantityT1 = Math.floor(cQuantity/2);
        const cQuantityT2 = cQuantity - cQuantityT1;
        const cTarget1Price = cStopPrice + (cTrailingStopPrice / 2);
        const cTarget2Price = cStopPrice + cTrailingStopPrice;

		var currentTime = new Date();
		const cOrderConfirmId = `${cStopLimitAction + cSymbol + currentTime.getHours() + currentTime.getMinutes() + currentTime.getSeconds()}`;
		
		setHighPrice(parseFloat(c.high).toFixed(2));
		setLowPrice(parseFloat(c.low).toFixed(2));
		setOpenPrice(parseFloat(c.open).toFixed(2));
		setClosePrice(parseFloat(c.close).toFixed(2));
		setTitle(c.title);
		setPattern(c.pattern);
		setOrderSymbol(cSymbol);
		setIsBullish(cIsBullish);
		setStopPriceOffset(spo);
		setLimitPriceOffset(lpo);
		setStopLossPriceOffset(slpo);
		setStopLimitAction(cStopLimitAction);
		setStopLossAction(cStopLossAction);
		setStopPrice(parseFloat(cStopPrice).toFixed(2));
		setLimitPrice(parseFloat(cLimitPrice).toFixed(2));
		setStopLossPrice(parseFloat(cStopLossPrice).toFixed(2));
		setTrailingStopPrice(parseFloat(cTrailingStopPrice).toFixed(2));
        setTarget1Price(parseFloat(cTarget1Price).toFixed(2));
        setTarget2Price(parseFloat(cTarget2Price).toFixed(2));
		setRiskOffset(parseFloat(1).toFixed(2));
		setQuantity(cQuantity);
        setQuantityT1(cQuantityT1);
        setQuantityT2(cQuantityT2);
		setOrderConfirmId(cOrderConfirmId);
	};

    const getTrailingStopPayload = () => {
        const payload = {
			Symbol: orderSymbol,
			AccountKey: equitiesAccountKey,
			AssetType: 'EQ',
			Duration: 'GTC',
			OrderType: 'StopLimit',
			StopPrice: stopPrice,
			LimitPrice: limitPrice,
			Quantity: quantity,
			TradeAction: stopLimitAction,
			OrderConfirmId: orderConfirmId,
			OSOs:  [
				{
					Type: 'NORMAL',
					Orders: [
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'StopMarket',
							StopPrice: stopLossPrice,
							Quantity: quantity,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TS',
							AdvancedOptions: {
								TrailingStop: {
									Amount: trailingStopPrice,
								}
							},
							Legs: [
								{
									Symbol: orderSymbol,
									Quantity: quantity,
									TradeAction: stopLossAction,
								}
							]
						}
					]
				}
			],
		};

        return payload;
    };

    const getBracket1Target1TSPayload = () => {
        const payload = {
			Symbol: orderSymbol,
			AccountKey: equitiesAccountKey,
			AssetType: 'EQ',
			Duration: 'GTC',
			OrderType: 'StopLimit',
			StopPrice: stopPrice,
			LimitPrice: limitPrice,
			Quantity: quantity,
			TradeAction: stopLimitAction,
			OrderConfirmId: orderConfirmId,
			OSOs:  [
				{
					Type: 'BRK',
					Orders: [
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'Limit',
							LimitPrice: target1Price,
							Quantity: quantity,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TP',
						},
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'StopMarket',
							StopPrice: stopLossPrice,
							Quantity: quantity,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TS',
							AdvancedOptions: {
								TrailingStop: {
									Amount: trailingStopPrice,
								}
							},
							Legs: [
								{
									Symbol: orderSymbol,
									Quantity: quantity,
									TradeAction: stopLossAction,
								}
							]
						}
					]
				}
			],
		};

        return payload;
    };

    const getBracket2Target2TSPayload = () => {
        const payload = {
			Symbol: orderSymbol,
			AccountKey: equitiesAccountKey,
			AssetType: 'EQ',
			Duration: 'GTC',
			OrderType: 'StopLimit',
			StopPrice: stopPrice,
			LimitPrice: limitPrice,
			Quantity: quantity,
			TradeAction: stopLimitAction,
			OrderConfirmId: orderConfirmId,
			OSOs:  [
				{
					Type: 'BRK',
					Orders: [
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'Limit',
							LimitPrice: target1Price,
							Quantity: quantityT1,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TP1',
						},
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'StopMarket',
							StopPrice: stopLossPrice,
							Quantity: quantityT1,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TS1',
							AdvancedOptions: {
								TrailingStop: {
									Amount: trailingStopPrice,
								}
							},
							Legs: [
								{
									Symbol: orderSymbol,
									Quantity: quantityT1,
									TradeAction: stopLossAction,
								}
							]
						}
					]
				},
				{
					Type: 'BRK',
					Orders: [
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'Limit',
							LimitPrice: target2Price,
							Quantity: quantityT2,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TP2',
						},
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'StopMarket',
							StopPrice: stopLossPrice,
							Quantity: quantityT2,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TS2',
							AdvancedOptions: {
								TrailingStop: {
									Amount: trailingStopPrice,
								}
							},
							Legs: [
								{
									Symbol: orderSymbol,
									Quantity: quantityT2,
									TradeAction: stopLossAction,
								}
							]
						}
					]
				}
			],
		};

        return payload;
    };

    const getBracket1Target1LossPayload = () => {
        const payload = {
			Symbol: orderSymbol,
			AccountKey: equitiesAccountKey,
			AssetType: 'EQ',
			Duration: 'GTC',
			OrderType: 'StopLimit',
			StopPrice: stopPrice,
			LimitPrice: limitPrice,
			Quantity: quantity,
			TradeAction: stopLimitAction,
			OrderConfirmId: orderConfirmId,
			OSOs:  [
				{
					Type: 'BRK',
					Orders: [
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'Limit',
							LimitPrice: target1Price,
							Quantity: quantity,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TP',
						},
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'StopMarket',
							StopPrice: stopLossPrice,
							Quantity: quantity,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'SL',
						}
					]
				}
			],
		};

        return payload;
    };

    const getBracket2Target2LossPayload = () => {
        const payload = {
			Symbol: orderSymbol,
			AccountKey: equitiesAccountKey,
			AssetType: 'EQ',
			Duration: 'GTC',
			OrderType: 'StopLimit',
			StopPrice: stopPrice,
			LimitPrice: limitPrice,
			Quantity: quantity,
			TradeAction: stopLimitAction,
			OrderConfirmId: orderConfirmId,
			OSOs:  [
				{
					Type: 'BRK',
					Orders: [
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'Limit',
							LimitPrice: target1Price,
							Quantity: quantityT1,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TP1',
						},
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'StopMarket',
							StopPrice: stopLossPrice,
							Quantity: quantityT1,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'SL1',
						}
					]
				},
				{
					Type: 'BRK',
					Orders: [
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'Limit',
							LimitPrice: target2Price,
							Quantity: quantityT2,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TP2',
						},
						{
							Symbol: orderSymbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'StopMarket',
							StopPrice: stopLossPrice,
							Quantity: quantityT2,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'SL2',
						}
					]
				}
			],
		};

        return payload;
    };

	const handleSendOrderClick = () => {
		setOrderOpen(false);
		var payload = getTrailingStopPayload();

        switch (orderTypeValue) {
            case 'bracket1Target1TS':
                payload = getBracket1Target1TSPayload();
                break;

            case 'bracket2Target2TS':
                payload = getBracket2Target2TSPayload();
                break;
                
            case 'bracket1Target1Loss':
                payload = getBracket1Target1LossPayload();
                break;
                
            case 'bracket2Target2Loss':
                payload = getBracket2Target2LossPayload();
                break;

            default:
                break;
        }
		
		// setOrderResponseData(payload);
		// setShowResponse(true);
		http.postPurchaseOrder(payload, orderResponse);
	};

	const handleClose = () => {
		setOrderOpen(false);
	};

    const orderResponse = (data) => {
        setOrderResponseData(data);
		reloadOrders();
		setShowResponse(true);
    }

	const handleTextChange = (e) => {
        const price = e.target.value;
		switch (e.target.name) {
			case 'RISKOFFSET':
				setRiskOffset(price);
				break;

			case 'QUANTITY':
				setQuantity(price);
				break;
			
			case 'STOPOFFSET':
				setStopPriceOffset(price);
				break;

			case 'LIMITOFFSET':
				setLimitPriceOffset(price);
				break;
			
			case 'LOSSOFFSET':
				setStopLossPriceOffset(price);
				break;
			
            case 'STOPLOSSPRICE':
                setStopLossPrice(price);
                break;
			
            case 'STOPPRICE':
                setStopPrice(price);
                break;
        
            case 'LIMITPRICE':
                setLimitPrice(price);
                break;

			case 'TRAILINGSTOP':
				setTrailingStopPrice(price);
				break;

            case 'TARGET1':
                setTarget1Price(price);
                break;

            case 'TARGET2':
                setTarget2Price(price);
                break;

			default:
				break;
		}
	}

    const handleRadioChange = (event) => {
        const orderType = event.target.value;
        setOrderTypeValue(orderType);
        console.log(orderType);
    };

    return (
        <OrderContext.Provider value={{
            orders, reloadOrders, positions, orderResponseData, showResponse, handleClickOpenTradeDialog, setShowResponse,
            orderOpen, orderSymbol, isBullish, stopLimitAction, stopLossAction, stopPrice, limitPrice,stopLossPrice, riskOffset, 
            trailingStopPrice, quantity, orderConfirmId, stopPriceOffset, limitPriceOffset, stopLossPriceOffset, title, pattern,
            highPrice, lowPrice, openPrice, closePrice, handleSendOrderClick, handleTextChange, handleClose, handleRadioChange,
            orderTypeValue, target1Price, target2Price, 
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderProvider;

