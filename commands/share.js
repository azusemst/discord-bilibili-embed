const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { getDynamicDetail } = require('../bili/dynamic');
const { getVideoDetail } = require('../bili/video');
const { getRoomDetail } = require('../bili/live');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('share')
        .setDescription('在频道中匿名分享一个链接')
        .addStringOption(option => option
            .setName('url')
            .setDescription('要分享的链接')
            .setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const url = interaction.options.getString('url');

        if (/youtube\.com\/\S+$|twitter\.com\/\S+$/.test(url)) {
            await interaction.channel.send(url);
            await interaction.reply({ content: '你的匿名分享已发送', ephemeral: true });
            return;
        }

        const dynPattern = /t\.bilibili\.com\/\d+|bilibili\.com\/opus\/\d+/;
        const vidPattern = /((av\d{1,9})|(BV\w{8,10}))(?!\w)/;
        const livePattern = /(?<=live\.bilibili\.com\/)\d{1,8}/;

        if (dynPattern.test(url)) {
            const embed = await getDynamicDetail(url.match(/(?<=bilibili\.com\/(opus\/)?)\d+/)[0])
            if (embed) {
                await interaction.channel.send({ embeds: embed });
                await interaction.reply({ content: '你的匿名分享已发送', ephemeral: true });
            } else await interaction.reply({ content: '获取失败', ephemeral: true });

        } else if (vidPattern.test(url)) {
            const vid = url.match(vidPattern)[0];
            let aid = '', bvid = '';
            if (/^av/.test(vid)) aid = vid.slice(2);
            else bvid = vid;
            const embed = await getVideoDetail(bvid, aid)
            if (embed == -403) {
                await interaction.reply({ content: 'Error -403: 权限不足', ephemeral: true });
            } else if (embed == -404) {
                await interaction.reply({ content: 'Error -404: 无视频', ephemeral: true });
            } else if (embed == 62002) {
                await interaction.reply({ content: 'Error 62002: 稿件不可见', ephemeral: true });
            } else if (embed == 62004) {
                await interaction.reply({ content: 'Error 62004: 稿件审核中', ephemeral: true });
            } else if (typeof embed == 'object') {
                await interaction.channel.send({ embeds: [embed] });
                await interaction.reply({ content: '你的匿名分享已发送', ephemeral: true });
            } else await interaction.reply({ content: '获取失败', ephemeral: true });

        } else if (livePattern.test(url)) {
            const embed = await getRoomDetail(url.match(livePattern)[0]);
            if (embed) {
                await interaction.channel.send({ embeds: [embed] });
                await interaction.reply({ content: '你的匿名分享已发送', ephemeral: true });
            } else await interaction.reply({ content: '获取失败', ephemeral: true });
        }

        else await interaction.reply({ content: '不支持的链接', ephemeral: true });
    }
}
