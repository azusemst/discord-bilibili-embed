const { Events, Client } = require('discord.js');
const { getDynamicDetail, getUpdate } = require('../bili/dynamic');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    execute(client) {
        console.log(`Ready: Logged in as ${client.user.tag}`);

        // get dynamic update
        const userArr = process.env.FOLLOWED_USER.split(',');
        setInterval(() => {
            for (user of userArr) {
                getUpdate(user).then(update => {
                    if (Date.now() - update.timestamp < parseInt(process.env.UPD_INTERVAL) + 3000) { // 有时候会错过所以+3s
                        getDynamicDetail(update.dynamic_id, false).then(embed => {
                            client.channels.fetch(process.env.FEED_CHANNEL).then(channel => {
                                channel.send({ embeds: embed });
                            })
                        });
                        console.log(`Updated: dynamic_id=${update.dynamic_id}`);
                    }
                })
            }
        }, process.env.UPD_INTERVAL);

    },
};