import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, CommandInteraction, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import getCharacter from '../backend/genshin/functions/characters';
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
        client.on('interactionCreate', async (interaction) => {
            if (interaction.isButton()) {
                switch (interaction.customId) {
                    case "reply":
                        await client.interactions.reply(interaction, "Replied!", false);
                    case "delete":
                        await client.interactions.delete(interaction);
                        break;
                    case "edit":
                        await client.interactions.edit(interaction, new EmbedBuilder().setColor("#FF0000").setDescription("Edited!"));
                        break;
                    case "linkuid":
                        await client.interactions.showModal(interaction, new ModalBuilder()
                            .setTitle("Link UID")
                            .setCustomId("linkuidmodal")
                            .addComponents(
                                new ActionRowBuilder({
                                    components: [
                                        new TextInputBuilder()
                                            .setCustomId("uid")
                                            .setLabel("Enter your UID")
                                            .setPlaceholder("UID")
                                            .setStyle(TextInputStyle.Short)
                                            .setMinLength(9)
                                            .setMaxLength(9)
                                            .setRequired(true)

                                    ]
                                })
                            )
                        )
                }
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
                                await interaction.update({
                                    embeds: [
                                        new EmbedBuilder()
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
                                    ],
                                })

                            })
                        }

                    }
                    break;
            }
        })
    }

    public async handleModal(interaction: ChatInputCommandInteraction, client: CustomClient) {
        client.on('interactionCreate', async (interaction) => {
            if (interaction.isModalSubmit()) {
                switch (interaction.customId) {
                    case "linkuidmodal":
                        const uid = interaction.fields.getTextInputValue("uid");
                        if (uid.length !== 9) return await client.interactions.reply(interaction, "UID must be 9 characters long", true);
                        else if (isNaN(Number(uid))) return await client.interactions.reply(interaction, "UID must be a number", true);
                        const link = await client.supabase.linkUID(uid, interaction.user.id).then(res => res);
                        if (typeof link === "object") {
                            const embed = new EmbedBuilder()
                                .setTitle("UID Linked")
                                .setDescription(`Your UID has been linked to your Discord account.`)
                                .setColor(Colors.Green)
                                .setTimestamp()
                                .setFooter({ text: `UID: ${uid}` });

                            return interaction.reply({ embeds: [embed] });
                        } else {
                            const embed = new EmbedBuilder()
                                .setTitle(`UID Already Linked.`)
                                .setColor(Colors.Red)
                            return interaction.reply({ embeds: [embed], ephemeral: true });
                        }

                }
            }
        })
    }
}

export default Buttons;
