## Functions & Commands
### 1. 查b站关注

```
/follow <uid>
```
可突破隐私限制。每页显示50个结果，使用按钮翻页。按关注时间递减显示，最多显示250条。
### 2. 查直播间信息

```
/liveinfo <输入类型> <编号>
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

### 3. 解析动态/直播链接和视频av/BV号

向bot所在频道发送链接或av/BV号。bot需要 `GatewayIntentBits.MessageContent` 权限。

![image](https://user-images.githubusercontent.com/50971762/220776382-1673af10-b637-4ad1-9197-8743048be411.png)

支持的视频链接格式
```
av170001
BV1Vg4y1W7q3
https://www.bilibili.com/video/BV1Vg4y1W7q3/
```
### 4. 订阅动态和直播更新

在 `.env` 中设置环境变量
```js
TOKEN="你的discord bot token"
CLIENT_ID="你的Client ID“
BILI_CONFIG={"558322816995426305":"509050400,271887040,3035105,1437582453,9617619","946719330299682846":"11783021,9617619"} // 推送频道 - uid
UPD_INTERVAL="60000" // 毫秒更新间隔，必须大于关注数*1000
SESSDATA="你的SESSDATA，来自B站Cookie"
bili_jct="你的bili_jct，来自B站Cookie"
```
其中，`BILI_CONFIG` 是json格式。一个uid可以在多个频道里推送
`TOKEN`和`CLIENT_ID`来自Discord Developer Portal生成bot后获取。记得给MessageContent权限，拉进你的discord频道。
`SESSDATA`和`bili_jct`可以Chrome打开哔哩哔哩网站F12-应用-Cookie内找到
```json
{"channel1":"uid1,uid2","channel2":"uid1,uid2"}
```
### 5. 匿名分享链接
```
/share <url>
```
在使用指令的频道匿名发送一个链接。支持b站，twitter，youtube链接。b站链接会解析后发送。
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
Create a `.env` file
```js
TOKEN="your bot token"
CLIENT_ID="your bot client id"
BILI_CONFIG={"channel1 ID":"uid1,uid2","channel2 ID":"uid1,uid2"}
UPD_INTERVAL="time interval in ms"
SESSDATA="SESSDATA from your bilibili Cookie"
bili_jct="bili_jct from your bilibili Cookie"
```
Run the bot
```
node .
```
### 2. Server

If you want to run it continuously, you need to deploy it on a remote server.

Follow [this Heroku tutorial](https://www.youtube.com/watch?v=OFearuMjI4s). It's easy.

Note: you don't need to create a new repository. Just fork this one.
