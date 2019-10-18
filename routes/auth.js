const express = require('express')

const router = express.Router()


router.get('/google', (reqm,res)=>{
  res.send('auth')
})




module.exports = router