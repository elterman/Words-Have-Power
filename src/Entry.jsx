import { useAtom } from 'jotai';
import _ from 'lodash';
import React from 'react';
import Tile from './Tile';
import { a_blacklist, a_entries, a_input, a_mode, a_penalty, a_turn, a_unrepeat_count } from './atoms';
import { BOARD_SIZE, MAX_WORD_LENGTH, RED } from './const';
import { calcGain, entryId, focusOnApp, playerColor, sameSeq } from './utils';

export const Entry = (props) => {
    const { row } = props;
    const [mode] = useAtom(a_mode);
    const [turn] = useAtom(a_turn);
    const [entries] = useAtom(a_entries);
    const [input] = useAtom(a_input);
    const [penalty] = useAtom(a_penalty);
    const [unrepeatCount] = useAtom(a_unrepeat_count);
    const [blacklist] = useAtom(a_blacklist);

    const inputRow = entries.length;
    const size = 21;
    const en = _.get(entries, row);

    const renderBackdrop = () => {
        const gridArea = `1/1/1/span ${MAX_WORD_LENGTH}`;

        if (row === inputRow) {
            return <div className='input-backdrop' style={{ gridArea, width: `${MAX_WORD_LENGTH * size}px` }} />;
        }

        const url = `https://www.google.com/search?q=define+${en.word}`;

        return <a className='define' style={{ gridArea }} href={url} target="_blank" rel="noopener noreferrer" tabIndex={-1}
            onClick={focusOnApp}>
        </a>;
    };

    const gridArea = `${row + 1}/1`;
    const width = BOARD_SIZE - 35 - size * MAX_WORD_LENGTH;
    const { gain = 0, indexes = [] } = en ? en : calcGain(_.last(entries)?.word, input, penalty);
    const pcolor = playerColor(en ? en.player : turn, mode);

    const renderGain = () => {
        const sign = gain > 0 ? '+' : '';
        return <div className='gain' style={{ width, color: pcolor }}>{`${sign}${en ? gain : (gain || (input.length ? 0 : ''))}`}</div>;
    };

    return <div id={entryId(row + 1)} className='entry' style={{ gridArea }}>
        {renderBackdrop()}
        {_.map(_.range(0, MAX_WORD_LENGTH), col => {
            let color = indexes.includes(col) ? pcolor : 'unset';

            if (!en && input.length) {
                if (col < unrepeatCount && sameSeq(input, _.last(entries).word, unrepeatCount)) {
                    color = RED;
                } else if (blacklist.includes(input[col])) {
                    color = RED;
                }
            }

            return <Tile key={col} row={row + 1} col={col + 1} size={size} style={{ color }} />;
        })}
        {row > 0 && renderGain()}
    </div>;
};
