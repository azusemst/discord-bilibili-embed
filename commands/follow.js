const { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getFollowing, getUser } = require('../bili/getFollowing');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('follow')
        .setDescription('查b站关注，最多前250条')
        .addStringOption(option => option
            .setName('uid')
            .setDescription('用户的uid')
            .setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        // get uid
        let uid = '';
        const temp = interaction.options.getString('uid');
        if (/^uid:\d{1,16}$/.test(temp)) uid = temp.slice(4);
        else if (/^uid\d{1,16}$/.test(temp)) uid = temp.slice(3);
        else if (/^\d{1,16}$/.test(temp)) uid = temp;
        else {
            await interaction.reply('uid格式错误');
            return;
        }
        console.log(`/follow by ${interaction.user.tag}`);

        // process embed
        await interaction.deferReply({ ephemeral: true });
        const channel = await interaction.client.channels.fetch('974968876242726932');
        await channel.send(`${interaction.user.tag}: /follow ${uid}`);
        await getFollowing(uid, 1)
            .then(embed => {
                if (embed) {
                    getUser(uid).then(user => {
                        embed.url = `https://space.bilibili.com/${uid}/fans/follow`;
                        embed.author = {
                            name: user.name,
                            url: `https://space.bilibili.com/${uid}`,
                            icon_url: user.face
                        };
                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('previous')
                                    .setLabel('<')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setCustomId('next')
                                    .setLabel('>')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(embed.length < 50),
                            );
                        interaction.editReply({ embeds: [embed], components: [row] });
                    });
                } else {
                    interaction.editReply('uid错误或该用户没有关注\n\n2023/3/15更新：该api已失效，无法突破隐私限制，非隐私查询正常，请耐心等待修复');
                }
            })
            .catch(error => console.log(error));
    }
}
