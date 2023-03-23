import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import CustomClient from "../../../classes/customClient";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("linkuid")
        .setDescription("Link your UID to your Discord account.")
        .addStringOption(uid => uid.setName("uid").setDescription("The UID of the player")),

    async execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        const uid = interaction.options.getString("uid");

        if (!uid) return interaction.reply({ content: "Please provide a UID", ephemeral: true });

        const link = await client.supabase.linkUID(uid, interaction.user.id).then(res => res);

        if (typeof link === "object" && link.code === "error") {
            const embed = new EmbedBuilder()
                .setTitle(`UID Already Linked • ${client.users.cache.get(link.discord_id).username}#${client.users.cache.get(link.discord_id).discriminator}`)
                .setColor(Colors.Red)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const embed = new EmbedBuilder()
                .setTitle("UID Linked")
                .setDescription(`Your UID has been linked to your Discord account.`)
                .setColor(Colors.Green)
                .setTimestamp()
                .setFooter({ text: `UID: ${uid}` });

            return interaction.reply({ embeds: [embed] });
        }
    }
}
