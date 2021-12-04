var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { sequelize } = require('./models');
const config = require('./config');

var app = express();
app.use(morgan('combine'));
app.use(bodyParser.json());
app.use(cors());

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/AuthenticationRoutes')(app);
require('./routes/EmployeeRoutes')(app);
require('./routes/ContractRoutes')(app);
require('./routes/HolidaysRoutes')(app);
require('./routes/UserHolidaysRoutes')(app);

app.use(function(err, req, res, next) {
    if (
        err.name === 'SequelizeValidationError' ||
        err.name === 'SequelizeUniqueConstraintError'
    ) {
        const errors = err.errors.map(e => {
            return { message: e.message, param: e.path };
        });

        return res.status(400).json({ errors });
    }

    if (err.message === 'Validation failed') {
        const errors = err.array().map(e => {
            return { message: e.msg, param: e.param };
        });

        return res.status(422).json({ errors });
    }

    console.error(err);
    return res.status(500).send('We messed something. Sorry!');
});

app.listen(config.port, config.host, () => {
    console.log(`express -> HOST: ${config.host} PORT: ${config.port}`);
});

module.exports = app;
