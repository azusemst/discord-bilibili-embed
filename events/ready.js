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
        if (!('271887040' in config)) {
            console.log('Config error');
            return;
        }

        const dyns = {};
        for (user of userArr) {
            const update = await getUpdate(user);
            dyns[user] = update;
        }
        const lives = await getLiveStatus(['271887040']);

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
            const newlives = await getLiveStatus(['271887040']);
            if (lives[0].fields[0].value != newlives[0].fields[0].value) {
                for (chan_id of config['271887040']) {
                    const channel = await client.channels.fetch(chan_id);
                    await channel.send({ content: newlives[0].fields[0].value == '直播中' ? '开播了' : '下播了', embeds: [newlives[0]] });
                }
                lives[i] = newlives[i];
            }
        }, process.env.UPD_INTERVAL);

    },
};