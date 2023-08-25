const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');
dotenv.config({ path: './config.env' })

// Creating the server
const server = http.createServer(app);

const DB = process.env.TAJIFY_DATABASE.replace('<PASSWORD>', process.env.TAJIFY_DATABASE_PASSWORD);
const PORT = process.env.PORT || 8080;

// Database connection
mongoose.connect(DB)
.then(con => {
    console.log('Database connected successfully!');
})
.catch(err => {
    console.log(err)
});

// Listening to the server
server.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});
