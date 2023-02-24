const { Events, Client } = require('discord.js');
const { getDynamicDetail, getUpdate } = require('../bili/dynamic');
const feed_channel = '931954419619201084', user = '271887040', update_interval = 60000;

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
        setInterval(() => {
            getUpdate(user).then(update => {
                if (Date.now() - update.timestamp < update_interval + 3000) { // 有时候会错过所以+3s
                    getDynamicDetail(update.dynamic_id).then(embed => {
                        client.channels.fetch(feed_channel).then(channel => {
                            channel.send({ embeds: embed });
                        })
                    });
                    console.log(`Updated: dynamic_id=${update.dynamic_id}`);
                }
            })
        }, update_interval);

    },
};