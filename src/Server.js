const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');

const API_KEY= '8qXkGucBrkJRH2OvLFoMH7yzYo5scCqCgIjBj1nPuDAmbN11PUUCXheWDtUt71Lk'
const SECRET_KEY= '2L9DKF25r2E7u4bjKtSGvbTITaFqQ0x91M0R9JRk1fPnFipdubE1PFuJwzlSJbGR'

const app = require('express')();

app.use(require('cors')());

app.post('/:side/:symbol/:quantity', (req, res) =>{
    const { side, symbol, quantity } = req.params;

    const data = { symbol, side, quantity, type: 'MARKET', timestamp: Date.now(), recvWindow: 60000 };

    const signature = crypto.createHmac('sha256', API_SECRET)
        .update(querystring.stringify(data))
        .digest('hex');
    
    const newData = {...data, signatute};
    const url = 'http://testnet.binance.vision/api/v3/order?' + queristyng.stringfy(newdata);

    axios.post(url, null, { headers: { 'X-MBX-APIKEY': API_KEY } })
})

app.listen(3001, () => {
    console.loge('server is running');
})