import { useAtom } from 'jotai';
import _ from 'lodash';
import { useCallback } from 'react';
import { a_mode, a_over, a_p2w, a_rune_my_player } from './atoms';
import { MODE_ROBOT, MODE_RUNE } from './const';
// import { RA_PLAYER_OVER } from './logic';
import usePlaySound from './usePlaySound';
import { calcScore, defer } from './utils';

const useCheckOver = () => {
    // const [entries] = useAtom(a_entries);
    const [mode] = useAtom(a_mode);
    const [p2w] = useAtom(a_p2w);
    const [, setOver] = useAtom(a_over);
    const playSound = usePlaySound();
    const [myPlayer] = useAtom(a_rune_my_player);

    const checkOver = useCallback((entries) => {
        const score1 = calcScore(entries, 1);
        const score2 = calcScore(entries, 2);

        if ((score1 >= p2w || score2 >= p2w)) {
            const count = (player) => _.filter(entries, en => en.player === player).length;

            if (count(1) === count(2)) {
                let chime;

                if (mode === MODE_ROBOT) {
                    chime = score1 > score2 ? 'won' : score2 > score1 ? 'lost' : 'draw';
                }
                else if (mode === MODE_RUNE) {
                    if (myPlayer) {
                        chime = score1 > score2 ? (myPlayer === 1 ? 'won' : 'lost') :
                            score2 > score1 ? (myPlayer === 2 ? 'won' : 'lost') : 'draw';
                    } else {
                        chime = score1 > score2 ? 'player1wins' : score2 > score1 ? 'player2wins' : 'draw';
                    }
                }
                else {
                    chime = score1 > score2 ? 'player1wins' : score2 > score1 ? 'player2wins' : 'draw';
                }

                setOver(chime);
                defer(() => playSound(chime), 600);

                return true;
            }
        }

        return false;
    }, [mode, myPlayer, p2w, playSound, setOver]);

    return { checkOver };
};

export default useCheckOver;