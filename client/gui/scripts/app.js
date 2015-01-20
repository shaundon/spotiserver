var mdns = require('mdns');
var SPOTIFY_PORT = 7768;
var foundServers = [];
var timer = false;
var TIMEOUT_MS = 2000;
var attempts = 0;

function findSpotifyServers() {

    var browser = mdns.createBrowser(mdns.tcp('http'));
    browser.on('serviceUp', function(service) {
        if (service.port === SPOTIFY_PORT) {
            console.log('Found Spotify server at http://' + service.host + ':7768');
            if (foundServers.indexOf(service.host) === -1) {
                foundServers.push(service.host);
                if (attempts > 0) {
                    handleFoundServer();
                }
            }
        }
    });
    browser.start();
}

function handleFoundServer() {

    switch (foundServers.length) {
        case 0:
            if (attempts < 3) {
                attempts++;
                continueLooking();
            }
            else {
                showNoServersFoundMessage();
            }
            break;
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
    document.querySelector('.looking-section').classList.remove('visible');
    document.querySelector('.no-server-section').classList.remove('visible');
    document.querySelector('.remote-section').classList.remove('visible');

    document.querySelector('.choice-amount').innerText = foundHosts.length;
    document.querySelector('.choice-section .choices').innerHTML = choices;
    document.querySelector('.choice-section').classList.add('visible');
}

function continueLooking() {
    timer = setTimeout(function() {
        handleFoundServer();
    }, TIMEOUT_MS);
}

document.addEventListener("DOMContentLoaded", function() {
    findSpotifyServers();
    continueLooking();
});