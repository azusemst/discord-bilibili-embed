const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { getLiveStatus } = require('../bili/live');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('liveinfo')
        .setDescription('用户的直播间信息')
        .addStringOption(option => option
            .setName('uids')
            .setDescription('用户uid，用英文逗号隔开')
            .setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const uids = interaction.options.getString('uids').split(',');
        const embeds = await getLiveStatus(uids);
        if (embeds.length == 0) {
            await interaction.reply('你查询的用户中没有人有直播间。请确保输入正确的uid而不是房间号');
            return;
        }
        await interaction.reply({ content: ':white_check_mark: 查询成功，未显示的用户是没有直播间的', embeds: embeds });
    }
}
