import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import Help from './Help';
import Back from './PNG/Back.png';
import Mail from './PNG/Mail.png';
import Settings from './Settings';
import ToolButton from './Tool Button';
import { a_help_visible, a_hiding_overlay, a_overlay, a_settings_visible } from './atoms';
import { PAGE_HEIGHT, PAGE_WIDTH } from './const';
import { useForceUpdate } from './useForceUpdate';

const Overlay = () => {
    const forceUpdate = useForceUpdate(true);
    const [, hideOverlay] = useAtom(a_overlay);
    const [help] = useAtom(a_help_visible);
    const [settingsVisible] = useAtom(a_settings_visible);
    const [hidingOverlay, setHidingOverlay] = useAtom(a_hiding_overlay);

    useEffect(() => {
        window.addEventListener('resize', forceUpdate);
        return () => window.removeEventListener('resize', forceUpdate);
    }, [forceUpdate]);

    const hide = useCallback(() => {
        setHidingOverlay(true);

        _.delay(() => {
            hideOverlay();
            setHidingOverlay(false);
        }, 300);
    }, [hideOverlay, setHidingOverlay]);

    const size = 50;

    return <motion.div className='overlay' style={{ width: `${PAGE_WIDTH}px`, height: `${PAGE_HEIGHT}px` }}
        animate={{ opacity: hidingOverlay ? 0 : 1 }}>
        {help && <Help />}
        {settingsVisible && <Settings />}
        <div className='toolbar' style={{ gridArea: '2/1', height: '80px' }}>
            <ToolButton onClick={hide} src={Back} alt='back' width={size} />
            {help && <a href="mailto:bmgomg@gmail.com?subject=Words Have Power" target="_blank" rel="noopener noreferrer" tabIndex={-1}>
                <ToolButton src={Mail} alt='mail' width={size} /></a>}
        </div>
    </motion.div>;
};

export default Overlay;