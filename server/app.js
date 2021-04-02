var express = require('express');
var path = require('path');
var cookieSession = require('cookie-session');
const { ts } = require('./config');
var morgan = require('morgan')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const logoutRouter = require('./routes/logout');
const profileRouter = require('./routes/profile');
const marketdataRouter = require('./routes/marketdata');

const app = express();

//logger
app.use(morgan('common'));

const PORT = process.env.PORT || 3001;

app.use(
  cookieSession({
      secret: ts.cookie_secret
  })
)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/admin', adminRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/profile', profileRouter);
app.use('/api/marketdata', marketdataRouter);


// error handler
app.use(function(err, req, res, next) {
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Find the server at: http://localhost:${PORT}/`); // eslint-disable-line no-console
});

module.exports = app;
