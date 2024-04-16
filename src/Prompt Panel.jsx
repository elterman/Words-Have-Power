import { motion } from 'framer-motion';
import _ from 'lodash';
import { X } from './const';
import { isOnMobile } from './utils';
import SvgX from './Svg X';

const PromptPanel = (props) => {
    const { labels, onClick, show, style, buttonStyle, pulse } = props;

    const Button = (props) => {
        const { label, index } = props;

        const width = label === X ? '48px' : 'unset';
        const transition = { repeat: Infinity, repeatType: 'reverse', ease: 'linear', duration: 0.25 };
        const classes = `prompt-button${isOnMobile() ? '-mobile' : ''}`;
        const cursor = show ? 'pointer' : 'initial';
        const pointerEvents = show ? 'initial' : 'none';

        return <motion.div className={classes} onClick={() => onClick(index + 1)}
            style={{ cursor, pointerEvents, width, ...buttonStyle }} initial={{ transform: 'scale(1)' }}
            animate={{ transform: `scale(${pulse ? 0.8 : 1})` }} transition={pulse ? transition : false}>
            <div>{label === X ? <SvgX width={48} /> : label}</div>
        </motion.div>;
    };

    return <motion.div className='prompt-panel' animate={{ opacity: show ? 1 : 0, transform: `scale(${show ? 1 : 0})` }}
        transition={{ type: 'spring', damping: 15 }} style={{ ...style }}>
        {_.map(labels, (label, i) => <Button key={i} label={label} index={i} />)}
    </motion.div>;
};

export default PromptPanel;