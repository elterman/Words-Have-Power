import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import _ from 'lodash';
import ToolButton from './Tool Button';
import { a_blacklist, a_penalty, a_points_to_win, a_unrepeat_count, a_dict_size, a_robo_move, a_entries, a_blacklist_size } from './atoms';
import { ALPHABET, FULL, LIMITED, P2W } from './const';

const Settings = () => {
    const [p2w, setP2W] = useAtom(a_points_to_win);
    const [penalty, setPenalty] = useAtom(a_penalty);
    const [unrepeatCount, setUnrepeatCount] = useAtom(a_unrepeat_count);
    const [blacklistSize, setBlacklistSize] = useAtom(a_blacklist_size);
    const [, setBlacklist] = useAtom(a_blacklist);
    const [dictSize, setDictSize] = useAtom(a_dict_size);
    const [roboMove] = useAtom(a_robo_move);
    const [entries] = useAtom(a_entries);

    const onSetBlacklist = (count) => {
        setBlacklistSize(count);
        const blist = _.sampleSize(ALPHABET, count);
        setBlacklist(blist);
    };

    const readOnly = roboMove || entries.length > 1;

    const renderReadOnly = () => {
        const msg = 'Changes alllowed at the start of the game only.';
        return <motion.div className='ro-settings' initial={{ transform: 'scale(0)' }} animate={{ transform: 'scale(1)' }}
            transition={{ type: 'spring', damping: 15, delay: 0.5 }}>{msg}</motion.div>;
    };

    const style = on => ({ opacity: on ? 1 : 0.5, pointerEvents: on ? 'none' : 'all' });
    const gradGold = 'gradient-gold gradient-text';

    return <>
        <div className="settings">
            <span className='settings-headers'>units of power needed to win</span>
            <div className='sub-settings'>
                {_.map(P2W, p => <ToolButton key={p} text={p} grayscale={p !== p2w} classes={p === p2w ? gradGold : ''}
                    style={{ ...style(p === p2w) }} onClick={() => setP2W(p)} />)}
            </div>
            <div className='settings-divider' />
            <span className='settings-headers'>penalty for introducing new letters</span>
            <div className='sub-settings'>
                {_.map([true, false], p => <ToolButton key={p} text={p ? 'yes' : 'no'} grayscale={p !== penalty}
                    classes={p === penalty ? gradGold : ''}
                    style={{ ...style(p === penalty) }} onClick={() => setPenalty(p)} />)}
            </div>

            <div className='settings-divider' />
            <span className='settings-headers'>number of letters in the initial se-quence that must be different in the previous word</span>
            <div className='sub-settings'>
                {_.map([0, 1, 2, 3], count => <ToolButton key={count} text={count} grayscale={count !== unrepeatCount}
                    classes={count === unrepeatCount ? gradGold : ''}
                    style={{ ...style(count === unrepeatCount) }} onClick={() => setUnrepeatCount(count)} />)}
            </div>

            <div className='settings-divider' />
            <span className='settings-headers'>number of keys to blacklist</span>
            <div className='sub-settings'>
                {_.map([0, 1, 2, 3], count => <ToolButton key={count} text={count} grayscale={count !== blacklistSize}
                    classes={count === blacklistSize ? gradGold : ''}
                    style={{ ...style(count === blacklistSize) }} onClick={() => onSetBlacklist(count)} />)}
            </div>
            {false && <>
                <div className='settings-divider' />
                <span className='settings-headers'>AI's dictionary</span>
                <div className='sub-settings'>
                    {_.map([LIMITED, FULL], size => <ToolButton key={size} text={size} grayscale={size === dictSize ? 0 : 1}
                        classes={size === dictSize ? gradGold : ''}
                        style={{ ...style(size === dictSize) }} onClick={() => setDictSize(size)} />)}
                </div>
            </>}
        </div>
        {readOnly && renderReadOnly()}
    </>;
};

export default Settings;