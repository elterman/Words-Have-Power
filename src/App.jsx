import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import Overlay from './Overlay';
import BMG from './PNG/BMG.png';
import Pattern from './PNG/Pattern.png';
import StartPage from './Start Page';
import { a_app_state, a_kb_scale, a_overlay, a_page, a_tile_feedback } from './atoms';
import { APP_STATE, BOARD_SIZE, GAME_PAGE, PAGE_HEIGHT, PAGE_WIDTH, START_PAGE } from './const';
import { defer, focusOnApp, isOnMobile, windowSize } from './utils';
import GamePage from './Game Page';
import { useSwitchPlayer } from './useSwitchPlayer';
import useKeyboard from './useKeyboard';
import Preloader from './Preloader';

const App = () => {
    const _this = useRef(null);
    const [scale, setScale] = useState(null);
    const [, setKeyboardScale] = useAtom(a_kb_scale);
    const [starting, setStarting] = useState(true);
    const [splash, setSplash] = useState(true);
    const [page] = useAtom(a_page);
    const [, setAppState] = useAtom(a_app_state);
    const [splashBackground, setSplashBackground] = useState('#8A0000');
    const [overlay] = useAtom(a_overlay);
    const [tileFeedback] = useAtom(a_tile_feedback);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const { canSwitchPlayer, switchPlayer } = useSwitchPlayer();
    const { processKey } = useKeyboard();

    useEffect(() => {
        const disable = (e) => e.preventDefault();
        window.addEventListener('contextmenu', disable);
        return () => window.removeEventListener('contextmenu', disable);
    }, [_this]);

    useEffect(() => {
        const onResize = () => {
            const { x: wx, y: wy } = windowSize();
            const ratio = PAGE_HEIGHT / PAGE_WIDTH;
            let pred = null;

            if (wx < PAGE_WIDTH) {
                const height = wx * ratio;
                pred = () => wy > height;
            } else if (wy < PAGE_HEIGHT) {
                const width = wy / ratio;
                pred = () => wx < width;
            }

            if (pred) {
                const _scale = pred() ? wx / PAGE_WIDTH : wy / PAGE_HEIGHT;
                setScale(_scale);

                const kw = BOARD_SIZE * _scale;
                const margins = 40;
                const w = Math.min(BOARD_SIZE, wx - margins);

                if (kw < w) {
                    setKeyboardScale(Math.min(1.3, w / kw));
                }
            }

            const bi = `radial-gradient(transparent, black ${wx < 500 ? 120 : 100}%), url(${Pattern})`;
            setBackgroundImage(bi);
        };

        if (!scale) {
            onResize();
        }

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, [scale, setKeyboardScale]);

    useEffect(() => { page === GAME_PAGE && defer(focusOnApp); }, [page]);

    const onKeyDown = (e) => {
        if (page !== GAME_PAGE || overlay || tileFeedback === 'error') {
            return;
        }

        if (e.altKey) {
            return;
        }

        if ((e.key === '1' || e.key === '2') && canSwitchPlayer(+e.key)) {
            switchPlayer();
            return;
        }

        const ch = e.key.toUpperCase();
        processKey(ch);
    };

    const { x: wx, y: wy } = windowSize();

    if (starting) {
        const loadAppState = () => {
            let json = localStorage.getItem(APP_STATE);
            let appState = JSON.parse(json);

            if (appState) {
                return appState;
            }

            return { sounds: true, states: {} };
        };

        _.delay(() => {
            const appState = loadAppState();
            setAppState(appState);

            setStarting(false);
            _.delay(() => setSplash(false), 300);
        }, 2000);
    }

    const onClick = () => {
        localStorage.clear();
        setSplashBackground('#500000');
    };

    const renderContent = () => {
        let background = '#0000';

        if (!splash && !isOnMobile()) {
            background = '#00000040';
        }

        const transform = `scale(${scale})`;
        const pointerEvents = splash ? 'none' : 'all';

        return <motion.div className='content' animate={{ opacity: splash ? 0 : 1 }}
            style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, transform, background, pointerEvents }}>
            {!starting && page === START_PAGE && <StartPage />}
            {!starting && page === GAME_PAGE && <GamePage />}
            {overlay && <Overlay />}
        </motion.div>;
    };

    const width = Math.min(300, Math.min(wx, wy) * 0.6);
    const splashBgImg = `radial-gradient(transparent, black ${100}%)`;
    const overlayBgImg = `radial-gradient(#00000080, black 100%), url(${Pattern})`;

    return (
        <div ref={_this} className="App" style={{ backgroundImage: overlay ? overlayBgImg : backgroundImage }}
            tabIndex={-1} onKeyDown={onKeyDown}>
            {splash && <motion.div className="splash"
                animate={{ background: splashBackground, backgroundImage: splashBgImg, opacity: starting ? 1 : 0 }}
                onClick={onClick}><img src={BMG} alt="BMG" width={width} /></motion.div>}
            {renderContent()}
            {starting && <Preloader />}
        </div>
    );
};

export default App;
