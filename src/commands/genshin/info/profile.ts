import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";
import CustomClient from "../../../classes/customClient";
import getProfile from "../../../backend/functions/profile";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Shows the users profile")
        .addStringOption(uid => uid.setName("uid").setDescription("The UID of the player")),

    execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        const uid = interaction.options.getString("uid");
        if (!uid) return interaction.reply({ content: "Please provide a UID", ephemeral: true });
        getProfile(uid).then(async data => {
            interaction.reply({
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
                        .setFooter({ text: "Genshin Impact", iconURL: interaction.guild?.iconURL() })
                ],
                components: [{ type: 1, components: [new StringSelectMenuBuilder().setCustomId(`characters_${uid}`).setPlaceholder("Select a character").addOptions(data.characters.map(char => ({ label: char.name, description: char.description , value: String(data.characters.findIndex(c => c.id === char.id)) }))) ] }]
            })
        })
    }
}
