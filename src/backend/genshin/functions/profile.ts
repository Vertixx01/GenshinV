import client from "..";

export interface Profile {
    uid: string,
    name: string,
    levels: {
        adventure: string | number,
        world: string | number
    },
    characters: {
        id: string | number,
        name: string,
        description: string,
        level: string | number,
        constellation: string | number,
        images: {
            icon: string,
        }[],
    }[]
}

const getProfile = async (uid: string) => {
    let result: Profile;
    const data = await client.getPlayer(uid);
    if (!data) return null;
    result = {
        uid: data.uid,
        name: data.player.username,
        levels: {
            adventure: data.player.levels.rank,
            world: data.player.levels.world
        },
        characters: data.characters.map(char => {
            return {
                id: char.characterId,
                name: char.name,
                description: `Level ${char.properties.level.val} - Constellation ${char.constellationsList.length} - XP: ${char.properties.xp.val}`,
                level: char.properties.level.val,
                constellation: char.constellationsList.length,
                images: [
                    {
                        icon: `https://enka.network/ui/${char.assets.icon}.png`,
                    }
                ]
            }
        })
    };
    return result;
};

export default getProfile;
