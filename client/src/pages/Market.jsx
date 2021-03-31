import React, { useState, useEffect } from "react";
import Terminal from "../components/displays/Terminal";
import Col from "../components/wrappers/Col";
import DataTags from "../components/menus/DataTags";
import http from "../utils/http";
// import Button from "../components/buttons/Button";

const Market = () => {
    const [selected, setSelected] = useState("All");
    const [selected2, setSelected2] = useState("All");
    const [marketData, setMarketData] = useState({});
    const [marketDataStream, setMarketDataStream] = useState({});
    const [stockCode, setStockCode] = useState('TSLA');
    const text = "Stock Ticker:";
    const options = Object.keys(marketData).filter(key => {
        return marketData[key] !== null;
    });
    const options2 = Object.keys(marketDataStream).filter(key => {
        return marketDataStream[key] !== null;
    });

    useEffect(() => {
        const quote = () => {
            const payload = {
                method: 'GET',
                url: `/v2/data/quote/${stockCode}`
            };
            http.send(payload, setMarketData);
        }
        const quoteChanges = () => {
                const date = '03-30-2021';
                const minutes = 240;
                const payload = {
                    method: 'GETSTREAM',
                    // url: `/v2/stream/quote/changes/${stockCode}`
                    // url: `/v2/stream/barchart/${stockCode}/5/Minute/03-28-2021/03-30-2021?SessionTemplate=USEQPreAndPost`
                    // url: `/v2/stream/quote/snapshots/${stockCode}`
                    url: `/v2/stream/barchart/${stockCode}/${minutes}/Minute?SessionTemplate=USEQPreAndPost&daysBack=1&lastDate=${date}`
                };
                
            http.send(payload, setMarketDataStream);
        }
        quote();
        quoteChanges();
    }, [stockCode]);

    // Change stock code
    const onStockCodeChange = (e) => {
        var stockTimer;

        clearTimeout(stockTimer);

        stockTimer = setTimeout(() => {
            setStockCode(e.target.value);
        }, 1000);
    }

    return (
        <div className="page" >
            <Col style={{}}>
                <p className="page-title" style={styles.search}>
                    {text}
                    <span style={{margin: '10px'}}>
                        <input type="text" style={styles.text_input} id="stockCode" placeholder="TSLA" onChange={onStockCodeChange} />
                        <span></span>
                    </span>
                </p>
            </Col>
            <Col className="col-4">
                <DataTags
                    options={options2}
                    onClick={option => setSelected2(option)}
                    selected={selected2}
                />
                <DataTags
                    options={options}
                    onClick={option => setSelected(option)}
                    selected={selected}
                />
            </Col>

            <Col className="col-8">
                <Terminal
                    title={`/v2/stream/barchart/${stockCode}/240/Minute?SessionTemplate=USEQPreAndPost&daysBack=1&lastDate=03-29-2021`}
                    userData={marketDataStream}
                    selected={selected2}
                />
                <Terminal
                    title={`/v2/data/quote/${stockCode}`}
                    userData={marketData}
                    selected={selected}
                />
            </Col>
            <div style={{ marginBottom: 20 }} />
        </div>
    )
}
export default Market

const styles = {
    search: {
        // display: 'flex',
        // flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center'
    },
    text_input: {
        fontFamily: "'Roboto', sans-serif",
        color: '#000',
        fontSize: '1.2rem',
        margin: '0 auto',
        padding: '.7rem 2rem',
        borderRadius: '0.2rem',
        width: '20%',
        // display: 'block',
        border: '0.3rem solid',
        transition: 'all 0.3s',
      }
}