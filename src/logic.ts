/* eslint-disable quotes */
import type { RuneClient } from "rune-games-sdk/multiplayer";

export interface GameState {
  players_ready: boolean;
  entries: any;
  blacklist: any;
  settings: any;
  start_player: number;
}

const INITIAL_STATE = {
  players_ready: false,
  entries: null,
  blacklist: null,
  settings: null,
  start_player: 1 ,
};

type GameActions = {
  init: (params: { noop: any }) => void;
  playersReady: (params: { ready: boolean }) => void;
  entryData: (params: { ed: any }) => void;
  settingsData: (params: { sd: any }) => void;
  playerStarts: (params: { player: number }) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

const init = (gs: GameState) => {
  gs.players_ready = false;
  gs.entries = null;
  gs.settings = null;
  gs.start_player = 1;
};

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 2,
  setup: (allPlayerIds): GameState => INITIAL_STATE,
  events: {
    playerJoined: (props) => {
      // noop
    },
    playerLeft: (props) => {
      // noop
    },
  },
  actions: {
    init: ({ noop }, { game: gs }) => init(gs),
    playersReady: ({ ready }, { game: gs }) => (gs.players_ready = ready),
    entryData: ({ ed }, { game: gs }) => {
      gs.entries = ed.entries;
      gs.blacklist = ed.blacklist;
    },
    settingsData: ({ sd }, { game: gs }) => {
      gs.settings = sd.settings;
      gs.blacklist = sd.blacklist;
    },
    playerStarts: ({ player }, { game: gs }) => {
      gs.start_player = player;
    },
  },
});

export const RA_INIT = "init";
export const RA_PLAYERS_READY = "playersReady";
export const RA_ENTRY_DATA = "entryData";
export const RA_SETTINGS_DATA = "settingsData";
export const RA_PLAYER_STARTS = "playerStarts";
