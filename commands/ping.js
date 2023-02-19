const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('服务器延迟'),
    async execute(interaction) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        const newmsg = `API Latency: ${interaction.client.ws.ping}\nClient ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        await interaction.editReply({
            content: newmsg
        });

    }
}
