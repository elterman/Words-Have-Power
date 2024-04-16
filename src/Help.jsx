/* eslint-disable max-len */
import _ from 'lodash';
import Example from './PNG/Example.png';
import { MAX_WORD_LENGTH, P2W_DEFAULT } from './const';
import { scrollClass, tapOrClick } from './utils';

const Help = () => {
    const items = [
        `Players take turns entering words of any length, up to ${MAX_WORD_LENGTH} letters.`,
        'For each letter that appears in the previous word, a player receives 1 unit of power.',
        'By default, a player loses 1 unit of power for each letter that does not appear in the previous word.',
        'The game begins with a randomly chosen 4-letter word.',
        <div className='help-ob'>Example:</div>,
        <img className='help-ob' style={{ margin: '-10px 0 5px 0' }} src={Example} alt='example' width={360} />,
        `The game ends when a player's battery reaches a set charge (${P2W_DEFAULT} units by default). If that player started the game, the other player takes one more turn.`,
        'The player with the higher battery charge wins.',
        'Optional: a word cannot start with the same sequence of up to 3 letters as the previous word.',
        'Optional: up to 3 randomly chosen letters on the keyboard can be "blacklisted" (made unplayable) on each turn.',
        'Words cannot be reused.',
        `To make a player go first, ${tapOrClick(true)} on their icon at the start of the game.`,
        `${tapOrClick()} on a word to look up its definition.`
    ];

    const HelpItem = (props) => {
        const { item } = props;
        const str = _.isString(item);

        return <div className='help-item'>
            {str && item.startsWith(' ') && <span className='bullet'>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
            {str && <div className='bullet'>●&nbsp;&nbsp;</div>}
            {item}
        </div>;
    };

    const classes = `help-content ${scrollClass()}`;

    return <div className='help'>
        <div className={classes}>{_.map(items, (item, i) => <HelpItem key={i} item={item} index={i} />)}</div>
    </div>;
};

export default Help;
