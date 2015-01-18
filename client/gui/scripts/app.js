var net = require('net');
var Socket = net.Socket;
var SPOTIFY_PORT = 7768;
var foundServers = [];
var timer = false;
var TIMEOUT_MS = 10000;

function findSpotifyServers() {

    function checkPort(port, host) {
        var socket = new Socket();

        // Socket connection established, port is open
        socket.on('connect', function () {
            foundServers.push(host);
            handleFoundServer();
            socket.end();
        });
        socket.setTimeout(1500);// If no response, assume port is not listening
        socket.on('timeout', function () {
            socket.destroy();
        });
        socket.on('error', function (exception) {});
        socket.on('close', function (exception) {});
        socket.connect(port, host);
    }

    var LAN = '192.168.0'; //Local area network to scan (this is rough)

//scan over a range of IP addresses.
    for (var i = 1; i <= 255; i++) {
        checkPort(SPOTIFY_PORT, LAN + '.' + i);
    }
}

function handleFoundServer() {

    // Cancel the timer that shows the 'none found'
    // message.
    clearTimeout(timer);

    switch (foundServers.length) {
        case 1:
            loadRemote(foundServers[0]);
            break;
        default:
            showServerChoices(foundServers);
    }
}

function loadRemote(host) {
    document.querySelector('#remote-iframe').src = "http://" + host + ":" + SPOTIFY_PORT;

    // Gives the iframe some time to load before displaying.
    setTimeout(function() {
        document.querySelector('.looking-section').classList.remove('visible');
        document.querySelector('.choice-section').classList.remove('visible');
        document.querySelector('.no-server-section').classList.remove('visible');
        document.querySelector('.remote-section').classList.add('visible');
    }, 1000);
}

function showNoServersFoundMessage() {
    document.querySelector('.looking-section').classList.remove('visible');
    document.querySelector('.choice-section').classList.remove('visible');
    document.querySelector('.remote-section').classList.remove('visible');

    document.querySelector('.no-server-section').classList.add('visible');
}

function showServerChoices(foundHosts) {
    var choices = "";
    for (var i in foundHosts) {
        choices += "<li onclick='loadRemote(\"" + foundHosts[i] + "\")'>" + foundHosts[i] + "</li>";
    }

    setTimeout(function() {
        document.querySelector('.looking-section').classList.remove('visible');
        document.querySelector('.no-server-section').classList.remove('visible');
        document.querySelector('.remote-section').classList.remove('visible');

        document.querySelector('.choice-section .choices').innerHTML = choices;
        document.querySelector('.choice-section').classList.add('visible');
    }, 1000);
}

document.addEventListener("DOMContentLoaded", function() {
    findSpotifyServers();
    timer = setTimeout(function() {
        showNoServersFoundMessage();
    }, TIMEOUT_MS);
});