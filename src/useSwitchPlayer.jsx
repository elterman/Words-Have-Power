import { useAtom } from 'jotai';
import { a_entries, a_input, a_mode, a_resume, a_turn } from './atoms';
import { MODE_ROBOT } from './const';
import { usePlaySound } from './usePlaySound';

export const useSwitchPlayer = () => {
    const [mode] = useAtom(a_mode);
    const [resume] = useAtom(a_resume);
    const [entries] = useAtom(a_entries);
    const [, setInput] = useAtom(a_input);
    const [turn, setTurn] = useAtom(a_turn);
    const playSound = usePlaySound();

    const canSwitchPlayer = (player) => {
        if (player === turn) {
            return false;
        }

        if (entries.length > 1) {
            return false;
        }

        if (mode === MODE_ROBOT && turn === 2 && !resume) {
            return false;
        }

        return true;
    };

    const switchPlayer = () => {
        playSound('oops', { rate: 2 });
        setInput('');
        setTurn(3 - turn);
    };

    return { canSwitchPlayer, switchPlayer };
};
