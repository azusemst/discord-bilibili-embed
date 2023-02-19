const { Message, Events } = require('discord.js');
const { getDynamicDetail } = require('../bili/dynamic');

module.exports = {
    name: Events.MessageCreate,

    /**
     * 
     * @param {Message} message 
     */
    async execute(message) {
        if (message.author.bot) return;
        const dynPattern = /^(https?:\/\/)?t\.bilibili\.com\/\d+/;
        if (dynPattern.test(message.content)) {
            await getDynamicDetail(message.content.match(/(?<=t\.bilibili\.com\/)\d+/)[0])
                .then(embed => {
                    if (embed) message.reply({
                        embeds: embed
                    });
                })
                .catch(error => console.log(error));
        }
    }
}