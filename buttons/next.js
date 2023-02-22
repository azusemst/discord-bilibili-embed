const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getFollowing } = require('../bili/getFollowing');

module.exports = {
    data: {
        name: 'next'
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        const page = parseInt(interaction.message.embeds[0].title.match(/\d(?= 页)/)[0]);
        const uid = interaction.message.embeds[0].url.match(/(?<=com\/)\d+/)[0];
        await getFollowing(uid, page + 1)
            .then(embed => {
                if (embed) {
                    embed.url = interaction.message.embeds[0].url;
                    embed.author = {
                        name: interaction.message.embeds[0].author.name,
                        url: interaction.message.embeds[0].author.url,
                        icon_url: interaction.message.embeds[0].author.iconURL
                    };
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('<')
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('>')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(page == 4 || embed.length < 50),
                        );
                    interaction.update({ embeds: [embed], components: [row] });
                } else {
                    interaction.update('请求错误');
                }
            })
            .catch(error => console.log(error));
    }
}