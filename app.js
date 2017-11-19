var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
    ejs = require('ejs');

// Create a client instance
let AWS = require('aws-sdk');
AWS.config.update({
    credentials: new AWS.Credentials('', ''),
    region: 'us-east-2'
});
let options = {
  hosts: [ '' ], // array of amazon es hosts (required)
  connectionClass: require('http-aws-es'), // use this connector (required)
};
let es = require('elasticsearch').Client(options);

app.use(bodyParser.urlencoded({extended: true}));
// app.set("view engine", "ejs");
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/views'));


// dropdown list search different markers
app.get("/keyword", function(req, res){
    var searchWord = req.query.keyword;
    es.search({
        index: 'twitters',
        type: 'tweet',
        body: {
            query: {
                match: {
                    topic: searchWord
                }
            }
        },
        size: 5000
    }).then(function(esRes){
        console.log('Number of tweets retrieved (' + searchWord + '):' + esRes.hits.total);
        var hits = esRes.hits.hits;
        res.contentType('application/json');
        res.send(JSON.stringify(hits));
    },function (err) {
        console.trace(err.message);
    });
});


// realize elastic search 
app.get("/geospatial", function(req, res){
    // console.log("abcdef")
    es.search({
        index: 'twitters',
        type: 'tweet',
        body: {
            query: {
                bool: {
                    must: {
                        match_all: {}
                    },
                    filter: {
                        geo_distance: {
                            distance: "1000km",
                            geo: {
                                lat: req.query.lat,
                                lon: req.query.lng
                            }
                        }
                    }
                }
            }
        },
        size: 1000
    }).then(function(esRes){
        console.log('Number of tweets retrieved (geo): ' + esRes.hits.total);
        var hits = esRes.hits.hits;
        res.contentType('application/json');
        res.send(JSON.stringify(hits));
    },function(err){
        console.trace(err.message);
    });
});

app.get("/introduction", function(req, res){
    res.render("introduction");
})

app.get("/elastic", function(req, res){
    res.render("elasticsearch");
})

app.get("/", function(req, res){
    res.render("home");
});

app.listen(8081, '127.0.0.1');
