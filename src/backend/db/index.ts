import { createClient, SupabaseClient } from '@supabase/supabase-js'

export interface IError {
    code: string;
    message: string;
    discord_id?: string;
    uid?: string;
}

class DB {
    supabase: SupabaseClient;
    constructor() {
        this.supabase = createClient('https://ctagcabfbgtsxfsttioj.supabase.co', 'NAWW');
    }

    async linkUID(uid: string, discord_id: string) {
        const IE: IError = { code: "error", message: "An error occurred." };
        const { data, error } = await this.supabase.from('users').insert([{ uid, discord_id }]);
        if (error) {
            IE.discord_id = discord_id;
            IE.uid = uid;
            return IE;
        }
        return data;
    }

    async findUID(discord_id: string) {
        const { data, error } = await this.supabase.from('users').select('uid').eq('discord_id', discord_id);
        if (error) {
            return { code: "error", message: "An error occurred.", uid: data };
        }
        return data;
    }
}

export default DB;
