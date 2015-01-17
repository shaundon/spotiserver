var socket = io();
document.addEventListener("DOMContentLoaded", function(event) {
    socket.on('spotify.info', function(json) {
        spotify.updatePlayerInfo(json);
    });
});

var spotify = {
    _makeRequest: function(action) {
        socket.emit('spotify.request', action);
    },
    updatePlayerInfo: function(json) {
        if (json.player === 'paused') {
            document.querySelector('.current-track').innerText = 'Paused';
            document.querySelector('.current-album').innerText = ' - ';
            document.querySelector('.current-artist').innerText = ' - ';
            document.querySelector('.current-volume').innerText = ' - ';
            document.querySelector('.current-uri').innerText = ' - ';
        }
        else {
            if (json.album) {
                document.querySelector('.current-album').innerText = json.album;
            }
            if (json.artist) {
                document.querySelector('.current-artist').innerText = json.artist;
            }
            if (json.track) {
                document.querySelector('.current-track').innerText = json.track;
            }
            if (json.volume) {
                document.querySelector('#volume').value = parseInt(json.volume)+1;
            }
            if (json.uri) {
                document.querySelector('.current-uri').innerHTML = "<a href='" + json.uri + "'>" + json.uri + "</a>";
            }
        }
    },
    pause: function() {
        this._makeRequest('pause');
    },
    play: function() {
        this._makeRequest('play');
    },
    next: function() {
        this._makeRequest('next');
    },
    previous: function() {
        this._makeRequest('previous');
    },
    info: function() {
        this._makeRequest('info');
    },
    volume: function(level) {
        this._makeRequest('volume ' + level);
    },
    song: function(uri) {
        this._makeRequest('play ' + uri);
    }
};