import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import './App.css';

function App() {

  const [ticker, setTicker] = useState({});
  const [tradingView, setTradingView] = useState({});
  const [config, setConfig] = useState({
    buy: 0,
    sell : 0,
    side: 'BUY',
    symbol: 'BTCUSDT'
  })

  const [profit, setProfit] = useState({
    value: 0,
    perc: 0,
    lastBuy: 0
  })

  function processData(ticker){
    const lastPrice = parseFloat(ticker.c);
    if(config.side === 'BUY' && config.buy > 0 && lastPrice <= config.buy){
      console.log('BUY' + lastPrice);
      config.side = 'SELL';
      
      setProfit({
        value: profit.value,
        perc: profit.perc,
        lastBuy: lastPrice
      })
    }
    else if(config.side === 'SELL' && config.sell > profit.lastBuy && lastPrice >= config.sell) {
      console.log('SELL' + lastPrice,);
      config.side = 'BUY';
      const lastProfit = lastPrice - profit.lastBuy;

      setProfit({
        value: profit.value + lastProfit,
        perc: profit.perc + (lastPrice * 100 / profit.lastBuy - 100),
        lastBuy: 0
      })
    }
  }

  const {lastJsonMessage} = useWebSocket('wss://stream.binance.com:9443/stream?streams=' + config.symbol.toLowerCase() + '@ticker', {
    onMessage: () => {
      if (lastJsonMessage && lastJsonMessage.data) {
        if (lastJsonMessage.stream === config.symbol.toLowerCase() + '@ticker') { 
          setTicker(lastJsonMessage.data);
          processData(lastJsonMessage.data);
        }
      }
    },
    onError: (event) => {
      alert(event);
    }
  })

  useEffect(() => {
    const tv = new window.TradingView.widget(
      {
        "autosize": true,
        "symbol": "BINANCE:" + config.symbol,
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "br",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "details": true,
        "container_id": "tradingview_56be8"
      }
    );
    setTradingView(tv);
  }, [config.symbol])

  function onSymbolChange(event){
    setConfig(prevState => ({ ...prevState, symbol: event.target.value }));
  }

  function onValueChange(event){
    console.log(event.target.value);
    setConfig(prevState => ({...prevState, [event.target.id]: parseFloat(event.target.value)}));
  }
  

  return (
    <div>
      <h1>SniperBot 1.0</h1>
      <div className="tradingview-widget-container">
        <div id="tradingview_56be8"></div>
      </div>
      <div className="dashboard">
        <div>
          <b>ALVO:</b><br />
          Symbol:
          <select id='symbol' defaultValue={config.symbol} onChange={onSymbolChange}>
            <option>BTCUSDT</option> 
            <option>ETHUSDT</option>
            <option>BNBUSDT</option> 
            <option>ADAUSDT</option>
            <option>LUNAUSDT</option>
            <option>LINKUSDT</option>
            <option>SOLUSDT</option>
            <option>SANDUSDT</option>
            <option>MANAUSDT</option>
            <option>CAKEUSDT</option> 
            <option>SHIBUSDT</option>                      
          </select><br />          
          buy at: <input type="number" id="buy" defaultValue={config.buy} onChange={onValueChange} /><br />
          sell at: <input type="number" id="sell" defaultValue={config.sell} onChange={onValueChange} /><br />
        </div>
        <div>
          <b>profit:</b><br />
          profit: {profit && profit.value.toFixed(8)}<br />
          profit %: {profit && profit.perc.toFixed(2)}<br />
        </div>              
      </div> 
    </div>
  );
}

export default App;
