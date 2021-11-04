const express = require("express");
const mongoose = require('mongoose')
const app = express();
const ShortUrl = require('./models/shortUrl')
const cors = require("cors");
require('dotenv').config()

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(()=>{
    console.log('connected to database successfully');
}).catch(()=>{
    console.log('connection to database failed');
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

app.get('/clear', async (req, res) => {
  await ShortUrl.deleteMany({})
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.get('/clearone/:shortUrlId', async (req, res) => {
  await ShortUrl.deleteOne({short : req.params.shortUrlId })
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT}:`);
});
  
