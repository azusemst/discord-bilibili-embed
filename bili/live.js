/**
 * 
 * @param {string[]} uids 
 */
async function getLiveStatus(uids) {
    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ uids: uids })
    };
    const response = await fetch('https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids', request);
    const data = await response.json();
    if (data.code != 0) {
        console.log(`Error getLiveStatus: ${data.code}`);
        return;
    }

    const embeds = [];
    for (uid of uids) {
        if (uid in data.data) {
            embeds.push({
                title: data.data[uid].title,
                color: 5471318,
                uid: uid,
                timestamp: (() => {
                    if (data.data[uid].live_status == 1)
                        return new Date(data.data[uid].live_time * 1000).toISOString();
                })(),
                url: `https://live.bilibili.com/${data.data[uid].room_id}`,
                author: {
                    name: data.data[uid].uname,
                    url: `https://space.bilibili.com/${uid}`,
                    icon_url: data.data[uid].face
                },
                image: {
                    url: data.data[uid].cover_from_user
                },
                fields: [{
                    name: '状态',
                    value: data.data[uid].live_status == 1 ? '直播中' : '未开播',
                    inline: true
                },
                {
                    name: '分区',
                    value: `${data.data[uid].area_v2_parent_name} - ${data.data[uid].area_v2_name}`,
                    inline: true
                }]
            })
        }
    }
    return embeds;
}

/**
 * 
 * @param {string} rid 
 */
async function getRoomDetail(rid) {
    let response = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${rid}`);
    const data = await response.json();
    if (data.code != 0) {
        console.log(`Error getRoomDetail: ${data.code}`);
        return { description: `Error getRoomDetail: ${data.code}` };
    }

    const embed = {
        title: data.data.title,
        description: data.data.description,
        color: 5471318,
        url: `https://live.bilibili.com/${rid}`,
        author: {
            url: `https://space.bilibili.com/${data.data.uid}`,
        },
        image: {
            url: data.data.user_cover
        },
        fields: [{
            name: '状态',
            value: ['未开播', '直播中', '轮播中'][data.data.live_status],
            inline: true
        },
        {
            name: '分区',
            value: `${data.data.parent_area_name} - ${data.data.area_name}`,
            inline: true
        },
        {
            name: '粉丝',
            value: data.data.attention,
            inline: true
        },
        {
            name: '看过',
            value: data.data.online,
            inline: true
        }]
    }

    if (data.data.live_status == 1)
        embed.fields.push({
            name: '开播时间',
            value: data.data.live_time,
            inline: true
        });

    // user
    response = await fetch(`https://api.live.bilibili.com/live_user/v1/Master/info?uid=${data.data.uid}`);
    const userData = await response.json();
    if (userData.code != 0) {
        console.log(`Error getRoomDetail-user: ${userData.code}`);
        return { description: `Error getRoomDetail-user: ${userData.code}` };
    }

    embed.author.name = userData.data.info.uname;
    embed.author.icon_url = userData.data.info.face;
    embed.color = userData.data.exp.master_level.color;
    embed.fields.push({
        name: '粉丝勋章',
        value: userData.data.medal_name,
        inline: true
    }, {
        name: '主播等级',
        value: userData.data.exp.master_level.level,
        inline: true
    });

    // redpack
    response = await fetch(`https://api.live.bilibili.com/xlive/lottery-interface/v1/lottery/getLotteryInfoWeb?roomid=${data.data.room_id}`);
    const redData = await response.json();
    embed.fields.push({
        name: '红包数量',
        value: (() => {
            if (redData.code != 0) {
                console.log(`Error getRoomDetail-redpack: ${redData.code}`);
                return '获取失败';
            } else if (redData.data.popularity_red_pocket)
                return redData.data.popularity_red_pocket.length;
            else return '0';
        })(),
        inline: true
    });

    if (userData.data.room_news.content) {
        embed.fields.push({
            name: '主播公告',
            value: `时间：${userData.data.room_news.ctime}\n内容：${userData.data.room_news.content}`,
        });
    }

    // stream
    response = await fetch(`https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${data.data.room_id}&quality=4`);
    const streamData = await response.json();
    embed.fields.push({
        name: '视频流',
        value: (() => {
            if (streamData.code != 0) {
                console.log(`Error getRoomDetail-stream: ${streamData.code}`);
                return '获取失败';
            }
            return streamData.data.durl[0].url;
        })()
    });

    return embed;
}

/**
 * 
 * @param {string} uid 
 */
async function getUserLive(uid) {
    const response = await fetch(`https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid=${uid}`);
    const data = await response.json();
    if (data.code != 0) {
        console.log(`Error getUserLive: ${data.code}`);
        return { description: '请求错误' };
    }
    if (data.data.roomStatus == 0) return { description: '无直播间' };
    return await getRoomDetail(data.data.roomid);
}

module.exports = { getLiveStatus, getRoomDetail, getUserLive };
