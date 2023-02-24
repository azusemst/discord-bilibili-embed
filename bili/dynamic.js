const { escapeMarkdown } = require('discord.js');

const types = {
    1: '转发', // ok
    2: '图片动态', // ok
    4: '文字动态', // ok
    8: '视频动态', // ok
    16: '小视频',
    32: '戏剧',
    64: '专栏', // ok
    256: '音频',
    512: '番剧',
    2048: 'H5活动动态',
    2049: '漫画分享',
    4097: 'PGC番剧',
    4098: '电影',
    4099: '电视剧',
    4100: '国创动漫',
    4101: '纪录片',
    4200: '直播', // ok
    4201: '直播', // ok
    4300: '收藏夹',
    4302: '付费课程',
    4303: '付费课程',
    4308: '直播', // ok
    4310: '合集'
}

/**
 * @param {string} dynamic_id 
 */
async function getDynamicDetail(dynamic_id) {
    return fetch(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${dynamic_id}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(`Fetching dynamic_id = ${dynamic_id}`);
            return dynamicProcess(data.data, dynamic_id);
        })
}

function dynamicProcess(dynamic, id, show_detail = true) {
    if (!('card' in dynamic)) {
        console.log('404 Not Found');
        return;
    }
    const card = JSON.parse(dynamic.card.card);
    // console.log(`type = ${dynamic.card.desc.type}`);
    // fs.writeFile('dt_template/4308.json', JSON.stringify(dynamic), (err) => {
    //     if (err) throw err;
    //     console.log('The file has been saved!');
    // });
    // fs.writeFile('dt_template/4308_card.json', JSON.stringify(card), (err) => {
    //     if (err) throw err;
    //     console.log('The file has been saved!');
    // });


    // title
    let title = '';
    if (dynamic.card.desc.type == 1) title = '转发了动态';
    else if (dynamic.card.desc.type == 8) title = '投稿了视频';
    else title = `发布了${types[dynamic.card.desc.type] ?? '动态'}`;

    const dynamicObj = [{
        "title": title,
        "color": 5471318,
        "description": setText(card), // TODO
        "timestamp": new Date(dynamic.card.desc.timestamp * 1000).toISOString(),
        "url": `https://t.bilibili.com/${id}`,
        "author": {
            "name": setName(card),
            "url": `https://space.bilibili.com/${dynamic.card.desc.uid}`,
            "icon_url": (() => {
                if ('user' in card) {
                    if ('face' in card.user) return card.user.face;
                    else return card.user.head_url;
                } else if ('owner' in card) return card.owner.face;
                else if ('author' in card) return card.author.face;
            })()
        },
        "image": {
            "url": ""
        },
        fields: []
    }];

    if (dynamic.card.desc.type == 4308 || dynamic.card.desc.type == 4200 || dynamic.card.desc.type == 4201) {
        show_detail = false;
        dynamicObj[0].image.url = card.live_play_info.cover;
        dynamicObj[0].title = '直播了';
        dynamicObj[0].url = card.live_play_info.link;
        dynamicObj[0].author.name = dynamic.card.desc.user_profile.info.uname;
        dynamicObj[0].author.icon_url = dynamic.card.desc.user_profile.info.face;
        dynamicObj[0].timestamp = new Date(card.live_play_info.live_start_time * 1000).toISOString();
        dynamicObj[0].description = card.live_play_info.title;
        dynamicObj[0].fields = [{
            name: '状态',
            value: card.live_play_info.live_status,
            inline: true
        },
        {
            name: '分区',
            value: card.live_play_info.area_name + ' - ' + card.live_play_info.parent_area_name,
            inline: true
        },
        {
            name: ':eye:',
            value: card.live_play_info.watched_show,
            inline: true
        }]
    }

    if (show_detail) dynamicObj[0].fields = [{
        name: ':repeat:',
        value: dynamic.card.desc.repost,
        inline: true
    },
    {
        name: ':speech_balloon:',
        value: dynamic.card.desc.comment ?? 0,
        inline: true
    },
    {
        name: ':thumbsup:',
        value: dynamic.card.desc.like,
        inline: true
    },
    {
        name: ':eye:',
        value: dynamic.card.desc.view,
        inline: true
    }];

    if (dynamic.card.desc.type == 1) {
        if ('origin' in card) {
            const origin = JSON.parse(card.origin);
            let ouid = '';
            if ('user' in origin) ouid = origin.user.uid;
            else if ('owner' in origin) {
                ouid = origin.owner.mid;
                dynamicObj[0].title = '转发了视频';
                dynamicObj[0].image.url = origin.pic;
                dynamicObj[0].fields.unshift({
                    name: '简介',
                    value: origin.desc
                });
                dynamicObj[0].fields.unshift({
                    name: '标题',
                    value: origin.title
                });
            }
            dynamicObj[0].description += `\n//[@${setName(origin)}](https://space.bilibili.com/${ouid}):${setText(origin)}`;
            if ('item' in origin && 'pictures' in origin.item) {
                const flag = addPic(dynamicObj, origin.item.pictures);
                if (flag) dynamicObj[0].footer = { text: '*图片超过4张，请翻页查看' };
            }
        } else {
            dynamicObj[0].description += `\n//${card.item.tips}`;
        }
    }

    else if (dynamic.card.desc.type == 2) {
        const flag = addPic(dynamicObj, card.item.pictures);
        if (flag) dynamicObj[0].footer = { text: '*图片超过4张，请翻页查看' };
    }

    else if (dynamic.card.desc.type == 8) {
        dynamicObj[0].image.url = card.pic;
        dynamicObj[0].fields.unshift({
            name: '简介',
            value: card.desc
        });
        dynamicObj[0].fields.unshift({
            name: '标题',
            value: card.title
        });
    }

    else if (dynamic.card.desc.type == 64) {
        dynamicObj[0].image.url = card.origin_image_urls[0];
        dynamicObj[0].fields.unshift({
            name: '简介',
            value: card.summary
        });
        dynamicObj[0].fields.unshift({
            name: '标题',
            value: card.title
        });
    }

    return dynamicObj;
}

