const express = require("express");
const mongoose = require('mongoose')
const app = express();
const ShortUrl = require('./models/shortUrl')
const cors = require("cors");
const path = require('path');
require('dotenv').config()

mongoose.connect(process.env.DB, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    console.log('yes');
}).catch(()=>{
    console.log('no');
})

app.use(cors())
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);