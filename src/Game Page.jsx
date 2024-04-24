import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import Board from './Board';
import Instructions from './Instructions';
import Keyboard from './Keyboard';
import PlayerPanel from './Player Panel';
import Prompts from './Prompts';
import Toolbar from './Toolbar';
import SwitchPrompt from './Switch Prompt';
// eslint-disable-next-line max-len
import { a_blacklist, a_dict_size, a_entries, a_full_dict, a_input, a_over, a_overlay, a_penalty, a_points_to_win, a_resume, a_robo_entry, a_robo_move, a_small_dict, a_tile_feedback, a_unrepeat_count } from './atoms';
import { FULL } from './const';
import useKeyboard from './useKeyboard';
import { usePlaySound } from './usePlaySound';
import { calcGain, calcScore, defer, sameSeq } from './utils';

const GamePage = () => {
    const [over] = useAtom(a_over);
    const [overlay] = useAtom(a_overlay);
    const [resume] = useAtom(a_resume);
    const [penalty] = useAtom(a_penalty);
    const [roboMove] = useAtom(a_robo_move);
    const [roboEntry, setRoboEntry] = useAtom(a_robo_entry);
    const [fullDict] = useAtom(a_full_dict);
    const [smallDict] = useAtom(a_small_dict);
    const [dictSize] = useAtom(a_dict_size);
    const { processKey } = useKeyboard();
    const playSound = usePlaySound();
    const [input, setInput] = useAtom(a_input);
    const [tileFeedback] = useAtom(a_tile_feedback);
    const [entries] = useAtom(a_entries);
    const [unrepeatCount] = useAtom(a_unrepeat_count);
    const [blacklist] = useAtom(a_blacklist);
    const [p2w] = useAtom(a_points_to_win);

    const type = useCallback((i) => {
        if (i > roboEntry.length) {
            processKey('ENTER', roboEntry);
            setRoboEntry(null);

            return;
        }

        playSound('tap');
        setInput(roboEntry.substring(0, i));
    }, [playSound, processKey, roboEntry, setInput, setRoboEntry]);

    useEffect(() => {
        if (roboEntry && !tileFeedback) {
            defer(() => type(input.length + 1), input.length ? 350 : 1500);
        }
    }, [input, roboEntry, tileFeedback, type]);

    useEffect(() => {
        if (!roboMove || roboEntry || over || resume) {
            return;
        }

        const dict = dictSize === FULL ? fullDict : smallDict;
        const prevWord = _.last(entries).word;

        let matches = _.map(dict, (w, i) => {
            const used = _.find(entries, e => e.word === w);
            const ok = !used && (!unrepeatCount || !sameSeq(w, prevWord, unrepeatCount)) && _.every(w, ch => !blacklist.includes(ch));
            const en = { word: w, gain: ok ? calcGain(prevWord, w, penalty).gain : -100 };
            return en;
        });

        matches = _.sortBy(matches, [en => -en.gain]);
        const maxGain = matches[0].gain;
        let sampleEntries = _.filter(matches, en => en.gain === maxGain);

        if (entries.length > 2 && entries[1].player === 1) {
            const score1 = calcScore(entries, 1);
            const score2 = calcScore(entries, 2);

            if (score2 + maxGain >= p2w && score2 + maxGain > score1) {
                const scoreToBeat = Math.max(score1, p2w - 1);
                const minGain = scoreToBeat + 1 - score2;

                for (let gain = minGain; gain <= maxGain; gain++) {
                    const ens = _.filter(matches, en => en.gain === gain);

                    if (ens.length > 0) {
                        sampleEntries = ens;
                        break;
                    }
                }
            }
        }

        const word = _.sample(sampleEntries).word;
        defer(() => setRoboEntry(word), 500);
    }, [smallDict, entries, over, resume, roboEntry, roboMove, setRoboEntry, unrepeatCount, blacklist, dictSize, fullDict, p2w, penalty]);

    return <motion.div className="page game-page" initial={{ opacity: 0 }} animate={{ opacity: overlay ? 0 : 1 }}>
        <PlayerPanel />
        <Board />
        <SwitchPrompt />
        <Instructions />
        <div className='keybaord-and-prompts'>
            <Keyboard />
            <Prompts />
        </div>
        <Toolbar />
    </motion.div>;
};

export default GamePage;