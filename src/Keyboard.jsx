import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import Erase from './PNG/Erase.png';
import { a_blacklist, a_blacklist_size, a_erasing, a_error, a_input, a_kb_scale, a_over, a_prompt_visible, a_robo_move } from './atoms';
import { BACKSPACE, RETURN } from './const';
import useKeyboard from './useKeyboard';
import useLongPress from './useLongPress';
import { defer } from './utils';

const Keyboard = () => {
    const { processKey } = useKeyboard();
    const [promptVisible] = useAtom(a_prompt_visible);
    const [input] = useAtom(a_input);
    const [roboMove] = useAtom(a_robo_move);
    const [kbScale] = useAtom(a_kb_scale);
    const [erasing, setErasing] = useAtom(a_erasing);
    const [blacklist] = useAtom(a_blacklist);
    const [blacklistSize] = useAtom(a_blacklist_size);
    const [over] = useAtom(a_over);
    const [error] = useAtom(a_error);
    const [blacking, setBlacking] = useState(true);

    useEffect(() => {
        if (!erasing) {
            return;
        }

        if (!input.length) {
            setErasing(false);
            return;
        }

        defer(() => processKey(BACKSPACE), 50);
    }, [erasing, input.length, processKey, setErasing]);

    useEffect(() => {
        if (blacklistSize === 0 || !error || !error.includes('lacklisted')) {
            return;
        }

        const blink = count => {
            if (count-- === 0) {
                setBlacking(true);
                return;
            }

            setBlacking(on => !on);
            defer(() => blink(count), 300);
        };

        defer(() => blink(5), 1000);
    }, [blacklistSize, error]);

    const KeyboardButton = (props) => {
        const { ch } = props;
        let { action, handlers } = useLongPress();

        useEffect(() => {
            if (action === 'click') {
                processKey(ch);
                return;
            }

            if (action === 'longpress' && ch === BACKSPACE && input.length) {
                setErasing(true);
            }
        }, [action, ch]);

        const cr = ch === RETURN;
        const bs = ch === BACKSPACE;
        const label = cr ? 'ENTER' : bs ? <img src={Erase} alt='erase' width={27} /> : ch;
        const disabled = promptVisible || roboMove;
        const black = blacklist.includes(label) && !over;
        const opacity = disabled ? (black ? 0.5 : 0.2) : 1;
        const style = { display: 'grid', gridArea: '1/1' };
        const classes = `kb-button ${bs ? 'kb-backspace' : ''} ${cr ? 'kb-return' : ''}`;
        const width = cr ? 100 / kbScale : bs ? 60 : 36;

        return <div className={classes} style={{ width }} {...handlers}>
            {black && blacking && <span className='kb-black' />}
            {roboMove || !promptVisible ? <span style={{ opacity, zIndex: 1, ...style }}>{label}</span> :
                <motion.span initial={{ opacity: 1.2 - opacity }} animate={{ opacity }} style={{ ...style }}>{label}</motion.span>}
        </div>;
    };

    const pointerEvents = promptVisible || roboMove ? 'none' : 'all';

    return <div className="keyboard" style={{ pointerEvents, transform: `scaleX(${kbScale})` }}>
        <div className="kb-row">
            {_.map('QWERTYUIOP', ch => <KeyboardButton key={ch} ch={ch} />)}
        </div>
        <div className="kb-row">
            {_.map('ASDFGHJKL', ch => <KeyboardButton key={ch} ch={ch} />)}
        </div>
        <div className="kb-row" style={{ transform: 'translateX(10px)' }}>
            {_.map(`ZXCVBNM${BACKSPACE}`, ch => <KeyboardButton key={ch} ch={ch} />)}
        </div>
        <div className="kb-row">
            {_.map(`${RETURN}`, ch => <KeyboardButton key={ch} ch={ch} />)}
        </div>
    </div>;
};

export default Keyboard;