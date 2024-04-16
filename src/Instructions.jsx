import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import PromptPanel from './Prompt Panel';
import { a_error, a_mode, a_over, a_penalty, a_resume, a_turn } from './atoms';
import { GOLD, MODE_ROBOT } from './const';
import { defer, tapOrClick } from './utils';

const Instructions = () => {
    const [turn] = useAtom(a_turn);
    const [mode] = useAtom(a_mode);
    const [over] = useAtom(a_over);
    const [penalty] = useAtom(a_penalty);
    const [instrKey, setInstrKey] = useState(0);
    const [errorMessage] = useAtom(a_error);
    const [resume] = useAtom(a_resume);

    const instructions = {
        0: null,
        1: ['AI is entering a word.'],
        2: ['AI\'s turn.'],
        3: penalty ? ['Use letters from the previous word to charge your',
            <><span>battery.  </span><span style={{ color: GOLD }}>Penalty for introducing new letters!</span></>] :
            ['Use letters from the previous word to earn charge your battery.'],
        4: [`${tapOrClick()} on a word to look up its definition.`],
    };

    useEffect(() => {
        let key = 0;

        if (errorMessage) {
            key = 0;
        } else if (over) {
            key = 4;
        } else if (turn === 1) {
            key = 3;
        } else if (mode === MODE_ROBOT) {
            key = resume ? 2 : 1;
        } else {
            key = 3;
        }

        if (key !== instrKey) {
            setInstrKey(0);
            defer(() => setInstrKey(key), 300);
        }

    }, [errorMessage, instrKey, mode, over, resume, turn]);

    const text = instructions[instrKey];
    const errorPanelStyle = { marginTop: 0 };
    const errorButtonStyle = { color: 'white', background: '#500000', pointerEvents: 'none', height: '36px', padding: '20px' };

    return <div className='instruction-board'>
        <motion.div className='message' animate={{ opacity: text ? 1 : 0 }}>
            {_.map(text, (line, i) => <div key={i}>{line}</div>)}
        </motion.div>
        <PromptPanel labels={[errorMessage]} show={!!errorMessage} style={errorPanelStyle} buttonStyle={errorButtonStyle} />
    </div>;

};

export default Instructions;