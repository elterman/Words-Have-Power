import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { a_first_time } from './atoms';
import { tapOrClick } from './utils';

const SwitchPrompt = () => {
    const [firstTime, setFirstTime] = useAtom(a_first_time);

    const pointerEvents = firstTime ? 'all' : 'none';

    return <motion.div className='switch-prompt'
        animate={{ opacity: firstTime ? 1 : 0 }} transition={{ delay: firstTime ? 1 : 0 }}>
        <svg id="svg-switch-callout" viewport='0 0 400 200' width='100%' height='100%' xmlns="http://www.w3.org/2000/svg"
            style={{ gridArea: '1/1', display: 'block', zIndex: 1 }} >
            <polygon points='364,73 340,100 300,100' fill='#005a9c' />
        </svg>
        <div className='switch-prompt-interactive' style={{ pointerEvents }} onClick={() => setFirstTime(false)}>
            {`${tapOrClick()} player to make them go first.`}
        </div>

    </motion.div>;
};

export default SwitchPrompt;