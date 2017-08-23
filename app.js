/** 
# Copyright 2017 IBM All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Passport and Db configuration
var passport = require('passport'),
	Strategy = require('passport-local').Strategy,
	db = require('./lib/db'),
	session = require('express-session'),
	Db2Store = require('connect-db2')(session),
	sessionStore = new Db2Store({
		dsn: process.env.DASHDB_DSN
	});

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
	store: sessionStore // We save the session in a table in our dashDb
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Strategy(
	(username, password, cb) => {
	// This will be your method to check username/password, but we will hardcode this, as an example.
		db.findByEmployeeCode(username, (err, data) => {
			if(err) return cb(err);
			if(!user) return cb(null, false);
			return cb(null, user);
		});
	//	db.findByUsername(username, (err, user) => {
	// 		if (err) {
	// 			return cb(err);
	// 		}
	// 		if (!user) {
	// 			return cb(null, false);
	// 		}
	// 		// TODO: is there a better way to check this?
	// 		if (user[0].COMPANY_PASSWORD != password) {
	// 			return cb(null, false);
	// 		}
	// 		return cb(null, user);
	// 	});
	}
));
passport.serializeUser(function (user, cb) {
	cb(null, user[0].EMPLOYEE_CODE);
});
passport.deserializeUser(function (code, cb) {
	db.findByEmployeeCode(code, function (err, user) {
		if (err) {
			return cb(err, null);
		}
		cb(null, user);
	});
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;