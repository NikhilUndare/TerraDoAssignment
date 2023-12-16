const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000
const router = require('./Routes/route')
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect(process.env.MONGODB_URL + process.env.MONGODB_NAME)
    .then((response)=>{
       console.log("connected to mongo dB successfully!")
    })
    .catch((err)=>{
       console.log("failed to connect to mongo dB" , err)
    })

app.use('/api',router);

app.use((req,res)=>{
    res.send("app is running successfully")
})

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})