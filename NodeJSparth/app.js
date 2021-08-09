require('dotenv').config()
const express = require('express')
const app = express()
const port = (process.env.PORT || '8000')
const bodyParser = require("body-parser")
const cors = require('cors')
var logger = require('morgan')
var path = require('path')

//enable CORS with various options.
app.use(cors())
// app.options('*', cors())
//app.use(cors({ origin: true }));

//json allow
app.use(bodyParser.json({limit: '50mb'}))

// Body Parser Middleware
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}))

//display time and service name in terminal
//:method :url :status :response-time ms - :res[content-length]
app.use(logger('dev'))


app.use(express.static('public'));


//Serves all the request which includes /images in the url from Images folder
app.use('/Images', express.static(__dirname + '/Images'));


// app.use(function (req, res, next) {
//   //Enabling CORS
//   process.env.Version = req.url.split('/')[2]
//   // res.header("Access-Control-Allow-Origin", "*")
//   // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization")
//   next()
// });

app.use('/api', require('./api'));
// app.get('/api', (req, res) => {
//   res.send('Hello World!...')
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})