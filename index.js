require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

/* Import body-parser from package */ 
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

/* Define counter and object to save websites inserted */
let counter = 1;
const shortenUrls = {};

app.use(cors());

/* Middleware to handle URL encoded data */
app.use(bodyParser.urlencoded({extended: false}));
// "extended" is a configuration option that tells body-parser which parsing needs to be used. When "extended=false" it uses the classic encoding querystring library. When "extended=true" it uses qs library for parsing

app.post("/api/shorturl", function (req, res) {
  console.log(req.body.url)
  const url = req.body.url;
  const startRegex = /^((https|http):\/\/)(www\.)?/;
  //const endRegex = /(.com$)/;

  /* If url is valid */
  if(startRegex.test(url) /*&& endRegex.test(url)*/) {
    console.log("Valid URL");
    shortenUrls[counter] = url;
    res.send({ original_url: url, short_url: counter})
    counter++;
    
    console.log(shortenUrls)
  } else {
    console.log("Invalid URL");
    res.send({ error: 'invalid url' });
  }
})

app.get('/api/shorturl/:id', function(req, res) {
  const id = req.params.id;
  const url = shortenUrls[id];
  res.redirect(url);
});

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// app.get('/api/shorturl', function(req, res) {
//   res.json({ greeting: 'hello API' });
// });


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
