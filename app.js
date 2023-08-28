const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const userRouter = require('./routes/userRoute');
const blogRouter = require('./routes/blogRoute');
const walletRouter = require('./routes/walletRoute');

const app = express();

// Middelwares
app.use(express.json());
app.use(morgan('dev'));
// app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log('Fecthing data...');
    next();
})
  

// Routes Endpoints
// Mounting our Endpoints (Middleware)
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);
// app.use('/api/wallets', walletRouter);

module.exports = app;