var socket = io();
document.addEventListener("DOMContentLoaded", function(event) {
    FastClick.attach(document.body);
    spotify.currentState = spotify.states.PAUSE;
    socket.on('connect', function() {
        spotify.handleConnection();
    });
    socket.on('disconnect', function() {
        spotify.handleDisconnection();
    });
    socket.on('spotify.info', function(json) {
        spotify.updatePlayerInfo(json);
    });
});

var spotify = {
    states: {
        PLAY: 1,
        PAUSE: 0
    },
    currentState: null,
    _makeRequest: function(action) {
        socket.emit('spotify.request', action);
    },
    updatePlayerInfo: function(json) {
        if (json.player === 'paused') {
            this.currentState = this.states.PAUSE;
            document.querySelector('.play-pause-toggle i').className = "fa fa-play";
        }
        else {
            this.currentState = this.states.PLAY;
            document.querySelector('.play-pause-toggle i').className = "fa fa-pause";
        }

        if (json.album) {
            replaceTextWithFade(document.querySelector('.current-album'), 'faded-out', 150, json.album);
        }
        if (json.artist) {
            replaceTextWithFade(document.querySelector('.current-artist'), 'faded-out', 150, json.artist);
        }
        if (json.track) {
            replaceTextWithFade(document.querySelector('.current-track'), 'faded-out', 150, json.track);
        }
        if (json.volume) {
            document.querySelector('#volume').value = parseInt(json.volume)+1;
        }
    },
    handleConnection: function() {
        document.querySelector('#no-connection-message').className = '';
    },
    handleDisconnection: function() {
        document.querySelector('#no-connection-message').className = 'visible';
    },
    togglePlay: function() {
        if (spotify.currentState === this.states.PLAY) {
            this._makeRequest('pause');
        }
        else {
            this._makeRequest('play');
        }
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

function replaceTextWithFade(element, fadeClass, fadeDuration, text) {

    // Only perform if the text has changed.
    if (text !== element.innerText) {

        // Fade out the element.
        element.classList.add(fadeClass);

        // When fade animation completes, change the
        // text and fade back in.
        setTimeout(function () {
            element.innerText = text;
            element.classList.remove(fadeClass);
        }, fadeDuration);
    }
}