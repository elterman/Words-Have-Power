import Player from './Player';
import Score from './Score';
import ScoreToWin from './Score To Win';

const PlayerPanel = () => {
    return <div className="player-panel">
        <Player player={1} />
        <Score player={1} />
        <ScoreToWin/>
        <Score player={2} />
        <Player player={2} />
    </div>;
};

export default PlayerPanel;