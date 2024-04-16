import { useAtom } from 'jotai';
import Back from './PNG/Back.png';
import Restart from './PNG/Restart.png';
import Settings from './PNG/Settings.png';
import ToolButton from './Tool Button';
import { a_entries, a_input, a_over, a_page, a_points_to_win, a_restart, a_robo_entry, a_settings_visible, a_sounds } from './atoms';
import { START_PAGE } from './const';
import { usePlaySound } from './usePlaySound';
import SoundOff from './PNG/Sound Off.png';
import SoundOn from './PNG/Sound On.png';

const Toolbar = (props) => {
    const { style } = props;
    const [, setPage] = useAtom(a_page);
    const [, showSettings] = useAtom(a_settings_visible);
    const [restart, setRestart] = useAtom(a_restart);
    const [p2w] = useAtom(a_points_to_win);
    const [entries] = useAtom(a_entries);
    const [over] = useAtom(a_over);
    const playSound = usePlaySound();
    const [roboEntry, setRoboEntry] = useAtom(a_robo_entry);
    const [, setInput] = useAtom(a_input);
    const [sounds, setSounds] = useAtom(a_sounds);

    const onBack = () => {
        setRoboEntry(null);
        setInput('');
        setPage(START_PAGE);
    };

    const onRestart = () => {
        playSound('oops');
        setRestart(true);
    };

    const onSettings = () => {
        showSettings(true);
    };

    const onSounds = () => {
        setSounds(!sounds);

        if (!sounds) {
            playSound('won', { force: true, rate: 4 });
        }
    };

    const size = 50;

    return <div className='toolbar' style={style}>
        <ToolButton onClick={onBack} src={Back} text='back' width={size} />
        <ToolButton onClick={onRestart} src={Restart} text='restart' width={size}
            disabled={restart || over || entries.length < 2 || roboEntry} />
        <div style={{ width: '120px' }}/>
        <ToolButton onClick={onSettings} src={Settings} text={p2w} width={size} disabled={roboEntry}
        />
        <ToolButton onClick={onSounds} src={sounds ? SoundOn : SoundOff} text='sounds' width={size} />
    </div>;

};

export default Toolbar;