const { escapeMarkdown } = require('discord.js');


async function getVideoDetail(bvid = '', aid = '') {
    return fetch(`https://api.bilibili.com/x/web-interface/view?aid=${aid}&bvid=${bvid}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(`Fetching video = ${(bvid == '') ? aid : bvid}`);
            if (data.code != 0) {
                console.log(`Error: ${data.code}`);
                return data.code;
            }
            return videoProcess(data.data);
        })
}

function videoProcess(videoData) {
    const embed = {
        title: videoData.title,
        color: 5471318,
        description: escapeMarkdown(videoData.desc),
        timestamp: new Date(videoData.pubdate * 1000).toISOString(),
        url: `https://www.bilibili.com/video/${videoData.bvid}`,
        author: {
            name: videoData.owner.name,
            url: `https://space.bilibili.com/${videoData.owner.mid}`,
            icon_url: videoData.owner.face,
        },
        image: {
            url: videoData.pic
        },
        fields: [{
            name: '播放',
            value: videoData.stat.view,
            inline: true
        },
        {
            name: '弹幕',
            value: videoData.stat.danmaku,
            inline: true
        },
        {
            name: '评论',
            value: videoData.stat.reply,
            inline: true
        },
        {
            name: ':thumbsup:',
            value: videoData.stat.like,
            inline: true
        },
        {
            name: ':coin:',
            value: videoData.stat.coin,
            inline: true
        },
        {
            name: ':star:',
            value: videoData.stat.favorite,
            inline: true
        }]
    }
    return embed;
}

module.exports = { getVideoDetail };
