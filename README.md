# Spotiserver

## Client
![Client](http://i.imgur.com/FF4Joh0.png)

## Server
![Server](http://i.imgur.com/PJpU7Ur.png)


Spotiserver (I really need to think of a better name) lets you remotely control Spotify running on a Mac from any web browser in the same network.

## Tell me more

Where I work, we have a Mac Mini in the corner running Spotify. Originally whenever we wanted to change the song, pause it, or whatever, we'd need to keep getting up. With this, we can do it remotely. Now you can too!

### Features

* Zero configuration set up - Client finds and connects to the server automatically.
* Album artwork via Spotify Web API
* Browser based version available too

On a technical level, it's built with nw.js and Applescript, and all client server communication goes through WebSockets.

## Why's it Mac only?

Because it uses Applescript to pass the commands through to Spotify. You can use any device with a web browser as a remote though, just make sure you use a Mac for the server part.

## Getting Started

You've got two apps here - *client* and *server*. You run *server* on the Mac with Spotify that you want to control, and *client* on machines you want to use as remotes. You can also access the remote in a web browser.

### Compiling and running it yourself

Ensure that `nw-gyp` is installed on your machine globally:

```
npm install -g nw-gyp
```

On the machine you want to control (the Mac with Spotify):

```
cd server
npm install
nw .
```

And on the machines you want to use as remotes:

```
cd client
npm install
nw .
```

As the code samples show, you'll need nw.js to run the app (see [this nw.js quick start guide](https://github.com/nwjs/nw.js/blob/master/README.md) for how to do that. 
If everything's gone to plan, the apps will start and windows like the images above will pop open.

#### Caveats

Use version 0.8.6 of node-webkit (aka nw.js). The module used for zeroconf networking, [node-mdns](https://github.com/agnat/node_mdns), currently 
won't build under the latest versions. It has to be recompiled with `nw-gyp`, which is achieved with a post install script.

## Client app vs website

You may be wondering what the point of the client application is, when you can just go to the server in a web browser and control it that way. The difference is that the client application scans the network for a machine running the server, and then connects to it automatically, no setup required. Also, the web based version works great on devices that can't run the client app, like PCs, iOS, Android, and so on.

## Issues

There are a couple of known issues, check the issues section of this repo.

## Credits

The AppleScript used to control Spotify was originally [this file](https://github.com/dronir/SpotifyControl). I changed it to return JSON instead of text for the `info` command, and I added a function to escape that output, which I took from [node-spotify-applescript](https://github.com/andrehaveman/spotify-node-applescript). I'm also using [Font Awesome](https://github.com/FortAwesome/Font-Awesome) for icons, [fastclick](https://github.com/ftlabs/fastclick) for elimating touch delay on mobile and [socket.io](http://socket.io/) for client-server communication.
