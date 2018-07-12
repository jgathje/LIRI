require("dotenv").config();
var keys = require("./keys.js")
var Twitter = require("twitter")
var Spotify = require('node-spotify-api');
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var search = process.argv[2];
var liriSearch = process.argv[3];

for (var i = 4; i < process.argv.length; i++) {
    liriSearch = liriSearch + " " + process.argv[i]
}

function appendSpot(info) {
    fs.appendFile("log.txt", info, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function appendOMDB(info) {
    fs.appendFile("log.txt", info, function (err) {
        if (err) {
            console.log(err)
        }
    })
}

function liriTwitter() {
    client.get('search/tweets', { q: 'BobLobl03697538', count: "20" }, function (error, tweets) {
        if (error) {
            console.log(error)
        }
        fs.appendFile("log.txt", "***The Last Twenty Tweets***\n", function (err) {
            if (err) {
                console.log(err)
            }
        })
        for (var i = 0; i < tweets.statuses.length; i++) {
            console.log(JSON.stringify(tweets.statuses[i].text, null, 2));
            fs.appendFile("log.txt",
                JSON.stringify(tweets.statuses[i].text, null, 2) + "\n"
                , function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
        }
        fs.appendFile("log.txt", "-------------------------------------------------------" + "\n", function (err) {
            if (err) {
                console.log(err)
            }
        });
    });
}

function liriSpotify() {
    if (liriSearch === undefined) {
        spotify.search({ type: 'track', query: "The Sign Ace Of Base", limit: "1" }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var songData = "***You Searched***" + "\n" +
                "Artist: " + data.tracks.items[0].artists[0].name +
                "\n" +
                "Song Name: " + data.tracks.items[0].name +
                "\n" +
                "Song Preview: " + data.tracks.items[0].external_urls.spotify +
                "\n" +
                "Album Name: " + data.tracks.items[0].album.name +
                "\n" + "-------------------------------------------------------" + "\n"
            console.log(songData);
            appendSpot(songData);
        });
    }
    else spotify.search({ type: 'track', query: liriSearch, limit: "1" }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songData = "***You Searched***" + "\n" +
            "Artist: " + data.tracks.items[0].artists[0].name +
            "\n" +
            "Song Name: " + data.tracks.items[0].name +
            "\n" +
            "Song Preview: " + data.tracks.items[0].external_urls.spotify +
            "\n" +
            "Album Name: " + data.tracks.items[0].album.name +
            "\n" + "-------------------------------------------------------" + "\n"
        console.log(songData);
        appendSpot(songData);
    });
}

function liriMovie() {
    var request = require("request");
    if (liriSearch === undefined) {
        let movie = "Mr. Nobody"
        console.log(movie)
        request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var movieData = "***You Searched***" +
                    "\n" +
                    "Title: " + JSON.parse(body).Title +
                    "\n" +
                    "Year: " + JSON.parse(body).Year +
                    "\n" +
                    "The movie's rating is: " + JSON.parse(body).imdbRating +
                    "\n" +
                    "Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value +
                    "\n" +
                    "Country that unleashed this hellstorm on the world: " + JSON.parse(body).Country +
                    "\n" +
                    "Language: " + JSON.parse(body).Language +
                    "\n" +
                    "Plot summary: " + JSON.parse(body).Plot +
                    "\n" +
                    "Staring: " + JSON.parse(body).Actors +
                    "\n" + "-------------------------------------------------------" + "\n"
                console.log(movieData);
                appendOMDB(movieData);
            }
        });
    }
    else request("http://www.omdbapi.com/?t=" + liriSearch + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieData = "***You Searched***" +
                "\n" +
                "Title: " + JSON.parse(body).Title +
                "\n" +
                "Year: " + JSON.parse(body).Year +
                "\n" +
                "The movie's rating is: " + JSON.parse(body).imdbRating +
                "\n" +
                "Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value +
                "\n" +
                "Country that unleashed this hellstorm on the world: " + JSON.parse(body).Country +
                "\n" +
                "Language: " + JSON.parse(body).Language +
                "\n" +
                "Plot summary: " + JSON.parse(body).Plot +
                "\n" +
                "Staring: " + JSON.parse(body).Actors +
                "\n" + "-------------------------------------------------------" + "\n"
            console.log(movieData);
            appendOMDB(movieData);
        }
    });
}

function runLiri() {
    if (search === "my-tweets") {
        liriTwitter();
    }
    else if (search === "spotify-this-song") {
        liriSpotify();
    }
    else if (search === "movie-this") {
        liriMovie();
    }
}

if (search === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        if (dataArr[0] === "do-what-it-says") {
            console.log("I'm sorry, Dave. I'm afraid I can't do that.")
        }
        else {
            search = dataArr[0]
            liriSearch = dataArr[1]
            runLiri();
        }
    });
}
else runLiri();