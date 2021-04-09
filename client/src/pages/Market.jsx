import React, { 
    useState, 
    // useEffect 
} from "react";
import Col from "../components/wrappers/Col";
import http from "../utils/http";
import helper from "../utils/helper";
import SimpleSelect from "../components/formcontrols/SimpleSelect";
import DatePicker from "../components/formcontrols/DatePicker";
import SimpleTextField from '../components/formcontrols/SimpleTextField';
import SimpleButton from '../components/formcontrols/SimpleButton';
import InputLabel from '@material-ui/core/InputLabel';
import TabPanel from '../components/navigations/TabPanel'
import { makeStyles } from '@material-ui/core/styles';

const Market = ({parentStyles}) => {
    const classes = useStyles();
    const parentClasses = parentStyles();
    const [marketDataStream, setMarketDataStream] = useState({});
    const [barChartData, setBarChartData] = useState({});
    const [symbol, setSymbol] = useState('TSLA');
    const [method, setMethod] = useState('GET');
    const [unit, setUnit] = useState('Minute');
    const [interval, setInterval] = useState(5);
    const [startDate, setStartDate] = useState(helper.formatDate(new Date().toUTCString()));
    const [endDate, setEndDate] = useState(helper.formatDate(new Date().toUTCString()));
    const [lastDate, setLastDate] = useState(helper.formatDate(new Date().toUTCString()));
    const [barsBack, setBarsBack] = useState(100);
    const [daysBack, setDaysBack] = useState(30);
    // const [url, setUrl] = useState(`/v2/stream/barchart/${symbol}/${interval}/${unit}?SessionTemplate=USEQPreAndPost&daysBack=${daysBack}&lastDate=${lastDate}`);
    const [url, setUrl] = useState(`/v2/data/quote/${symbol}`);
    const apis = [
        {
            id: 1,
            method: 'GET',
            title: 'Get Quote',
            value: `/v2/data/quote/${symbol}`,
            url: `/v2/data/quote/$symbol`,
            isUnit: false,
            isInteral: false,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 2,
            method: 'STREAM',
            title: 'Stream Quote Changes',
            value: `/v2/stream/quote/changes/${symbol}`,
            url: `/v2/stream/quote/changes/$symbol`,
            isUnit: false,
            isInteral: false,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 3,
            method: 'STREAM',
            title: 'Stream Quote Snapshots',
            value: `/v2/stream/quote/snapshots/${symbol}`,
            url: `/v2/stream/quote/snapshots/$symbol`,
            isUnit: false,
            isInteral: false,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 4,
            method: 'STREAM',
            title: 'Stream BarChart - Starting on Date',
            value: `/v2/stream/barchart/${symbol}/${interval}/${unit}/${startDate}?SessionTemplate=USEQPreAndPost`,
            url: `/v2/stream/barchart/$symbol/$interval/$unit/$startDate?SessionTemplate=USEQPreAndPost`,
            isUnit: true,
            isInteral: true,
            isStartDate: true,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 5,
            method: 'STREAM',
            title: 'Stream BarChart - Date Range',
            value: `/v2/stream/barchart/${symbol}/${interval}/${unit}/${startDate}/${endDate}?SessionTemplate=USEQPreAndPost`,
            url: `/v2/stream/barchart/$symbol/$interval/$unit/$startDate/$endDate?SessionTemplate=USEQPreAndPost`,
            isUnit: true,
            isInteral: true,
            isStartDate: true,
            isEndDate: true,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 6,
            method: 'STREAM',
            title: 'Stream BarChart - Bars Back',
            value: `/v2/stream/barchart/${symbol}/${interval}/${unit}/${barsBack}/${startDate}/${lastDate}?SessionTemplate=USEQPreAndPost`,
            url: `/v2/stream/barchart/$symbol/$interval/$unit/$barsBack/$startDate/$lastDate?SessionTemplate=USEQPreAndPost`,
            isUnit: true,
            isInteral: true,
            isStartDate: true,
            isEndDate: false,
            isLastDate: true,
            isDaysBack: false,
            isBarsBack: true
        },
        {
            id: 7,
            method: 'STREAM',
            title: 'Stream BarChart - Days Back',
            value: `/v2/stream/barchart/${symbol}/${interval}/${unit}?SessionTemplate=USEQPreAndPost&daysBack=${daysBack}&lastDate=${lastDate}`,
            url: `/v2/stream/barchart/$symbol/$interval/$unit?SessionTemplate=USEQPreAndPost&daysBack=$daysBack&lastDate=$lastDate`,
            isUnit: true,
            isInteral: true,
            isStartDate: false,
            isEndDate: false,
            isLastDate: true,
            isDaysBack: true,
            isBarsBack: false
        },
        {
            id: 8,
            method: 'STREAM',
            title: 'Stream Tick Bars',
            value: `/v2/stream/tickbars/${symbol}/${interval}/${barsBack}?SessionTemplate=USEQPreAndPost`,
            url: `/v2/stream/tickbars/$symbol/$interval/$barsBack?SessionTemplate=USEQPreAndPost`,
            isUnit: false,
            isInteral: true,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: true
        },
        {
            id: 9,
            method: 'GET',
            title: 'Get Symbol List',
            value: `/v2/data/symbollists`,
            url: `/v2/data/symbollists`,
            isUnit: false,
            isInteral: false,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
    ];
    const [api, setApi] = useState(apis[6]);
    const units = [
        {
            id: 1, 
            title: 'Minute',
            value: 'Minute'
        },
        {
            id: 2, 
            title: 'Daily',
            value: 'Daily'
        },
        {
            id: 3, 
            title: 'Weekly',
            value: 'Weekly'
        },
        {
            id: 4, 
            title: 'Monthly',
            value: 'Monthly'
        }
    ];
    const intervals = [
        {
            id: 1, 
            title: 1,
            value: 1
        }, 
        {
            id: 5, 
            title: 5,
            value: 5
        }, 
        {
            id: 10, 
            title: 10,
            value: 10
        }, 
        {
            id: 15, 
            title: 15,
            value: 15
        }, 
        {
            id: 30, 
            title: 30,
            value: 30
        }, 
        {
            id: 60, 
            title: 60,
            value: 60
        }, 
        {
            id: 240, 
            title: 240,
            value: 240
        }, 
        {
            id: 480, 
            title: 480,
            value: 480
        }
    ];
    // const enterKeyHandler = (event) => {
    //     if (e.key === 'Enter') {
    //         console.log('do validate');
    //     }
    // };
    const getMarketData = () => {
        const payload = {
            method: method,
            url: url 
        };

        ////AlphaAdvantage APIs
        // setMarketDataStream(loading);
        // http.getintraday(symbol, setMarketDataStream);
        // http.getdaily(symbol, setMarketDataStream);

        ////Tradestation APIs
        if(url.indexOf('barchart') > 0){            
            http.send(payload, setBarChartData);
        } else {
            http.send(payload, setMarketDataStream);
        };
    };

    // useEffect(() => {
    //     getMarketData();
        
    // }, [getMarketData]);

    const onSelectChange = (e, name, menuItems) => {
        const id = e.target.value;  
        menuItems.forEach((item) => {
            if(item.id === id){
                switch (name) {
                    case 'api':
                        setApi(item);
                        break;

                    case 'interval':
                        setInterval(item.value);
                        break;
                
                    case 'unit':
                        setUnit(item.value);
                        var intervalSelect = document.getElementById('interval')
                        intervalSelect.innerHTML = (item.value !== 'Minute') ? 1: interval;
                        // console.log({unit: item.value, select: intervalSelect, interval})
                        break;
                
                    default:
                        break;
                }
                
		        // console.log(interval);
            }
        } )
    }

    const onDateChange = (e, name) => {
        var date = new Date(e.target.value);
        // var newDate = new Date(date.setDate(date.getDate() + 2));
        // date = helper.formatDate(newDate);
        // console.log({name, origDate: e.target.value, date, newDate})
        switch (name) {
            case 'startDate':
                setStartDate(date);
                break;

            case 'endDate':
                setEndDate(date);
                break;

            case 'lastDate':
                setLastDate(date);
                break;
            default:
                break;
        }

    }
	
    var timer;
    const onTextChanged = (e, name) => {        
        if (e.key === 'Enter') {
            onButtonClick(e, "GetData");
            return;
        }
        
        clearTimeout(timer);

        timer = setTimeout(() => {
            switch (name) {
                case 'daysBack':
                    setDaysBack(e.target.value);
                    break;
                case 'barsBack':
                    setBarsBack(e.target.value);
                    break;
                case 'symbol':
                    setSymbol(e.target.value);
                    break;
                default:
                    break;
            }
        }, 1000);
    }

    const onButtonClick = (e, name) => { 
        e.preventDefault();
        if(name === 'GetData')
            resolveUrl();
        else
            http.clearApiInterval();
    }

    const resolveUrl = () => {
        const resolvedUrl = api.url.replace('$symbol', symbol).replace('$unit', unit).replace('$interval', unit !== 'Minute' ? 1 : interval).replace('$startDate', helper.newDate(startDate))
                    .replace('$endDate', helper.newDate(endDate)).replace('$lastDate', helper.newDate(lastDate)).replace('$daysBack', daysBack).replace('$barsBack', barsBack);
        
        setUrl(resolvedUrl);
        setMethod(api.method);
        getMarketData();
        console.log(url);
    }

    return (
        <div className={parentClasses.page} >
            <Col className={classes.search}>
                    <InputLabel className={parentClasses.pageTitle}>Stock Symbol:</InputLabel>
                    <SimpleTextField id="symbol" label="Symbol" name="symbol" onChange={onTextChanged} defaultValue={symbol} />
                    <SimpleButton text="Get Data" name="GetData" onClick={onButtonClick} />
                    <SimpleButton text="Stop Data" name="StopData" onClick={onButtonClick} />
            </Col>
            <Col className={classes.selectDiv}>
                <SimpleSelect parentStyles={useStyles} onSelectChange={onSelectChange} name="api" menuItems={apis} title="Select Api" defaultValue="7" />
                {api.isUnit ? <SimpleSelect parentStyles={useStyles} onSelectChange={onSelectChange} name="unit" menuItems={units} title="Select Unit" defaultValue="1" /> : ''}
                {api.isInteral ? <SimpleSelect parentStyles={useStyles} onSelectChange={onSelectChange} name="interval" menuItems={intervals} title="Select Interval" defaultValue={interval} /> : ''}
                {api.isStartDate ? <DatePicker parentStyles={useStyles} onDateChange={onDateChange} title="Start Date" name="startDate" /> : ''}
                {api.isEndDate ? <DatePicker parentStyles={useStyles} onDateChange={onDateChange} title="End Date" name="endDate" /> : ''}
                {api.isLastDate ? <DatePicker parentStyles={useStyles} onDateChange={onDateChange} title="Last Date" name="lastDate" /> : ''}
                {api.isDaysBack ? <SimpleTextField parentStyles={useStyles} id="daysBack" name="daysBack" label="Days Back" onChange={onTextChanged} defaultValue={daysBack} type="number" /> : ''}
                {api.isBarsBack ? <SimpleTextField parentStyles={useStyles} id="barsBack" name="barsBack" label="Bars Back" onChange={onTextChanged} defaultValue={barsBack} type="number" /> : ''}
            </Col>
            
            <Col className={parentClasses.col8}>
                <TabPanel 
                    url={url}
                    userData={marketDataStream}
                    barChartData={barChartData} 
                />
            </Col>
        </div>
    )

    
}
export default Market

const useStyles = makeStyles((theme) => ({
    search: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center'
    },
    textInput: {
        fontFamily: "'Roboto', sans-serif",
        color: '#000',
        fontSize: '1.2rem',
        margin: '0 auto',
        padding: '.7rem 2rem',
        borderRadius: '0.2rem',
        width: '20%',
        border: '0.3rem solid',
        transition: 'all 0.3s',
      },
      selectDiv:{
          display: 'block',
          flexDirection: 'row',
      },
      selectDivChild: {
          display: 'inline-block',
      }
}));

