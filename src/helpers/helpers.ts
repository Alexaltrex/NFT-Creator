import body from "../assets/png/B0_Creator/body.png";
import earLeft from "../assets/png/B0_Creator/earLeft.png";
import earRight from "../assets/png/B0_Creator/earRight.png";
import mask from "../assets/png/B0_Creator/mask.png";
import text from "../assets/png/B0_Creator/text.png";
import {srcs} from "../components/B0_Creator/layers";

import {format} from 'date-fns'
import {ITokenJson} from "../types/types";

// timestamp - sec
export const getDate = (timestamp: number): string => format(new Date(timestamp * 1000), 'HH:mm dd.MM.yyyy');

//========= CREATE NFT METADATA =========//
interface ICreateNFTMetadata extends IIndexes {
    tokenId: number
    imageIPFSLink: string
}
export const createNFTMetadata = ({
                                      headIndex,
                                      eyesIndex,
                                      mouthIndex,
                                      noseIndex,
                                      bowsIndex,
                                      tokenId,
                                      imageIPFSLink,
                                  }: ICreateNFTMetadata): ITokenJson => {
    return ({
        name: `Wooden Soldiers Creatable #${tokenId}`,
        description: "Collection of wooden soldiers of Urfin Jus's army",
        image: imageIPFSLink,
        attributes: [
            {
                "trait_type": "Head",
                "value": `Head${headIndex}`
            },
            {
                trait_type: "Eyes",
                value: `Eyes${eyesIndex}`
            },
            {
                trait_type: "Mouth",
                value: `Mouth${mouthIndex}`
            },
            {
                trait_type: "Nose",
                value: `Nose${noseIndex}`
            },
            {
                trait_type: "Bows",
                value: `Bows${bowsIndex}`
            },
        ]
    })
}

//========= CREATE IMAGE IPFS LINK =========//
export const createImageIPFSLink = (cid: string, tokenId: number): string => {
    return `https://w3s.link/ipfs/${cid}/${tokenId}.png`
}

//========= CREATE TOKEN JSON IPFS LINK =========//
export const createTokenIPFSLink = (cid: string, tokenId: number): string => {
    return `https://w3s.link/ipfs/${cid}/${tokenId}.json`
}


//========= LOAD IMAGE =========//
const loadImage = (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
        img.src = path
        img.onload = () => {
            resolve(img)
        }
        img.onerror = e => {
            reject(e)
        }
    })
}


//========= GET CANVAS =========//
export interface IIndexes {
    headIndex: number
    eyesIndex: number
    mouthIndex: number
    noseIndex: number
    bowsIndex: number
}

export const getCanvas = async ({
                                    headIndex,
                                    eyesIndex,
                                    mouthIndex,
                                    noseIndex,
                                    bowsIndex
                                }: IIndexes) => { //: Promise<HTMLCanvasElement >
    try {
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 1000;
        const ctx = canvas.getContext("2d");

        ctx!.fillStyle = "#262626";
        ctx!.fillRect(0, 0, 1000, 1000);

        const srcs0 = [body, earLeft];
        for (let i = 0; i < srcs0.length; i++) {
            const img = await loadImage(srcs0[i]);
            ctx?.drawImage(img, 0, 0, 1000, 1000);
        }

        const indexes = [headIndex, eyesIndex, mouthIndex, noseIndex, bowsIndex];
        for (let i = 0; i < indexes.length; i++) {
            const img = await loadImage(srcs[i][indexes[i]]);
            ctx?.drawImage(img, 0, 0, 1000, 1000);
        }

        const srcs1 = [earRight, mask, text];
        for (let i = 0; i < srcs1.length; i++) {
            const img = await loadImage(srcs1[i]);
            ctx?.drawImage(img, 0, 0, 1000, 1000);
        }
        return canvas;
    } catch (e: any) {
        console.log(e.message)
    }
}

//========= TO BLOB =========//
export function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob);
        });
    });
}

export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
