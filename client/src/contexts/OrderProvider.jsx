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
	const [riskOffset, setRiskOffset] = useState(1);
    const [oneRPrice, setOneRPrice] = useState();
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
	const [symbolPosition, setSymbolPosition] = useState([]);
	const [symbolOrders, setSymbolOrders] = useState([]);
	const [symbolAvgPrice, setSymbolAvgPrice] = useState();
	const [orderUpdated, setOrderUpdated] = useState(false);
	const [lastSelTabOrdPos, setLastSelTabOrdPos] = useState(0);
    
    useEffect(() => {
		const ordersData = (data) => {
			const symbolOrders = data && data.length && data.filter(order => order.Symbol === symbol);
			if(symbolOrders){
				setSymbolOrders(symbolOrders);
			}
			
			const symbols =  Array.prototype.map.call(data, s => `'${s.Symbol}'`).toString();
			const payload = {symbols};
			http.updatePatternsHasOrder(payload);

			setOrders(data);
		}
		const positionsData = (data) => {
			const symbolPosition = data && data.length && data.filter(pos => pos.Symbol === symbol)[0];
				
			if(symbolPosition){
				setSymbolAvgPrice(symbolPosition.AveragePrice);
				setSymbolPosition(symbolPosition);
			}
			else {
				setSymbolAvgPrice(null);
				setSymbolPosition(null);
			}

			const symbols =  Array.prototype.map.call(data, s => `'${s.Symbol}'`).toString();
			const payload = {symbols};
			http.updatePatternsHasPosition(payload);

			setPositions(data);
		}
        http.getAccountOrders(equitiesAccountKey, ordersData);
        http.getAccountPositions(equitiesAccountKey, positionsData);
    }, [equitiesAccountKey, symbol, orderUpdated]);
    
    const reloadOrders = () => {
		setOrderUpdated(!orderUpdated);
    }

	const handleClickOpenTradeDialog = (candle) => {
		setOrderOpen(true);
		const c = candle;
        const cSymbol = c.orderSymbol ? c.orderSymbol : symbol;
		const cIsBullish = c.close > c.open;
		const cStopLimitAction = cIsBullish ? 'BUY' : 'SELLSHORT';
		const cStopLossAction = cIsBullish ? 'SELL' : 'BUYTOCOVER';
		const spo = 0.01;
		const p = c.close;
		const lpo = p < 50 ? 0.05 : p < 100 ? .1 : p < 200 ? 0.2 : p < 500 ? 0.4 : p < 1000 ? 1 : 2;
		const slpo = 0.01;
		const cStopPrice = cIsBullish ? parseFloat(c.high) + spo : parseFloat(c.low) - spo;
		const cLimitPrice = cIsBullish ? parseFloat(c.high) + lpo : parseFloat(c.low) - lpo;
		const cOneRPrice = cIsBullish ? parseFloat(cStopPrice) - parseFloat(c.low) - slpo : parseFloat(c.high) + slpo - parseFloat(cStopPrice);
        const cTrailingStopPrice = parseFloat(cOneRPrice) * parseFloat(riskOffset);
		var cStopLossPrice = cIsBullish ? parseFloat(cStopPrice) - parseFloat(cTrailingStopPrice) : parseFloat(cStopPrice) + parseFloat(cTrailingStopPrice);
		const cQuantity = Math.floor(100000/ parseFloat(cStopPrice));
        const cQuantityT1 = Math.floor(cQuantity/2);
        const cQuantityT2 = cQuantity - cQuantityT1;
        const cTarget1Price = cIsBullish ? parseFloat(cStopPrice) + ((parseFloat(cTrailingStopPrice) / 2) * parseFloat(riskOffset)) : parseFloat(cStopPrice) - ((parseFloat(cTrailingStopPrice) / 2) * parseFloat(riskOffset));
        const cTarget2Price = cIsBullish ? parseFloat(cStopPrice) + (parseFloat(cTrailingStopPrice) * parseFloat(riskOffset)) : parseFloat(cStopPrice) - (parseFloat(cTrailingStopPrice) * parseFloat(riskOffset));

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
        setOneRPrice(parseFloat(cOneRPrice).toFixed(2));
		setTrailingStopPrice(parseFloat(cTrailingStopPrice).toFixed(2));
        setTarget1Price(parseFloat(cTarget1Price).toFixed(2));
        setTarget2Price(parseFloat(cTarget2Price).toFixed(2));
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
        const price = parseFloat(e.target.value).toFixed(2);
		switch (e.target.name) {
			case 'RISKOFFSET':
                const cIsBullish = closePrice > openPrice;
                const cTrailingStopPrice = parseFloat(oneRPrice) * parseFloat(price);
                var cStopLossPrice = cIsBullish ? parseFloat(stopPrice) - cTrailingStopPrice : parseFloat(stopPrice) + cTrailingStopPrice;
                const cTarget1Price = cIsBullish ? parseFloat(stopPrice) + ((cTrailingStopPrice / 2) * parseFloat(price)) : parseFloat(stopPrice) - ((cTrailingStopPrice / 2) * parseFloat(price));
                const cTarget2Price = cIsBullish ? parseFloat(stopPrice) + (cTrailingStopPrice * parseFloat(price)) : parseFloat(stopPrice) - (cTrailingStopPrice * parseFloat(price));

                setStopLossPrice(parseFloat(cStopLossPrice).toFixed(2));
                setTrailingStopPrice(parseFloat(cTrailingStopPrice).toFixed(2));
                setTarget1Price(parseFloat(cTarget1Price).toFixed(2));
                setTarget2Price(parseFloat(cTarget2Price).toFixed(2));
				setRiskOffset(parseFloat(price));
				break;

			case 'QUANTITY':
                const cQuantityT1 = Math.floor(parseInt(price)/2);
                const cQuantityT2 = parseInt(price) - cQuantityT1;                
                setQuantityT1(cQuantityT1);
                setQuantityT2(cQuantityT2);
				setQuantity(parseInt(price));
				break;
			
			case 'STOPOFFSET':
				setStopPriceOffset(parseFloat(price));
				break;

			case 'LIMITOFFSET':
				setLimitPriceOffset(parseFloat(price));
				break;
			
			case 'LOSSOFFSET':
				setStopLossPriceOffset(parseFloat(price));
				break;
			
            case 'STOPLOSSPRICE':
                setStopLossPrice(parseFloat(price));
                break;
			
            case 'STOPPRICE':
                setStopPrice(parseFloat(price));
                break;
        
            case 'LIMITPRICE':
                setLimitPrice(parseFloat(price));
                break;

			case 'TRAILINGSTOP':
				setTrailingStopPrice(parseFloat(price));
				break;

            case 'TARGET1':
                setTarget1Price(parseFloat(price));
                break;

            case 'TARGET2':
                setTarget2Price(parseFloat(price));
                break;

			default:
				break;
		}
	}

    const handleRadioChange = (event) => {
        const orderType = event.target.value;
        setOrderTypeValue(orderType);
    };

    return (
        <OrderContext.Provider value={{
            orders, reloadOrders, positions, orderResponseData, showResponse, handleClickOpenTradeDialog, setShowResponse,
            orderOpen, orderSymbol, isBullish, stopLimitAction, stopLossAction, stopPrice, limitPrice,stopLossPrice, riskOffset, 
            trailingStopPrice, quantity, orderConfirmId, stopPriceOffset, limitPriceOffset, stopLossPriceOffset, title, pattern,
            highPrice, lowPrice, openPrice, closePrice, handleSendOrderClick, handleTextChange, handleClose, handleRadioChange,
            orderTypeValue, target1Price, target2Price, oneRPrice, symbolAvgPrice, symbolOrders, symbolPosition, 
			lastSelTabOrdPos, setLastSelTabOrdPos
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderProvider;

