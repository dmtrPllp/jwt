const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT | 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewURLParser: true,
            useUnifiedTopology:true
        });
        app.listen(PORT, () => {
            console.log('Server is listened!', PORT);
        })
    } catch (e) {
        console.log(e);
    }
}

start();