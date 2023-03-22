import { ButtonInteraction, ChannelSelectMenuInteraction, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, MentionableSelectMenuInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from "discord.js"

class Interactions {
    public async reply(interaction: CommandInteraction, message: string, ephemeral: boolean) {
        const embed = new EmbedBuilder().setColor("#FF0000").setDescription(message);
        return await interaction.reply({
            embeds: [embed],
            ephemeral: ephemeral
        });
    }

    public async edit(interaction: CommandInteraction, message: string) {
        const embed = new EmbedBuilder().setColor("#FF0000").setDescription(message);
        return await interaction.editReply({
            embeds: [embed]
        });
    }

    public async delete(interaction: any) {
        await interaction.deferUpdate();
        return await interaction.deleteReply();
    }
}

export default Interactions;