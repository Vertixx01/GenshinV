import { createCanvas, loadImage, Image } from "canvas";
import fs from "fs";

const genChar = async (uid: string, url: string[]) => {
    const width = 895
    const height = 840
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')
    url.map(async (img, index) => {
        const image = await loadImage(img)
        context.drawImage(image, 0, 0, 128, 128, 0 + (index * 128), 0, 128, 128)
    })
    loadImage('./base.png').then(image => {
        context.drawImage(image, 0, 0, width, height)
        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(`${process.cwd()}/images/${uid}_chars.png`, buffer)
    })
};

export default genChar;
