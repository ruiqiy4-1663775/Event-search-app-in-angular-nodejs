const express = require('express')
var cors = require('cors')
const axios = require('axios');
var geohash = require('ngeohash');
var SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.use(cors())
app.use(express.static('hw8'))

app.get('/search', (req, res) => {
  var geohashResult = geohash.encode(req.query.latitude, req.query.longitude, precision=7)
  ticketmasterBaseUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=VWHOUdUAYiGRVynzacsAazCX9AlaG34M&sort=date,asc" 
  ticketmasterBaseUrl += "&geoPoint=" + geohashResult
  ticketmasterBaseUrl += "&radius=" + req.query.distance
  if(req.query.category != 'All'){
    if(req.query.category == 'Music'){
      segmentId = 'KZFzniwnSyZfZ7v7nJ'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
    else if(req.query.category == 'Sports'){
      segmentId = 'KZFzniwnSyZfZ7v7nE'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
    else if(req.query.category == 'ArtsTheatre'){
      segmentId = 'KZFzniwnSyZfZ7v7na'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
    else if(req.query.category == 'Films'){
      segmentId = 'KZFzniwnSyZfZ7v7nn'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
    else if(req.query.category == 'Miscellaneous'){
      segmentId = 'KZFzniwnSyZfZ7v7n1'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
  }
  ticketmasterBaseUrl += "&unit=miles"
  ticketmasterBaseUrl += "&keyword=" + req.query.keyword
  axios.get(ticketmasterBaseUrl)
  .then(response => {
    console.log(response.data)
    res.header("Access-Control-Allow-Origin","*");
    res.send(JSON.stringify(response.data))
  })
})

// Search venue details
app.get('/venue', (req, res) => {
  console.log("req.query:")
  console.log(req.query)
  axios.get("https://app.ticketmaster.com/discovery/v2/venues?apikey=VWHOUdUAYiGRVynzacsAazCX9AlaG34M&keyword=" + req.query.keyword.replace(' ', '%20'))
  .then(response => {
    res.header("Access-Control-Allow-Origin","*");
    res.send(JSON.stringify(response.data));
  })
});

// referenced on google regarding spotifyapi
app.get('/spotify', (req, res) => {
  console.log("req.query::")
  console.log(req.query)
  var spotifyApi = new SpotifyWebApi({
    clientId: 'cd1d239d6a7b4a71bfb5e4fb9ea1b579',
    clientSecret: 'f76c7399e1354769b184780920f7b568'
  });
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token is ' + data.body['access_token']);

      var spotifyApi = new SpotifyWebApi({
        clientId: 'cd1d239d6a7b4a71bfb5e4fb9ea1b579',
        clientSecret: 'f76c7399e1354769b184780920f7b568'
      });
      spotifyApi.setAccessToken(data.body['access_token']);

      var spotifyApi = new SpotifyWebApi({
        accessToken: data.body['access_token']
      });

      spotifyApi.searchArtists(req.query['artist']).then(
        function(data) {
          console.log("artist:", data.body);
          res.header("Access-Control-Allow-Origin","*");
          res.send(JSON.stringify(data.body));
          console.log("artists send finished!")
        },
        function(err) {
          console.log('Something went wrong!', err);
        }
      );
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
});

app.get('/spotifyAlbum', (req, res) => {
  console.log("req.query::")
  console.log(req.query)
  var spotifyApi = new SpotifyWebApi({
    clientId: 'cd1d239d6a7b4a71bfb5e4fb9ea1b579',
    clientSecret: 'f76c7399e1354769b184780920f7b568'
  });
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token is ' + data.body['access_token']);

      var spotifyApi = new SpotifyWebApi({
        clientId: 'cd1d239d6a7b4a71bfb5e4fb9ea1b579',
        clientSecret: 'f76c7399e1354769b184780920f7b568'
      });
      spotifyApi.setAccessToken(data.body['access_token']);

      var spotifyApi = new SpotifyWebApi({
        accessToken: data.body['access_token']
      });

      spotifyApi.getArtistAlbums(req.query['id'] ,{ limit: 3}).then(
        function(data) {
          console.log("artistalbum:", data.body);
          res.header("Access-Control-Allow-Origin","*");
          res.send(JSON.stringify(data.body));
          console.log("artists album send finished!")
        },
        function(err) {
          console.log('Something went wrong!', err);
        }
      );
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );
});

app.get('/autocomplete', (req, res) => {
  console.log("req.query::::")
  console.log(req.query)
  axios.get('https://app.ticketmaster.com/discovery/v2/suggest?apikey=VWHOUdUAYiGRVynzacsAazCX9AlaG34M&keyword=' + req.query.keyword)
  .then(response => {
    res.header("Access-Control-Allow-Origin","*");
    res.send(JSON.stringify(response.data._embedded));
  })
  .catch(error => {
    console.log(error);
  });
  
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});