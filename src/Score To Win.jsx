import { useAtom } from 'jotai';
import { a_points_to_win } from './atoms';

const ScoreToWin = () => {
    const [p2w] = useAtom(a_points_to_win);

    return <div className='points-to-win'>
        <span className='need-to-win'>NEED</span>
        <span className='gradient-gold gradient-text'>{p2w}</span>
        <span className='need-to-win'>TO WIN</span>
    </div>;
};

export default ScoreToWin;