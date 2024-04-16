import { useAtom } from 'jotai';
import { useState } from 'react';
import useSound from 'use-sound';
import sprite from './Sounds/sounds.mp3';
import { a_sounds } from './atoms';
import { SPRITE } from './const';

export const usePlaySound = () => {
    const [sounds] = useAtom(a_sounds);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [play] = useSound(sprite, { sprite: SPRITE, playbackRate });

    const playSound = (id, options = {}) => {
        const { force, rate = 1 } = options;

        if (!sounds && !force) {
            return;
        }

        setPlaybackRate(rate);
        play({ id });
    };

    return playSound;
};
