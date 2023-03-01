const { Events, Client } = require('discord.js');
const { getDynamicDetail, getUpdate } = require('../bili/dynamic');
const { getLiveStatus } = require('../bili/live');

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
        const userArr = process.env.FOLLOWED_USER.split(',');
        if (userArr.length > 9) {
            console.log('Error: more than 9 users');
            return;
        }
        const dyns = {};
        for (user of userArr) {
            const update = await getUpdate(user);
            dyns[user] = update;
        }
        const lives = await getLiveStatus(userArr);
        const channel = await client.channels.fetch(process.env.FEED_CHANNEL);

        setInterval(async () => {
            // get dynamic update
            for (user of userArr) {
                const update = await getUpdate(user)
                if (BigInt(update) > BigInt(dyns[user])) {
                    const embed = await getDynamicDetail(update, false)
                    await channel.send({ embeds: embed });
                    dyns[user] = update;
                }
            }

            // get live update
            const newlives = await getLiveStatus(userArr);
            for (let i = 0; i < lives.length; i++) {
                if (lives[i].fields[0].value != newlives[i].fields[0].value) {
                    await channel.send({ content: newlives[i].fields[0].value == '直播中' ? '开播了' : '下播了', embeds: [newlives[i]] });
                    lives[i] = newlives[i];
                }
            }
        }, process.env.UPD_INTERVAL);

    },
};