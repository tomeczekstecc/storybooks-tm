const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello world!');
});

router.get('/dashboard', (req, res) => {
  res.render('index/welcome');
});



module.exports = router