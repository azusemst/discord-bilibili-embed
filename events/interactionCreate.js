const { Events, BaseInteraction } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {BaseInteraction} interaction 
     */
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`Error: No command matching "${interaction.commandName}" was found.`);
                return;
            }

            try {
                console.log(`Executing command ${interaction.commandName}...`);
                await command.execute(interaction);
                console.log('Executed command!')
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.isButton()) {
            console.log(`button clicked: ${interaction.component.customId}`);

            const button = interaction.client.buttons.get(interaction.component.customId);
            if (!button) {
                console.error(`Error: No button matching "${interaction.component.customId}" was found.`);
                return;
            }

            try {
                console.log(`Executing button ${interaction.component.customId}...`);
                await button.execute(interaction);
                console.log('Executed button!')
            } catch (error) {
                console.error(`Error executing ${interaction.component.customId}`);
                console.error(error);
            }
        }
    },
};