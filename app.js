var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");

// Create a client instance
let AWS = require('aws-sdk');
AWS.config.update({
    credentials: new AWS.Credentials('AKIAIAD5C3VLZFIUN7UA', '4n8CAPqZEgo6JJZTjN9lKvsCOwhp+x3VjiX7+0V3'),
    region: 'us-east-2'
});
let options = {
  hosts: [ 'https://search-cc-twitter-py2dgskljuk7wo3ve5gmux3q4q.us-east-2.es.amazonaws.com' ], // array of amazon es hosts (required)
  connectionClass: require('http-aws-es'), // use this connector (required)
};
let es = require('elasticsearch').Client(options);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("views"));

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
    }).then(function(elasticsearchRes){
        var hits = elasticsearchRes.hits.hits;
        res.contentType('application/json');
        res.send(JSON.stringify(hits));
    },function (err) {
        console.trace(err.message);
    });
});

app.get("/", function(req, res){
    res.render("home");
});

app.listen(8081, '127.0.0.1');