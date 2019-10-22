const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// 0load user model
require('./models/Users');
//Passport cobfig
require('./config/passport')(passport);

//load routes
const auth = require('./routes/auth');

//load keys file
const keys = require('./config/keys');

mongoose.Promise = global.Promise;
//mongoose connect
mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => {
    console.log(err);
  });

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

//
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);

//passport midlleware
app.use(passport.initialize());
app.use(passport.session());

//set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next()
});

//use routes
app.use('/auth', auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}. Go to http://localhost:${PORT}`)
);
