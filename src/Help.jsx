import _ from 'lodash';
/* eslint-disable max-len */
import Example from './PNG/Example.png';
import { GOLD, BLUEISH, MAX_WORD_LENGTH, P2W_DEFAULT } from './const';
import { scrollClass, tapOrClick } from './utils';

const Help = () => {
    const items = [
        `Players take turns entering words of any length, up to ${MAX_WORD_LENGTH} letters.`,
        'For each letter that appears in the previous word, a player receives 1 unit of power.',
        'By default, a player loses 1 unit of power for each letter that does not appear in the previous word.',
        'The game begins with a randomly chosen 4-letter word.',
        <div className='help-ob'>Example:</div>,
        <img className='help-ob' style={{ margin: '-10px 0 5px 0' }} src={Example} alt='example' width={360} />,
        `The game ends when a player's battery reaches a set charge (${P2W_DEFAULT} units by default). •If that player started the game, the opponent takes one more turn.•`,
        `To make a player go first, ${tapOrClick(true)} on their icon at the start of the game.`,
        'The player with the higher battery charge wins.',
        <div className='help-ob' style={{ color: GOLD }}>Optional, but enabled by default:</div>,
        ' Two randomly chosen letters on the keyboard are "blacklisted" (made unplayable) on each turn.',
        ' A word cannot start with the same three letters as the previous word.',
        'Words cannot be reused.',
        `${tapOrClick()} on a word to look up its definition.`
    ];

    const HelpItem = (props) => {
        const { item } = props;
        const str = _.isString(item);

        const renderItem = () => {
            if (!str) {
                return item;
            }

            const runs = _.split(item, '•');

            return <span>{_.map(runs, (run, i) => <span key={i} style={{ color: `${i % 2 ? GOLD : BLUEISH}` }}>{run}</span>)}</span>;
        };

        return <div className='help-item'>
            {str && item.startsWith(' ') && <span className='bullet'>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
            {str && <div className='bullet'>●&nbsp;&nbsp;</div>}
            {renderItem()}
        </div>;
    };

    const classes = `help-content ${scrollClass()}`;

    return <div className='help'>
        <div className={classes}>{_.map(items, (item, i) => <HelpItem key={i} item={item} index={i} />)}</div>
    </div>;
};

export default Help;
