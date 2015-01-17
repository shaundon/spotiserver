# Spotiserver

## Client
![I love Arctic Monkeys](http://i.imgur.com/sZcWMtn.png)

## Server
![](http://i.imgur.com/xAVcMIm.png)

Spotiserver (I really need to think of a better name) lets you remotely control Spotify running on a Mac from any web browser in the same network.

## Tell me more

Where I work, we have a Mac Mini in the corner running Spotify. Originally whenever we wanted to change the song, pause it, or whatever, we'd need to keep getting up. With this, we can do it remotely. Now you can too!

On a technical level, it's built with nw.js and Applescript, and all client server communication goes through WebSockets.

## Why's it Mac only?

Because it uses Applescript to pass the commands through to Spotify. You can use any device with a web browser as a remote though, just make sure you use a Mac for the server part.

## Getting started

Clone the repo, run `npm install`, then use nw.js to run the app (see [this nw.js quick start guide](https://github.com/nwjs/nw.js/blob/master/README.md) for how to do that. If everything's gone to plan, the server will start and a window like the 'server' one above will pop open.

Go to the address shown in the window in a browser to see the remote. It probably looks massive and oversized. That's because it's designed to run in a small window you can leave in the corner of your screen. So, either resize the window, or even better, spin it off into a standalone application using [Fluid](http://fluidapp.com/). Then you'll have a nice little standalone window that looks like the image at the top of this readme. It works great on iOS and Android too.

## Credits

The AppleScript used to control Spotify was originally [this file](https://github.com/dronir/SpotifyControl). I changed it to return JSON instead of text for the `info` command, and I added a function to escape that output, which I took from [node-spotify-applescript](https://github.com/andrehaveman/spotify-node-applescript). I'm also using [Font Awesome](https://github.com/FortAwesome/Font-Awesome) for icons, [fastclick](https://github.com/ftlabs/fastclick) for elimating touch delay on mobile and [socket.io](http://socket.io/) for client-server communication.
