import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Buttons from "../../../src/classes/buttons";
import CustomClient from "../../classes/customClient";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot's ping"),

    execute(interaction: ChatInputCommandInteraction, client: CustomClient) {
        const buttons = new Buttons();
        const embed = new EmbedBuilder().setColor("#FF0000").setDescription(`Pong! \`${client.ws.ping}ms\``)
        interaction.reply({
            embeds: [embed],
            components: [{
                type: 1,
                components: [buttons.deleteButton()]
            }]
        })
    }
}
