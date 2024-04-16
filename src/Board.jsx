import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Entry } from './Entry';
import Zot from './Svg Zot';
import { a_entries, a_flip, a_init, a_kb_scale, a_over } from './atoms';
import { BLUEISH, BOARD_SIZE, HOT_PINK, LIME } from './const';
import { useForceUpdate } from './useForceUpdate';
import { usePlaySound } from './usePlaySound';
import { defer, scrollClass } from './utils';

const Board = (props) => {
    const [entries] = useAtom(a_entries);
    const [flip, setFlip] = useAtom(a_flip);
    const [over] = useAtom(a_over);
    const [kbScale] = useAtom(a_kb_scale);
    const playSound = usePlaySound();
    const [, init] = useAtom(a_init);
    const forceUpdate = useForceUpdate(true);
    const [done, setDone] = useState(null);

    useEffect(() => { flip && forceUpdate(); }, [flip, forceUpdate]);

    useEffect(() => {
        if (over) {
            let _done = 'draw';

            if (over === 'won' || over === 'player1wins') {
                _done = 'won';
            }

            if (over === 'lost' || over === 'player2wins') {
                _done = 'lost';
            }

            defer(() => setDone(_done), 300);
        } else {
            setDone(null);
        }
    }, [over]);

    const classes = `board ${scrollClass()}`;

    let flipTransform = `rotateY(${flip ? 90 : 0}deg)`;
    let flipTransition = { duration: 0.7 };

    const onFlipped = () => {
        if (flip) {
            playSound('dice');
            init(true);
            setFlip(false);
        }
    };

    const transform = `scaleX(${kbScale})`;
    const color = done === 'won' ? LIME : done === 'lost' ? HOT_PINK : BLUEISH;

    return <>
        <motion.div style={{ gridArea: '2/1', transform, display: 'grid' }}>
            <Zot width={250} color={color} done={done && !flip} style={{ gridArea: '1/1', placeSelf: 'center', marginTop: '10px' }} />
            <motion.div className={classes} style={{ gridArea: '1/1', width: BOARD_SIZE }}
                animate={{ transform: flipTransform }} transition={flipTransition} onAnimationComplete={onFlipped}>
                {_.map(_.range(0, entries.length + (over ? 0 : 1)), (row) => <Entry key={row} row={row} />)}
            </motion.div>
        </motion.div>
        <motion.div className={`board electric-${done || 'draw'}`}
            style={{ transform }} animate={{ opacity: done && !flip ? 1 : 0 }} transition={{ duration: 1 }} />
    </>;
};

export default Board;