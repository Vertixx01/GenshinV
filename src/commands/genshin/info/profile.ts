import { ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";
import CustomClient from "../../../classes/customClient";
import getProfile from "../../../backend/genshin/functions/profile";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Shows the users profile")
        .addStringOption(uid => uid.setName("uid").setDescription("The UID of the player")),

    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        const uid = interaction.options.getString("uid");
        try {
            if (!uid) {
                await client.supabase.findUID(interaction.user.id).then(res => res).then(async (res) => {
                    if (typeof res === "object") {
                        await getProfile(String(JSON.stringify(res).replace(/[^0-9]/g, ''))).then(async data => {
                            await interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("#FF0000")
                                        .setTitle(`**${data.name}**'s profile`)
                                        .setDescription(`UID: ${data.uid}`)
                                        .addFields(
                                            { name: 'Adventure Level', value: String(data.levels.adventure) },
                                            { name: 'World Level', value: String(data.levels.world) },
                                            { name: 'Characters', value: data.characters.map(char => `${char.name} - Level ${char.level} - Constellation ${char.constellation}`).join("\n") }
                                        )
                                        .setTimestamp()
                                        .setFooter({ text: "GenshinV", iconURL: interaction.guild?.iconURL() })
                                ],
                                components: [{ type: 1, components: [new StringSelectMenuBuilder().setCustomId(`characters_${String(JSON.stringify(res).replace(/[^0-9]/g, ''))}`).setPlaceholder("Select a character").addOptions(data.characters.map(char => ({ label: char.name, description: char.description, value: String(data.characters.findIndex(c => c.id === char.id)) })))] }]
                            })
                        })
                    } else {
                        console.log(res)
                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle("UID not provided.")
                                    .setDescription("Please provide a UID or link your account with `/linkuid`")
                                    .setColor(Colors.Red)
                                    .setTimestamp()
                                    .setFooter({ text: "GenshinV", iconURL: interaction.guild?.iconURL() })
                            ], components: [{
                                type: 1, components: [
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Primary)
                                        .setEmoji("🔗")
                                        .setLabel("Link UID")
                                        .setCustomId("linkuid")
                                ]
                            }]
                        });
                    }
                })
            } else {
                await getProfile(uid).then(async data => {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF0000")
                                .setTitle(`**${data.name}**'s profile`)
                                .setDescription(`UID: ${data.uid}`)
                                .addFields(
                                    { name: 'Adventure Level', value: String(data.levels.adventure) },
                                    { name: 'World Level', value: String(data.levels.world) },
                                    { name: 'Characters', value: data.characters.map(char => `${char.name} - Level ${char.level} - Constellation ${char.constellation}`).join("\n") }
                                )
                                .setTimestamp()
                                .setFooter({ text: "GenshinV", iconURL: interaction.guild?.iconURL() })
                        ],
                        components: [{ type: 1, components: [new StringSelectMenuBuilder().setCustomId(`characters_${uid}`).setPlaceholder("Select a character").addOptions(data.characters.map(char => ({ label: char.name, description: char.description, value: String(data.characters.findIndex(c => c.id === char.id)) })))] }]
                    })
                })
            }
        } catch (error) {
            console.log(error)
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("An error occured.")
                        .setDescription("Please try again later.")
                        .setColor(Colors.Red)
                        .setTimestamp()
                        .setFooter({ text: "GenshinV", iconURL: interaction.guild?.iconURL() })
                ]
            });
        }
    }
}