function setText(card) {
    let text = '';
    if ('item' in card) {
        if ('content' in card.item) text = card.item.content;
        else if ('description' in card.item) text = card.item.description;
    } else if ('title' in card) {
        if (card.dynamic) text = card.dynamic;
    }
    return escapeMarkdown(text);
}

function setName(card) {
    let name = '';
    if ("user" in card) {
        if ("uname" in card.user) name = card.user.uname;
        else if ("name" in card.user) name = card.user.name;
    }
    else if ("author" in card) name = card.author.name;
    else if ("videos" in card) name = card.owner.name;
    return name;
}

/**
 * 
 * @param {Object[]} embeds 
 * @param {Object[]} picArr 
 */
function addPic(embeds, picArr) {
    if (picArr.length == 0) console.error('Error: no pic to add');
    else if (picArr.length > 9) console.error('Error: more than 9 pics');
    embeds[0].image.url = picArr[0].img_src;
    if (picArr.length > 1) {
        for (let i = 1; i < picArr.length; i++) {
            embeds.push({
                url: embeds[0].url,
                image: {
                    url: picArr[i].img_src
                }
            })
        }
    }
    if (picArr.length > 4) return true;
    return false;
}

async function getUpdate(uid) {
    return fetch(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${uid}`)
        .then((response) => response.json())
        .then((data) => {
            // console.log(`Fetching dynamic history uid = ${uid}`);
            return {
                timestamp: data.data.cards[0].desc.timestamp * 1000,
                dynamic_id: data.data.cards[0].desc.dynamic_id_str
            };
        })
}

module.exports = { getDynamicDetail, getUpdate };
