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
	const [open, setOpen] = useState(false);
	const [orderSymbol, setOrderSymbol] = useState();
	const [isBullish, setIsBullish] = useState();
	const [stopLimitAction, setStopLimitAction] = useState();
	const [stopLossAction, setStopLossAction] = useState();
	const [stopPrice, setStopPrice] = useState();
	const [limitPrice, setLimitPrice] = useState();
	const [stopLossPrice, setStopLossPrice] = useState();
	const [riskOffset, setRiskOffset] = useState();
	const [trailingStopPrice, setTrailingStopPrice] = useState();
	const [quantity, setQuantity] = useState();
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
    
    useEffect(() => {
        http.getAccountOrders(equitiesAccountKey, setOrders);
        http.getAccountPositions(equitiesAccountKey, setPositions);
    }, [equitiesAccountKey]);
    
    const reloadOrders = () => {
        http.getAccountOrders(equitiesAccountKey, setOrders);
    }

	const handleClickOpenTradeDialog = (candle) => {
		setOpen(true);
		const c = candle;
        const cSymbol = c.orderSymbol ? c.orderSymbol : symbol;
		const isBullish = c.close > c.open;
		const stopLimitAction = isBullish ? 'BUY' : 'SELLSHORT';
		const stopLossAction = isBullish ? 'SELL' : 'BUYTOCOVER';
		const spo = 0.01;
		const lpo = 0.03;
		const slpo = 0.01;
		const stopPrice = isBullish ? c.high + spo : c.low - spo;
		const limitPrice = isBullish ? c.high + lpo : c.low - lpo;
		var stopLossPrice = isBullish ? c.low - slpo : c.high + slpo;
		const trailingStopPrice = isBullish ? stopPrice - stopLossPrice : stopLossPrice - stopPrice;
		const quantity = Math.floor(100000/ stopPrice)
		// stopLossPrice = isBullish ? stopPrice - (trailingStopPrice/2) : stopPrice + (trailingStopPrice/2);

		var currentTime = new Date();
		const orderConfirmId = `${stopLimitAction + cSymbol + currentTime.getHours() + currentTime.getMinutes() + currentTime.getSeconds()}`;
		
		setHighPrice(parseFloat(c.high).toFixed(2));
		setLowPrice(parseFloat(c.low).toFixed(2));
		setOpenPrice(parseFloat(c.open).toFixed(2));
		setClosePrice(parseFloat(c.close).toFixed(2));
		setTitle(c.title);
		setPattern(c.pattern);
		setOrderSymbol(cSymbol);
		setIsBullish(isBullish);
		setStopPriceOffset(spo);
		setLimitPriceOffset(lpo);
		setStopLossPriceOffset(slpo);
		setStopLimitAction(stopLimitAction);
		setStopLossAction(stopLossAction);
		setStopPrice(parseFloat(stopPrice).toFixed(2));
		setLimitPrice(parseFloat(limitPrice).toFixed(2));
		setStopLossPrice(parseFloat(stopLossPrice).toFixed(2));
		setTrailingStopPrice(parseFloat(trailingStopPrice).toFixed(2));
		setRiskOffset(parseFloat(1).toFixed(2));
		setQuantity(quantity);
		setOrderConfirmId(orderConfirmId);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSendOrderClick = () => {
		setOpen(false);
		
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
		// setOrderResponseData(payload);
		// setShowResponse(true);
		http.postPurchaseOrder(payload, orderResponse);
	};

    const orderResponse = (data) => {
        setOrderResponseData(data);
		reloadOrders();
		setShowResponse(true);
    }

	const handleTextChange = (e) => {
		switch (e.target.name) {
			case 'RISKOFFSET':
				setRiskOffset(e.target.value);
				break;

			case 'QUANTITY':
				setQuantity(e.target.value);
				break;
			
			case 'STOPOFFSET':
				setStopPriceOffset(e.target.value);
				break;

			case 'LIMITOFFSET':
				setLimitPriceOffset(e.target.value);
				break;
			
			case 'LOSSOFFSET':
				setStopLossPriceOffset(e.target.value);
				break;
			
            case 'STOPLOSSPRICE':
                setStopLossPrice(e.target.value);
                break;
			
            case 'STOPPRICE':
                setStopPrice(e.target.value);
                break;
        
            case 'LIMITPRICE':
                setLimitPrice(e.target.value);
                break;

			case 'TRAILINGSTOP':
				setTrailingStopPrice(e.target.value);
				break;

			default:
				break;
		}
	}

    return (
        <OrderContext.Provider value={{
            orders, reloadOrders, positions, orderResponseData, showResponse, handleClickOpenTradeDialog, setShowResponse,
            open, orderSymbol, isBullish, stopLimitAction, stopLossAction, stopPrice, limitPrice,stopLossPrice, riskOffset, 
            trailingStopPrice, quantity, orderConfirmId, stopPriceOffset, limitPriceOffset, stopLossPriceOffset, title, pattern,
            highPrice, lowPrice, openPrice, closePrice, handleSendOrderClick, handleTextChange, handleClose,
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderProvider;

