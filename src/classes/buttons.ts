import { ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, Events } from 'discord.js';
import CustomClient from './customClient';

class Buttons {
    public deleteButton() {
        const button = new ButtonBuilder()
            .setCustomId('delete')
            .setLabel('Delete')
            .setStyle(ButtonStyle.Danger);
        return button;
    }

    public async handleButton(interaction: ChatInputCommandInteraction, client: CustomClient) {
        const collector = interaction.channel.createMessageComponentCollector({ time: 10000 });
        collector.on("collect", async (i: any) => {
            switch (i.customId) {
                case "reply":
                    await client.interactions.reply(i as CommandInteraction, "Replied!", false);
                case "delete":
                    await client.interactions.delete(i as CommandInteraction);
                    break;
                case "edit":
                    await client.interactions.edit(i as CommandInteraction, "Edited!");
                    break;
            }

        });
    }

    public async handleMenu(interaction: ChatInputCommandInteraction, client: CustomClient) {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isStringSelectMenu()) return;
            await interaction.deferUpdate();
            switch (interaction.customId) {
                case "characters":
                    await client.interactions.reply(interaction as any as CommandInteraction, `You selected ${interaction.values.map((value: string) => value).join(", ")}`, false);
                    break;
            }
        });
    }
}

export default Buttons;
