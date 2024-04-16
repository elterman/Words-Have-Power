import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import HumanRobot from './PNG/Human Robot.png';
import Humans from './PNG/Humans.png';
import Question from './PNG/Question.png';
import Preloader from './Preloader';
import { a_entries, a_help_visible, a_mode, a_overlay, a_page } from './atoms';
import { COLOR_P2, GAME_PAGE, MODE_FRIEND, MODE_HELP, MODE_ROBOT, START_PAGE } from './const';
import { defer, scrollToBottom } from './utils';

const StartPage = () => {
    const [overlay] = useAtom(a_overlay);
    const [entries] = useAtom(a_entries);
    const [, showHelp] = useAtom(a_help_visible);
    const [, setMode] = useAtom(a_mode);
    const [, setPage] = useAtom(a_page);

    const onClick = (op) => {
        if (op === MODE_HELP) {
            showHelp(true);
            return;
        }

        setMode(op);
        setPage(GAME_PAGE);

        defer(() => scrollToBottom(entries));
    };

    return <>
        <motion.div className="page start-page" initial={{ opacity: 0 }} animate={{ opacity: overlay ? 0 : 1 }}>
            <div className='title gradient-green gradient-text'>Words Have</div>
            <div className='title neon' style={{ color: COLOR_P2 }}>Power</div>
            <div style={{ height: '70px' }} />
            <img className='option-icon' src={HumanRobot} alt='human vs robot' onClick={() => onClick(MODE_ROBOT)} />
            <img className='option-icon' src={Humans} alt='humans' onClick={() => onClick(MODE_FRIEND)} />
            <img className='option-icon' src={Question} alt='help' onClick={() => onClick(MODE_HELP)} />
        </motion.div>
        <Preloader page={START_PAGE} />
    </>;
};

export default StartPage;