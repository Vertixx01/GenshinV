import { ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Events } from 'discord.js';
import getCharacter from '../backend/functions/characters';
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
                    await client.interactions.edit(i as CommandInteraction, new EmbedBuilder().setColor("#FF0000").setDescription("Edited!"));
                    break;
            }

        });
    }

    public async handleMenu(interaction: ChatInputCommandInteraction, client: CustomClient) {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isStringSelectMenu()) return;
            switch (interaction.customId) {
                case `characters_${interaction.customId.replace('characters_', '')}`:
                    for (const o of interaction.component.options) {
                        if (o.value === interaction.values.map(v => v)[0]) {
                            await getCharacter(interaction.customId.replace('characters_', ''), Number(o.value)).then(async data => {
                                await client.interactions.edit(interaction, new EmbedBuilder()
                                    .setColor("#FF0000")
                                    .setTitle(`**${data.name}** • ${data.ign}`)
                                    .setThumbnail(data.images[0].icon)
                                    .addFields(
                                        { name: 'Level', value: String(data.level) },
                                        { name: 'Constellation', value: String(data.constellation) },
                                        { name: 'Friendship', value: String(data.friendship) }
                                    )
                                    .setTimestamp()
                                    .setFooter({ text: "Genshin Impact", iconURL: interaction.guild?.iconURL() })
                                )

                            })
                        }

                    }
                break;
            }
        })
    }
}

export default Buttons;
