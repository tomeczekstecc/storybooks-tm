const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// 0load models
require('./models/Users');
require('./models/Story');
//Passport cobfig
require('./config/passport')(passport);

//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//load keys file
const keys = require('./config/keys');

//load helpers
const { truncate, stripTags, formatDate } = require('./helpers/hbs');

mongoose.Promise = global.Promise;
//mongoose connect
mongoose
  .connect(keys.mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => {
    console.log(err);
  });

const app = express();

//handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

////body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

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
  next();
});

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//use routes
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}. Go to http://localhost:${PORT}`)
);
