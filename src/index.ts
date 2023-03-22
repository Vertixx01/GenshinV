import { GatewayIntentBits, Partials } from 'discord.js';
import CustomClient from './classes/customClient';
import loadEvents from './functions/eventLoader';
require('dotenv').config();

const client = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
    ]
});

loadEvents(client);

client.login(process.env.TOKEN);
