## Functions & Commands
### 1. 查b站关注

```
/follow uid:string
```
可突破隐私限制。每页显示50个结果，使用按钮翻页。按关注时间递减显示，最多显示250条。
### 2. 查直播间信息

```
/liveinfo 输入类型:string 编号:string
```
**包括：**
- 直播间人气，关注，是否开播等基本信息
- 粉丝勋章
- 主播等级
- 当前的抽奖红包数量
- 封面（如有）
- 开播时间（如有）
- 主播公告（如有）
- 视频流链接

**视频流的使用方法**

你可以使用支持直播流的播放器打开此链接，比如PotPlayer。这也方便你录制直播流。默认画质是原画 `quality=4` 。如果链接过期，请获取新链接。具体过期时间可参考url中的 `expires` 参数。

### 2. 解析动态/直播链接和视频av/BV号

向bot所在频道发送链接或av/BV号。bot需要 `GatewayIntentBits.MessageContent` 权限。

![image](https://user-images.githubusercontent.com/50971762/220776382-1673af10-b637-4ad1-9197-8743048be411.png)

支持的视频链接格式
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
```
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
