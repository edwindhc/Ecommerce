const express = require('express');
const morgan = require('morgan');
const routes = require('./routes/index');
const error = require('./middlewares/error')
const cors = require('cors');
const path = require('path');

const app = express();
// app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/client/build/index.html')))
// app.get('/test', (req, res) => res.sendFile(path.join(__dirname + '/client/build/index.html')))
//middlewares
app.use(morgan('dev'));
app.use(express.json());

app.use(cors());

//routes
app.use(routes);

app.use((err, req, res, next) => res.json(err))

// error handler
app.use(error.handler);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/client/build')));
}

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

module.exports = app;