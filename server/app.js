var sys = require('sys');
var exec = require('child_process').exec;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var connectedUsers = 0;
var currentSpotifyState = '';
var timer = false;
checkIfSpotifyStateHasChanged();

app.use(bodyParser());
app.use('/', express.static(global.__dirname + '/../public'));


io.on('connection', function(socket) {

    // Report connection count.
    connectedUsers++;
    console.log('User connected. Currently ' + connectedUsers + ' connected.');

    // Emit the current info for the latest connected client.
    io.emit('spotify.info', currentSpotifyState);

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
                var hasChanged = false;
                var newSpotifyState = JSON.parse(stdout);
                if (currentSpotifyState !== '') {
                    if (newSpotifyState.uri != currentSpotifyState.uri) {
                        hasChanged = true;
                    }
                    else if (newSpotifyState.volume != currentSpotifyState.volume) {
                        hasChanged = true;
                    }
                    else if (newSpotifyState.player != currentSpotifyState.player) {
                        hasChanged = true;
                    }
                }
                currentSpotifyState = newSpotifyState;
                if (hasChanged) {
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

// Calls an Applescript to get the Spotify info.
function makeSpotifyRequest(command, callback) {
    exec('osascript deps/SpotifyControl.scpt ' + command, function(error, stdout, stderr) {
        callback(error, stdout, stderr);
    });
}

http.listen(7768, function() {
    console.log('Spotify server is running!');
});
