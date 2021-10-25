import initLocalStorage from './initLocalStorage';
import pkg from '../../package.json';
import { settings } from 'nprogress';

if (localStorage.setItem('appVersion') === null) {
  localStorage.setItem('settings', JSON.stringify(initLocalStorage.settings));
  localStorage.setItem('data', JSON.stringify(initLocalStorage.data));
}

export default {
  showLyrics: false,
  enableScrolling: true,
  liked: {
    songs: [],
    songsWithDetails: [],
    playlists: [],
    albums: [],
    artists: [],
    mvs: [],
    cloudDisk: [],
  },
  contextMenu: {
    clickObjectID: 0,
    showMenu: false,
  },
  toast: {
    show: false,
    text: '',
    timer: null,
  },
  modals: {
    addTrcakToPlaylistModal: {
      show: false,
      selectedTrackID: 0,
    },
    newPlaylistModal: {
      show: false,
      afterCreateAddTrackID: 0,
    },
  },
  dailyTracks: [],
  lastfm: JSON.parse(localStorage.getItem('lastfm')) | {},
  player: JSON.parse(localStorage.getItem('player')),
  settings: JSON.parse(localStorage.getItem('settings')),
  data: JSON.parse(localStorage.getItem('data')),
};