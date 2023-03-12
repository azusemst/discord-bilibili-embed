const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { getRoomDetail, getUserLive } = require('../bili/live');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('liveinfo')
        .setDescription('用户的直播间信息，包括查粉丝牌、红包、视频流链接等')
        .addStringOption(option => option
            .setName('输入类型')
            .setDescription('uid或房间号')
            .setRequired(true)
            .addChoices(
                { name: 'uid', value: 'uid' },
                { name: '房间号', value: 'rid' }
            ))
        .addStringOption(option => option
            .setName('编号')
            .setDescription('uid或房间号，一次只能查询一个')
            .setRequired(true)
            .setMaxLength(16)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const type = interaction.options.getString('输入类型');
        const number = interaction.options.getString('编号');
        if (!/^\d{1,16}$/.test(number)) {
            await interaction.reply('格式错误，请输入数字uid或房间号');
            return;
        }

        await interaction.deferReply();
        if (type == 'uid') {
            const embed = await getUserLive(number);
            await interaction.editReply({ embeds: [embed] });
        } else {
            const embed = await getRoomDetail(number, true);
            await interaction.editReply({ embeds: [embed] });
        }
    }
}
