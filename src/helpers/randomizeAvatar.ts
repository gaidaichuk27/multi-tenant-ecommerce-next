import { StaticImageData } from 'next/image';
import avatarDefault from '@images/avatars/ava_1.png';

function hashSeed(seed: string, length: number): number {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }

    return hash % length;
}

export const randomizeAvatar = (
    imgArr: StaticImageData[],
    seed?: string,
): StaticImageData => {
    if (!imgArr.length) {
        return avatarDefault;
    }

    if (imgArr.length === 1) {
        return imgArr[0];
    }

    if (seed) {
        return imgArr[hashSeed(seed, imgArr.length)];
    }

    const randomIndex = Math.floor(Math.random() * imgArr.length);

    return imgArr[randomIndex];
};
