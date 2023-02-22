const { escapeMarkdown } = require('discord.js');

/**
 * 
 * @param {string} uid 
 * @param {number} page 
 */
async function getFollowing(uid, page) {
    return fetch(`https://app.biliapi.net/x/v2/relation/followings?vmid=${uid}&pn=${page}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(`Fetching following uid=${uid}, page=${page}`);
            if (data.code != 0) {
                console.log(`Error: ${data.code}`);
                return;
            }
            return followProcess(data.data, page);
        })
}

function followProcess(data, page) {
    let desc = '';
    for (let i = 0; i < data.list.length; i++) {
        desc += `${data.total - (page - 1) * 50 - i}. [${data.list[i].uname}](https://space.bilibili.com/${data.list[i].mid})\n`;
    }

    return {
        title: `第 ${page} 页，第 ${data.total - (page - 1) * 50}-${data.total - (page - 1) * 50 - data.list.length + 1} 条，共 ${data.total} 条`,
        color: 5471318,
        description: escapeMarkdown(desc),
        timestamp: new Date(data.list[0].mtime * 1000).toISOString(),
        footer: {
            text: '此页最新关注：'
        },
        length: data.list.length
    }
}

/**
 * 
 * @param {string} uid 
 */
async function getUser(uid) {
    return fetch(`https://api.bilibili.com/x/web-interface/card?mid=${uid}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(`Fetching user uid=${uid}`);
            if (data.code != 0) {
                console.log(`Error: ${data.code}`);
                return;
            }
            return {
                name: data.data.card.name,
                face: data.data.card.face
            };
        })
}

module.exports = { getFollowing, getUser };
