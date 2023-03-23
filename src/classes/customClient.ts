import { Client, Collection, Colors} from 'discord.js';
import configuration from '../../configs/config.json';
import Interactions from '../systems/messageInteractions';
import DB from '../backend/db';

class CustomClient extends Client {
    color = Colors.Blurple;
    config = configuration;
    commands = new Collection();
    buttons = new Collection();
    selectMenus = new Collection();
    interactions = new Interactions();
    supabase = new DB();
}

export default CustomClient;
