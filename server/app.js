var sys = require('sys');
var exec = require('child_process').exec;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);
var mdns = require('mdns');
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyWebApi = new SpotifyWebApi();

var connectedUsers = 0;
var currentSpotifyState = '';
var timer = false;
var albumArtCache = {};
checkIfSpotifyStateHasChanged();

app.use(bodyParser());
app.use('/', express.static(global.__dirname + '/../public'));


io.on('connection', function(socket) {

    // Report connection count.
    connectedUsers++;
    console.log('User connected. Currently ' + connectedUsers + ' connected.');

    // Emit the current info for the latest connected client.
    io.emit('spotify.info', currentSpotifyState);
    if (currentSpotifyState !== '') {
        getAlbumArt(currentSpotifyState.uri, currentSpotifyState.artist, currentSpotifyState.album, function (artwork) {
            io.emit('spotify.artwork', artwork);
        });
    }

    // Report connection count.
    socket.on('disconnect', function() {
        connectedUsers--;
        console.log('User disconnected. Currently ' + connectedUsers + ' connected.');
    });

    // Handle requests from clients.
    socket.on('spotify.request', function(request){
        makeSpotifyRequest(request, function() {
            checkIfSpotifyStateHasChanged();
        });
    });
});

/*
Compares the current state of Spotify to the last stored one.
If it's changed, an event is emitted to update clients.
 */
function checkIfSpotifyStateHasChanged() {
    makeSpotifyRequest('info', function(error, stdout, stderr) {
        if (!error) {
            try {
                var anythingHasChanged = false;
                var newSpotifyState = JSON.parse(stdout);
                if (currentSpotifyState !== '') {
                    if (newSpotifyState.uri != currentSpotifyState.uri) {
                        anythingHasChanged = true;
                        getAlbumArt(newSpotifyState.uri, newSpotifyState.artist, newSpotifyState.album, function(artwork) {
                            io.emit('spotify.artwork', artwork);
                        });
                    }
                    else if (newSpotifyState.volume != currentSpotifyState.volume) {
                        anythingHasChanged = true;
                    }
                    else if (newSpotifyState.player != currentSpotifyState.player) {
                        anythingHasChanged = true;
                    }
                }
                currentSpotifyState = newSpotifyState;
                if (anythingHasChanged) {
                    io.emit('spotify.info', currentSpotifyState);
                }

            } catch (ex) {}
        }
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            checkIfSpotifyStateHasChanged();
        }, 500);
    });
}

function getAlbumArt(uri, artist, album, callback) {

    var cacheFormat = artist + '_' + album;

    // See if it's already in the cache.
    if (albumArtCache[cacheFormat]) {
        callback(albumArtCache[cacheFormat]);
    }
    else {

        uri = uri.replace('spotify:track:', '');

        spotifyWebApi.getTrack(uri)
            .then(function(data) {
                if (data.album) {
                    if (data.album.images) {
                        if (data.album.images.length > 0) {

                            var artwork = data.album.images[0].url || '';

                            // Add to cache.
                            if (artwork !== '') {
                                albumArtCache[cacheFormat] = artwork;
                            }

                            // Callback.
                            callback(artwork);
                        }
                    }
                }
            })
            .catch(function(error) {
                console.log('Spotify API error', error);
                callback('');
            })
        ;
    }
}

function formSpotifyAlbumArtRequest(uri) {
    uri = uri.replace('spotify:track:', '');
    return '/v1/tracks/' + uri;
}

function processSpotifyApiResponse(response) {

}

// Calls an Applescript to get the Spotify info.
function makeSpotifyRequest(command, callback) {
    exec('osascript deps/SpotifyControl.scpt ' + command, function(error, stdout, stderr) {
        callback(error, stdout, stderr);
    });
}

httpServer.listen(7768, function() {
    console.log('Spotify server is running!');

    var ad = mdns.createAdvertisement(mdns.tcp('http'), 7768);
    ad.start();
});
