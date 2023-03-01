## Functions & Commands
### 1. Check bilibili user following

```
/follow uid:string
```
### 2. Embed bilibili dynamic

Send a t.bilibili.com link to a channel the bot is in
![image](https://user-images.githubusercontent.com/50971762/220776382-1673af10-b637-4ad1-9197-8743048be411.png)

### 3. Embed bilibili video

Send an av or BV number of a video, or a video link

e. g.

```
av170001
BV1Vg4y1W7q3
https://www.bilibili.com/video/BV1Vg4y1W7q3/
```
## Deploy
### 1. Local (for testing)

Be sure you have installed Git and Node.js

In a new folder:
```
git clone https://github.com/azusemst/discord-bilibili-embed.git
```
Install packages
```console
npm init -y
npm i discord.js dotenv
```
Uncomment this line in `index.js`
```js
// require('dotenv').config();
```
Create a `.env` file. In the file, add two tokens
```js
TOKEN="your bot token"
CLIENT_ID="your bot client id"
FOLLOWED_USER="bilibili uid"
FEED_CHANNEL="discord channel id"
UPD_INTERVAL="time interval in ms"
```
Run the bot
```
node .
```
### 2. Server

If you want to run it continuously, you need to deploy it on a remote server.

Follow [this Heroku tutorial](https://www.youtube.com/watch?v=OFearuMjI4s). It's easy.

Note: you don't need to create a new repository. Just fork this one.
