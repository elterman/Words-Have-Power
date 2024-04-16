import { useAtom } from 'jotai';
import _ from 'lodash';
// eslint-disable-next-line max-len
import { RUNE_KEY, a_alert, a_app_state, a_flip, a_page, a_rune_action, a_rune_game_page, a_rune_game_state, a_rune_my_player, a_rune_opp_left, a_rune_state } from './atoms';
import { ALERT_OPP_CHANGED_SETTINGS, ALERT_OPP_LEFT, ALERT_OPP_RESTARTED, START_PAGE } from './const';
import { RA_INIT, RA_PLAYERS_READY } from './logic';
import useCheckOver from './useCheckOver';
import usePlaySound from './usePlaySound';
import { defer, scrollToBottom } from './utils';

const useRune = () => {
    const [, setMyPlayer] = useAtom(a_rune_my_player);
    const [, runeAction] = useAtom(a_rune_action);
    const [, setRuneGameState] = useAtom(a_rune_game_state);
    const [, setPage] = useAtom(a_page);
    const [appState, setAppState] = useAtom(a_app_state);
    const [, setAlert] = useAtom(a_alert);
    const [oppLeft] = useAtom(a_rune_opp_left);
    const [runeState, setRuneState] = useAtom(a_rune_state);
    const [, setFlip] = useAtom(a_flip);
    const { checkOver } = useCheckOver();
    const [runeGamePage] = useAtom(a_rune_game_page);
    const playSound = usePlaySound();

    const onChange = (props) => {
        const { game: gs, players, yourPlayerId } = props;
        const ids = _.keys(players);

        if (ids.length < 2) {
            const init = () => {
                if (appState.states[RUNE_KEY]) {
                    delete appState.states[RUNE_KEY];
                    setAppState({ ...appState });
                }

                if (gs.players_ready && yourPlayerId) {
                    defer(() => runeAction([RA_INIT, {}]));
                }
            };

            if (runeGamePage) {
                setAlert({ alert: ALERT_OPP_LEFT });

                defer(() => {
                    init();
                    setPage(START_PAGE);
                }, 2000);
            } else {
                init();
            }
        } else {
            oppLeft && setAlert({ alert: null });

            yourPlayerId && defer(() => {
                if (!gs.players_ready) {
                    runeAction([RA_PLAYERS_READY, { ready: true }]);
                }
            }, 2000);
        }

        const player = _.indexOf(ids, yourPlayerId) + 1;
        setMyPlayer(player);

        setRuneGameState(gs);

        const rs = { ...runeState };

        const update = () => {
            gs.entries && (rs.entries = gs.entries);
            gs.blacklist && (rs.blacklist = gs.blacklist);

            if (gs.settings) {
                if (!_.isEqual(gs.settings, rs.settings)) {
                    setAlert({ alert: ALERT_OPP_CHANGED_SETTINGS });
                }

                rs.settings = gs.settings;
            }

            if (gs.entries?.length > 1) {
                const p = _.last(gs.entries)?.player;

                if (p) {
                    rs.turn = 3 - p;
                }
            } else if (gs.start_player !== rs.turn) {
                runeGamePage && playSound('oops', { rate: 2 });
                rs.turn = gs.start_player;
            }

            setRuneState(rs);
        };

        if (runeGamePage && rs.entries?.length > 1 && gs.entries?.length === 1) {
            setFlip(true);
            defer(update, 700);
            setAlert({ alert: ALERT_OPP_RESTARTED });
        } else {
            if (runeGamePage && gs.entries?.length > rs.entries?.length) {
                const en = _.last(gs.entries);
                playSound(en.player === 1 ? 'score1' : 'score2');
            }

            update();

            if (runeGamePage && gs.entries?.length > 1) {
                scrollToBottom(gs.entries);
                checkOver(gs.entries);
            }
        }

    };

    return { onChange };
};

export default useRune;