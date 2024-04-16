import Human1 from './PNG/Human 1.png';
import Human2 from './PNG/Human 2.png';
import Robot from './PNG/Robot.png';
import Glasses from './PNG/Glasses.png';
import RobotEyes from './PNG/Robot Eyes.png';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { a_mode, a_over, a_turn } from './atoms';
import { MODE_ROBOT } from './const';
import { useSwitchPlayer } from './useSwitchPlayer';
import { useEffect, useRef, useState } from 'react';

const Player = (props) => {
    const { player } = props;
    const [mode] = useAtom(a_mode);
    const [turn] = useAtom(a_turn);
    const [over] = useAtom(a_over);
    const { canSwitchPlayer, switchPlayer } = useSwitchPlayer();
    const [left, setLeft] = useState(true);
    const l = useRef({}).current;

    useEffect(() => {
        if (over !== 'lost') {
            clearTimeout(l.tid);
            return;
        }

        l.tid = setTimeout(() => {
            clearTimeout(l.tid);
            setLeft(!left);
        }, 900);
    }, [l, left, over]);

    const gridArea = player === 1 ? '1/1' : '1/5';
    const src = player === 1 ? Human1 : (mode === MODE_ROBOT ? Robot : Human2);
    const spin = player === turn && !over;
    const animate = { transform: `rotateY(${spin ? 180 : 0}deg)` };
    const transition = spin ? { repeat: Infinity, repeatType: 'reverse', ease: 'linear', duration: 0.8 } : false;
    const canClick = canSwitchPlayer(player);
    const pointerEvents = canClick ? 'all' : 'none';
    const cursor = canClick ? 'pointer' : 'initial';

    const renderOver = () => {
        const pointerEvents = 'none';

        if (over === 'lost' && player === 2) {
            const clipPath = `inset(0% ${left ? 50 : 0}% 0% ${left ? 0 : 50}%)`;
            return <img className='player' src={RobotEyes} alt='robot eyes' width={60} style={{ pointerEvents, opacity: 1, clipPath }} />;
        }

        const cool = player === 1 ? (over === 'won' || over === 'player1wins') : over === 'player2wins';

        return <motion.img className='player' src={Glasses} alt='glasses' width={60} style={{ pointerEvents }}
            initial={{ opacity: 0 }} animate={{ opacity: cool ? 1 : 0 }} transition={{ duration: cool ? 1 : 0 }} />;
    };

    return <motion.div style={{ display: 'grid', gridArea, pointerEvents, cursor }}
        animate={animate} transition={transition} onClick={switchPlayer}>
        <motion.img className='player' src={src} alt='player' width={60} />
        {renderOver()}
    </motion.div>;
};

export default Player;
