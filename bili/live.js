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

module.exports = { getLiveStatus };