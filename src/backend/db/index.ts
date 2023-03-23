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
        this.supabase = createClient('https://ctagcabfbgtsxfsttioj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YWdjYWJmYmd0c3hmc3R0aW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk1NjY0NDQsImV4cCI6MTk5NTE0MjQ0NH0.lNtBnij8TYZ6mZ2yPCXrJqe1H6SAeDWgj9Gd1e0ffOw');
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
