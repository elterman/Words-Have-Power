import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
// eslint-disable-next-line max-len
import { a_entries, a_input, a_mode, a_tile_feedback, a_turn } from './atoms';
import { UNDERSCORE } from './const';
import { playerColor } from './utils';

const Tile = (props) => {
    const { row, col, size, style } = props;
    const [entries] = useAtom(a_entries);
    const [mode] = useAtom(a_mode);
    const [turn] = useAtom(a_turn);
    const [input] = useAtom(a_input);
    const [tileFeedback, setTileFeedback] = useAtom(a_tile_feedback);

    const width = `${size}px`;
    let letter = null;
    const inputRow = entries.length + 1;

    if (row === inputRow) {
        if (input.length >= col) {
            letter = input[col - 1];
        } else if (col === input.length + 1) {
            letter = UNDERSCORE;
        }
    } else {
        letter = entries[row - 1].word[col - 1];
    }

    let off = 0;
    const errTransition = { repeat: 4, repeatType: 'reverse', duration: 0.05 };
    let scale = 1;
    const typeTransition = { duration: 0.05 };

    if (tileFeedback && row === inputRow) {
        if (tileFeedback === 'error') {
            off = 10;
        } else if (tileFeedback === 'type' && (col === input.length)) {
            scale = 0.85;
        }
    }

    const renderCaret = () => {
        const color = playerColor(turn, mode);

        return <div className='tile' style={{ width }}>
            <motion.div style={{ transform: 'translateY(-4px) scale(1.3)', color }}
                animate={{ opacity: 0 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.35 }}>
                {UNDERSCORE}
            </motion.div>
        </div>;
    };

    const onAnimationComplete = () => {
        setTileFeedback(null);
    };

    const pointerEvents = 'none';

    return <motion.div style={{ gridArea: `1/${col}`, pointerEvents }} animate={{ transform: `translateX(-${off}px)` }}
        transition={errTransition} onAnimationComplete={onAnimationComplete}>
        <motion.div style={{ pointerEvents }} animate={{ transform: `scale(${scale})` }}
            transition={typeTransition} onAnimationComplete={onAnimationComplete}>
            {letter === UNDERSCORE ? renderCaret() : <div className='tile' style={{ width, ...style }}>
                <span style={{ gridArea: '1/1', zIndex: 1 }}>{letter}</span>
            </div>}
        </motion.div>
    </motion.div>;
};

export default Tile;