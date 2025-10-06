
const express = require('express');
const app = express();
const index = require('./routes/index');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan')
const expressSession = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
require('./config/mongoose.-connection');

const userModel = require('./models/users-model');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressSession({
    resave : false,
    saveUninitialized : false,
    secret : "shhshh"
}))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/',index);

app.listen(3000);