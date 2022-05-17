const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const MongoStore = require('connect-mongo')(session);

//INIT Config
dotenv.config({ path: './config/.env'})
console.log('Config INITIALIZED')

//INIT Passport
require('./config/passport')(passport)
console.log('OAuth2 INITIALIZED')

connectDB()

const app = express()

//INIT Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//INIT Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' === '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

console.log('Method Overrides INITIALIZED')

//LOGGER
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

console.log('Parser INITIALIZED')

//HBS PRE-INIT
const { 
    formatDate, 
    stripTags, 
    truncate, 
    editIcon,
    select 

} = require('./helpers/hbs')

console.log('Handlebars PRE-INITIALIZED')

//HBS
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate, 
        editIcon,
        select}, 
    defaultLayout: 'main', 
    extname: '.hbs'}));

app.set('view engine', '.hbs')

console.log('Handlebars INITIALIZED')

//PRE-INIT Passport Middleware
app.use(session({
    secret: 'lmao bruh',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

console.log('PSP Middleware PRE-INITIALIZED')

//INIT Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

console.log('PSP Middleware INITIALIZED')

//GLOBAL VARS
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

//STATIC
app.use(express.static(path.join(__dirname, 'public')));

//INIT Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

console.log('Routes INITIALIZED')

const PORT = process.env.PORT || 3000

app.listen(
    PORT, console.log(`SERVER running on MODE: ${process.env.NODE_ENV} on PORT: ${PORT}`)
)