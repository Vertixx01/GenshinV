import client from "..";

export interface Character {
    ign: string,
    name: string,
    description: string,
    level: string | number,
    constellation: string | number,
    friendship: string | number,
    images: {
        icon: string,
    }[],
}

const getCharacter = async (uid: string, index: number) => {
    let result: Character;
    const data = await client.getPlayer(uid);
    if (!data) return null;
    result = {
        ign: data.player.username,
        name: data.characters[index].name,
        description: `Level ${data.characters[index].properties.level.val} - Constellation ${data.characters[index].constellationsList.length} - XP: ${data.characters[index].properties.xp.val}`,
        level: data.characters[index].properties.level.val,
        constellation: data.characters[index].constellationsList.length,
        friendship: data.characters[index].friendship.level,
        images: [
            {
                icon: `https://enka.network/ui/${data.characters[index].assets.icon}.png`,
            }
        ]
    };
    return result;
}

export default getCharacter;
