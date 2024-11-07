const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

// Add these lines to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure a custom HTTPS agent to skip SSL verification
const agent = new https.Agent({  
    rejectUnauthorized: false
});

// Enable CORS
app.use(cors({
    origin: 'http://127.0.0.1:8000', // or 'http://[::1]:5173' if that's your dev environment
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Route to proxy requests to the external API
app.use('/api1', async (req, res) => {
    try {
        console.log(req.url);
        const apiUrl = `https://api.vultrinference.com/v1${req.url}`;
        const response = await axios({
            url: apiUrl,
            method: req.method,
            headers: {
                authorization: `Bearer ${process.env.api_key}`,
                ...req.headers,
            },
            data: req.body,
            httpsAgent: agent // Use custom agent to ignore SSL verification
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(error.response?.status || 500).send({
            error: error.message,
            details: error.response?.data || null,
        });
    }
});
app.use('/api2',async(req,res)=>{
    try{
        console.log(req.body);
    const {text,voice}=req.body;
   const apiUrl =  `https://api.vultrinference.com/v1${req.url}`
   console.log(apiUrl);
   const response = await axios({
    
    url: apiUrl,
    method: req.method,
    headers: {
        authorization: `Bearer ${process.env.api_key}`,
        ...req.headers,
    },
    body:JSON.stringify({
        "model": "bark",
        "input":text,
        "voice":voice
      }),
    httpsAgent: agent // Use custom agent to ignore SSL verification
});
res.status(response.status).json(response.data);

} catch(error){
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).send({
        error: error.message,
        details: error.response?.data || null,
    });
}
})  

app.listen(4000, () => console.log('Proxy server running on http://localhost:4000'));
