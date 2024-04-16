import { useAtom } from 'jotai';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
// eslint-disable-next-line max-len
import { a_animate_scores, a_blacklist, a_full_dict, a_entries, a_error, a_flip, a_input, a_mode, a_over, a_overlay, a_penalty, a_points_to_win, a_restart, a_resume, a_robo_move, a_tile_feedback, a_turn, a_unrepeat_count } from './atoms';
// eslint-disable-next-line max-len
import { BACKSPACE, ERR_BEEN_USED, ERR_BLACKLISTED, ERR_BLACKLISTED_LETTER, ERR_MUST_START_DIFFERENT, ERR_NOT_IN_DICT, ERR_NO_FIRST_LETTER_REPEAT, MODE_ROBOT, RETURN } from './const';
import { usePlaySound } from './usePlaySound';
import { calcGain, calcScore, defer, sameSeq, scrollToBottom } from './utils';

const useKeyboard = () => {
    const [entries, setEntries] = useAtom(a_entries);
    const [mode] = useAtom(a_mode);
    const [dict] = useAtom(a_full_dict);
    const [input, setInput] = useAtom(a_input);
    const [turn, setTurn] = useAtom(a_turn);
    const [p2w] = useAtom(a_points_to_win);
    const [roboMove] = useAtom(a_robo_move);
    const [overlay] = useAtom(a_overlay);
    const [over, setOver] = useAtom(a_over);
    const [, setError] = useAtom(a_error);
    const [resume, setResume] = useAtom(a_resume);
    const [restart, setRestart] = useAtom(a_restart);
    const [, setTileFeedback] = useAtom(a_tile_feedback);
    const [pressEnter, setPressEnter] = useState(false);
    const playSound = usePlaySound();
    const [, setFlip] = useAtom(a_flip);
    const [penalty] = useAtom(a_penalty);
    const [unrepeatCount] = useAtom(a_unrepeat_count);
    const [, setAnimateScores] = useAtom(a_animate_scores);
    const [blacklist] = useAtom(a_blacklist);

    const checkOver = useCallback((regain = false) => {
        if (regain) {
            let change = false;

            _.each(entries, (en, row) => {
                if (row === 0) {
                    return;
                }

                const { gain } = calcGain(entries[row - 1].word, en.word, penalty);

                if (en.gain !== gain) {
                    en.gain = gain;
                    change = true;
                }
            });

            if (change) {
                setEntries([...entries]);
                setAnimateScores([false, false]);
            }
        }

        const score1 = calcScore(entries, 1);
        const score2 = calcScore(entries, 2);

        if ((score1 >= p2w || score2 >= p2w)) {
            const count = (player) => _.filter(entries, en => en.player === player).length;

            if (count(1) === count(2)) {
                let chime;

                if (mode === MODE_ROBOT) {
                    chime = score1 > score2 ? 'won' : score2 > score1 ? 'lost' : 'draw';
                } else {
                    chime = score1 > score2 ? 'player1wins' : score2 > score1 ? 'player2wins' : 'draw';
                }

                setOver(chime);

                defer(() => playSound(chime), 600);
            }
        }
    }, [entries, mode, p2w, penalty, playSound, setAnimateScores, setEntries, setOver]);

    const processKey = useCallback((ch, roboInput) => {
        if (overlay) {
            return;
        }

        const esc = ch === 'ESCAPE';

        if (esc && restart) {
            setRestart(false);
            return;
        }

        const cr = ch === RETURN || ch === 'ENTER';

        if (cr) {
            setResume(false);

            if (over || restart) {
                setFlip(true);
                return;
            } else if (resume) {
                playSound('dice');
                return;
            }
        }

        if (roboMove && !roboInput) {
            return;
        }

        if (resume || restart || over) {
            return;
        }

        const bs = ch === BACKSPACE || ch === 'BACKSPACE';

        if (!bs && !cr && !isAlpha(ch)) {
            return;
        }

        if (cr) {
            const _input = roboInput || input;

            const provideErrorFeedback = () => {
                playSound('lost', { rate: 1.5 });
                setTileFeedback('error');
            };

            let error = false;
            let errorMessage = false;

            if (_input.length > 0 && unrepeatCount && sameSeq(_input, _.last(entries).word, unrepeatCount)) {
                error = true;
                errorMessage = unrepeatCount > 1 ? ERR_MUST_START_DIFFERENT : ERR_NO_FIRST_LETTER_REPEAT;
            } else if (_.some(_input, ch => blacklist.includes(ch))) {
                error = true;
                errorMessage = ERR_BLACKLISTED;
            } else if (_.find(entries, en => en.word === _input)) {
                error = true;
                errorMessage = ERR_BEEN_USED;
            } else if (!_.find(dict, w => w === _input)) {
                error = true;

                if (_input.length) {
                    errorMessage = ERR_NOT_IN_DICT;
                }
            }

            if (error) {
                provideErrorFeedback();

                if (errorMessage) {
                    setError(errorMessage);
                    defer(() => setError(null), 2000);
                }

                return;
            }

            setInput('');

            const { gain, indexes } = calcGain(_.last(entries)?.word, _input, penalty);

            entries.push({ word: _input, gain, indexes, player: turn });
            setEntries([...entries]);
            setTurn(3 - turn);

            checkOver();

            playSound(turn === 2 ? 'score2' : 'score1');
        } else if (bs) {
            playSound('tap');
            input.length && setInput(input.slice(0, -1));
        } else if (input.length < 15) {
            let error = false;;

            if (blacklist.includes(ch)) {
                error = `"${ch}" ${ERR_BLACKLISTED_LETTER}`;
            } else if (input.length === unrepeatCount - 1 && sameSeq(input + ch, _.last(entries).word, unrepeatCount)) {
                error = unrepeatCount > 1 ? ERR_MUST_START_DIFFERENT : ERR_NO_FIRST_LETTER_REPEAT;
            }

            if (error) {
                setError(error);
                defer(() => setError(null), 2000);

                playSound('lost', { rate: 3 });
            } else {
                playSound('tap');
            }

            setInput(input + ch);
        } else {
            playSound('lost', { rate: 3 });
        }

        scrollToBottom(entries);
        // eslint-disable-next-line max-len
    }, [blacklist, checkOver, dict, entries, input, over, overlay, penalty, playSound, restart, resume, roboMove, setEntries, setError, setFlip, setInput, setRestart, setResume, setTileFeedback, setTurn, turn, unrepeatCount]);

    useEffect(() => {
        if (!pressEnter) {
            return;
        }

        processKey('ENTER');
        setPressEnter(false);
    }, [pressEnter, processKey]);

    const isAlpha = (char) => /^[a-z]$/i.test(char);

    return { processKey, checkOver };
};

export default useKeyboard;