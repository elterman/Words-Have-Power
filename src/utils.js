import _ from 'lodash';
import { COLOR_AI, COLOR_P1, COLOR_P2, MODE_ROBOT } from './const';

export const windowSize = () => {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

    return { x, y };
};

export const isOnMobile = () => typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;

export const defer = (fn, ms = 1) => _.delay(fn, ms);

export const scrollClass = () => `root-scroll ${isOnMobile() ? 'root-scroll-mobile' : ''}`;

export const tapOrClick = (lower = false) => {
    const verb = isOnMobile() ? 'Tap' : 'Click';
    return lower ? verb.toLowerCase() : verb;
};

export const focusOnApp = () => document.querySelector('.App')?.focus();

export const playerColor = (player, mode) => {
    return mode === MODE_ROBOT ? (player === 2 ? COLOR_AI : COLOR_P1) : player === 1 ? COLOR_P1 : COLOR_P2;
};

export const calcGain = (prevWord, word, penalty) => {
    const indexes = [];
    let gain = 0;

    _.each(word, (letter, i) => {
        if (prevWord.includes(letter)) {
            indexes.push(i);
            gain += 1;
        } else if (penalty) {
            gain -= 1;
        }
    });

    return { gain, indexes };
};

export const calcScore = (entries, player) => _.sumBy(entries, en => en.player === player ? en.gain : 0);

export const sameSeq = (word1, word2, count) => word1.slice(0, count) === word2.slice(0, count);

export const entryId = (row) => `entry-${row}`;

export const scrollToBottom = (entries) => {
    if (entries.length === 0) {
        return;
    }

    const eid = entryId(entries.length);

    defer(() => {
        const ob = document.querySelector(`#${eid}`);
        ob?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
};

export const clientRect = obid => {
    const ob = document.querySelector(`#${obid}`);
    const r = ob?.getBoundingClientRect();

    return r;
};
