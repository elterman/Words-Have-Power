import { atom } from 'jotai';
import _ from 'lodash';
import { _10000 } from './Dictionary/10000';
import { _10 } from './Dictionary/_10';
import { _11 } from './Dictionary/_11';
import { _12 } from './Dictionary/_12';
import { _13 } from './Dictionary/_13';
import { _14 } from './Dictionary/_14';
import { _15 } from './Dictionary/_15';
import { _2 } from './Dictionary/_2';
import { _3 } from './Dictionary/_3';
import { _4 } from './Dictionary/_4';
import { _5 } from './Dictionary/_5';
import { _6 } from './Dictionary/_6';
import { _7 } from './Dictionary/_7';
import { _8 } from './Dictionary/_8';
import { _9 } from './Dictionary/_9';
import { ALPHABET, APP_STATE, GAME_PAGE, LIMITED, MODE_FRIEND, MODE_ROBOT, P2W_DEFAULT, START_PAGE, STATES } from './const';

export const a_mode = atom(MODE_ROBOT);
export const a_hiding_overlay = atom(false);
export const a_help_visible_base = atom(false);
export const a_settings_visible_base = atom(false);
export const a_error_base = atom(null);
export const a_restart = atom(false);
export const a_full_dict = atom(null);
export const a_small_dict = atom(null);
export const a_tile_feedback = atom(null);
export const a_input_base = atom('');
export const a_kb_scale = atom(1);
export const a_erasing = atom(false);
export const a_flip = atom(false);
export const a_animate_scores = atom([false, false]);
export const a_robo_entry = atom(null);

const a_app_state_base = atom({});

export const a_app_state = atom(
    get => {
        const state = get(a_app_state_base);
        return state;
    },

    (get, set, appState) => {
        set(a_app_state_base, appState);

        const json = JSON.stringify(appState, [...STATES, 'sounds', 'states', 'entries', 'word', 'gain', 'indexes', 'player', 'turn',
            'settings', 'points_to_win', 'penalty', 'unrepeat_count', 'blacklist_size', 'dict_size', 'blacklist', 'over']);

        localStorage.setItem(APP_STATE, json);
    }
);

export const a_states = atom(
    get => {
        const appState = get(a_app_state);
        return appState.states;
    },

    (get, set, states) => {
        const appState = get(a_app_state);
        appState.states = states;
        set(a_app_state, { ...appState });
    }
);

const a_state_key = atom(
    get => {
        const mode = get(a_mode);
        const key = mode === MODE_FRIEND ? 'F' : 'R';
        return key;
    }
);

export const a_state = atom(
    get => {
        const appState = get(a_app_state);
        const key = get(a_state_key);
        const state = _.get(appState?.states, key, {});
        return state;
    },

    (get, set, state) => {
        const appState = get(a_app_state);
        const key = get(a_state_key);
        _.set(appState.states, key, state);
        set(a_app_state, { ...appState });
    }
);

export const a_sounds = atom(
    get => {
        const on = get(a_app_state).sounds;
        return on === false ? false : true;
    },
    (get, set, sounds) => set(a_app_state, { ...get(a_app_state), sounds })
);

export const a_settings = atom(
    get => {
        const settings = get(a_state).settings;
        return settings || { penalty: true, points_to_win: P2W_DEFAULT, unrepeat_count: 3, blacklist_size: 2, dict_size: LIMITED };
    },
    (get, set, settings) => set(a_state, { ...get(a_state), settings })
);

export const a_penalty = atom(
    get => get(a_settings).penalty,
    (get, set, penalty) => set(a_settings, { ...get(a_settings), penalty })
);

export const a_points_to_win = atom(
    get => get(a_settings).points_to_win,
    (get, set, points_to_win) => set(a_settings, { ...get(a_settings), points_to_win })
);

export const a_unrepeat_count = atom(
    get => get(a_settings).unrepeat_count,
    (get, set, unrepeat_count) => set(a_settings, { ...get(a_settings), unrepeat_count })
);

