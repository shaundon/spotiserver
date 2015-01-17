# Spotiserver

![I love Arctic Monkeys](http://i.imgur.com/sZcWMtn.png)

Spotiserver (I really need to think of a better name) lets you remotely control Spotify running on a Mac.

## Tell me more

Where I work, we have a Mac Mini in the corner running Spotify. Originally whenever we wanted to change the song, pause it, or whatever, we'd need to keep getting up. With this, we can do it remotely. Now you can too!

On a technical level, it's built with NodeJS and Applescript, and all client server communication goes through WebSockets.

## Why's it Mac only?

Because it uses Applescript to pass the commands through to Spotify. You can use any device with a web browser as a remote though, just make sure you use a Mac for the server part.

## Getting started

Clone the repo, then run `npm install`, followed by `node app`. If everything's gone to plan, the server will now be running.

Go to `http://localhost:7428` in a browser to see the remote. It probably looks massive and oversized. That's because it's designed to run in a small window you can leave in the corner of your screen. So, either resize the window, or even better, spin it off into a standalone application using [Fluid](http://fluidapp.com/). Then you'll have a nice little standalone window that looks like the image at the top of this readme.

To use the remote from other devices in your network, just get [the internal IP] address(http://osxdaily.com/2010/08/08/lan-ip-address-mac/) of the machine this is running on, and go to `http://<ip_address>:7428`. It works great on iOS and Android too.

## Future plans

Ideally, I'd like to make this a little more consumer focused and just have a Mac app that you run in the background on the server, and then an app you can install on other machines that'll function as remotes. I'll try and get around to doing that sometime.

## Credits

The AppleScript used to control Spotify was originally [this file](https://github.com/dronir/SpotifyControl). I changed it to return JSON instead of text for the `info` command, and I added a function to escape that output, which I took from [node-spotify-applescript](https://github.com/andrehaveman/spotify-node-applescript). I'm also using [Font Awesome](https://github.com/FortAwesome/Font-Awesome) for icons, [fastclick](https://github.com/ftlabs/fastclick) for elimating touch delay on mobile and [socket.io](http://socket.io/) for client-server communication.
