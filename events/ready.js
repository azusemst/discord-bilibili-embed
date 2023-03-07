const { Events, Client } = require('discord.js');
const { getDynamicDetail, getUpdate } = require('../bili/dynamic');
const { getLiveStatus } = require('../bili/live');
const { getConfig } = require('../utils/getConfig');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    async execute(client) {
        console.log(`Ready: Logged in as ${client.user.tag}`);

        // init
        const config = getConfig();
        const userArr = Object.keys(config);
        if (userArr.length == 0) return;

        const dyns = {};
        for (user of userArr) {
            const update = await getUpdate(user);
            dyns[user] = update;
        }
        const lives = await getLiveStatus(userArr);

        setInterval(async () => {
            // get dynamic update
            for (user of userArr) {
                const update = await getUpdate(user)
                if (BigInt(update) > BigInt(dyns[user])) {
                    const embed = await getDynamicDetail(update, false)
                    for (chan_id of config[user]) {
                        const channel = await client.channels.fetch(chan_id);
                        await channel.send({ embeds: embed });
                    }
                    dyns[user] = update;
                }
            }

            // get live update
            const newlives = await getLiveStatus(userArr);
            for (let i = 0; i < lives.length; i++) {
                if (lives[i].fields[0].value != newlives[i].fields[0].value) {
                    for (chan_id of config[lives[i].uid]) {
                        const channel = await client.channels.fetch(chan_id);
                        await channel.send({ content: newlives[i].fields[0].value == '直播中' ? '开播了' : '下播了', embeds: [newlives[i]] });
                    }
                    lives[i] = newlives[i];
                }
            }
        }, process.env.UPD_INTERVAL);

    },
};