export const a_blacklist_size = atom(
    get => get(a_settings).blacklist_size,
    (get, set, blacklist_size) => set(a_settings, { ...get(a_settings), blacklist_size })
);

export const a_dict_size = atom(
    get => get(a_settings).dict_size,
    (get, set, dict_size) => set(a_settings, { ...get(a_settings), dict_size })
);

export const a_blacklist = atom(
    get => {
        const state = get(a_state);
        return state.blacklist || Array(get(a_blacklist_size)).fill(null);
    },
    (get, set, blacklist) => {
        if (blacklist === true) {
            const count = get(a_blacklist_size);
            blacklist = _.sampleSize(ALPHABET, count);
        }

        set(a_state, { ...get(a_state), blacklist });
    }
);

export const a_entries = atom(
    get => get(a_state).entries || [],
    (get, set, entries) => {
        const state = get(a_state);
        set(a_state, { ...state, entries });
        set(a_blacklist, true);
    }
);

export const a_turn = atom(
    get => {
        const state = get(a_state);
        return state.turn || 1;
    },
    (get, set, turn) => set(a_state, { ...get(a_state), turn })
);

export const a_resume = atom(
    get => get(a_state).resume,
    (get, set, resume) => set(a_state, { ...get(a_state), resume })
);

export const a_over = atom(
    get => get(a_state).over || false,
    (get, set, over) => set(a_state, { ...get(a_state), over })
);

export const a_error = atom(
    get => get(a_error_base),
    (get, set, error) => {
        if (error) {
            set(a_tile_feedback, 'error');
        }

        set(a_error_base, error);
    }
);

export const a_input = atom(
    get => get(a_input_base),
    (get, set, input) => {
        if (input && input.length > get(a_input_base).length) {
            set(a_tile_feedback, 'type');
        }

        set(a_input_base, input);
    }
);

export const a_help_visible = atom(
    get => get(a_help_visible_base),

    (get, set, on) => {
        const overlay = get(a_overlay);

        if (!overlay) {
            set(a_help_visible_base, true);
        }
    }
);

export const a_settings_visible = atom(
    get => get(a_settings_visible_base),

    (get, set, on) => {
        const overlay = get(a_overlay);

        if (!overlay) {
            set(a_settings_visible_base, true);
        }
    }
);

export const a_overlay = atom(
    get => get(a_help_visible) || get(a_settings_visible),

    (get, set, _) => {
        set(a_help_visible_base, false);
        set(a_settings_visible_base, false);
    }
);

export const a_robo_move = atom(get => {
    if (get(a_mode) !== MODE_ROBOT) {
        return false;
    }

    const turn = get(a_state).turn || 1;    // do not use get(a_turn) here
    return turn === 2;
});

export const a_prompt_visible = atom(get => get(a_over) || get(a_restart) || get(a_resume));

export const a_init = atom(null,
    (get, set, force) => {
        set(a_input, '');
        set(a_robo_entry, null);
        set(a_animate_scores, [false, false]);
        set(a_restart, false);

        if (force || get(a_over) || get(a_entries).length === 0) {
            const dict = _.filter(_10000, w => w.length === 4);
            const word = _.sample(dict);
            set(a_entries, [{ word }]);
            set(a_turn, 1);
        }

        set(a_over, false);

        if (get(a_mode) === MODE_ROBOT && get(a_turn) === 2) {
            set(a_resume, true);
        }
    }
);

export const a_page_base = atom(START_PAGE);

export const a_page = atom(
    get => get(a_page_base),

    (get, set, page) => {
        set(a_page_base, page);

        if (page !== GAME_PAGE) {
            return;
        }

        const dict = [..._2, ..._3, ..._4, ..._5, ..._6, ..._7, ..._8, ..._9, ..._10, ..._11, ..._12, ..._13, ..._14, ..._15];
        set(a_full_dict, dict);
        set(a_small_dict, _10000);

        set(a_init);
    }
);
