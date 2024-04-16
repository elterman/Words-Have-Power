import { useAtom } from 'jotai';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import Charge1 from './PNG/Battery Charge Green.png';
import Charge2 from './PNG/Battery Charge Red.png';
import Battery from './PNG/Battery.png';
import { a_animate_scores, a_entries, a_points_to_win } from './atoms';
import { calcScore, defer } from './utils';

const Score = (props) => {
    const { player } = props;
    const [entries] = useAtom(a_entries);
    const [animateScores, setAnimateScores] = useAtom(a_animate_scores);
    const [p2w] = useAtom(a_points_to_win);

    const score = calcScore(entries, player);
    const prevEntries = _.slice(entries, 0, entries.length - 1);
    const prevScore = calcScore(prevEntries, player);
    const delta = entries.length > 1 ? (score - prevScore) / 100 : -0.25;

    const [currentScore, setCurrentScore] = useState(prevScore);

    useEffect(() => {
        if (animateScores[player - 1]) {
            const minmax = score < currentScore ? Math.max : score > currentScore ? Math.min : null;
            minmax && defer(() => setCurrentScore(minmax(score, currentScore + delta)), 1);
        } else {
            setCurrentScore(score);

            animateScores[player - 1] = true;
            setAnimateScores([...animateScores]);
        }
    }, [currentScore, delta, score, entries, animateScores, setAnimateScores, player]);

    const gridArea = player === 1 ? '1/2' : '1/4';
    const color = '#101010';

    const renderCharge = () => {
        let p = Math.round(currentScore);
        p = Math.max(0, Math.min(p, p2w));
        const charge = p / p2w * 76;

        return <img className='charge' src={player === 1 ? Charge1 : Charge2} alt='charge' width={charge} height={29} />;
    };

    const renderScore = () => {
        let p = Math.round(currentScore);

        return p < 0 ? <div className='negative-score'><span style={{ fontSize: '16px' }}>-</span>{Math.abs(p)}</div> : p;
    };

    const margin = player === 1 ? '0 0 -2px -2px' : '0 -2px -2px 0';

    return <div className='score-panel' style={{ gridArea }}>
        <div className='battery' style={{ transform: `scaleX(${player === 1 ? 1 : -1})` }}>
            <img src={Battery} alt='battery' width={90} height={33} style={{ gridArea: '1/1' }} />
            {renderCharge()}
        </div>
        <div className='score' style={{ color, margin }}>{renderScore()}</div>
    </div>;
};

export default Score;