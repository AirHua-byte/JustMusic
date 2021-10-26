import { getTrackDetail,scrobble, getMP3 } from '@/api/track';
import { shuffle } from 'lodash';
import { Howler, Howl } from 'howler';
import { cacheTrackSource, getTrackSource } from '@/utils/db';
import { getAlbum } from '@/api/album';
import { getPlaylistDetail } from '@/api/playlist';
import { getArtist } from '@/api/artist';
import { personalFM, fmTrash } from '@/api/onthers';
import store from '@/store';
import { isAccountLoggedIn } from '@/utils/auth';
import { trackUpdateNowPlaying, trackScrobble } from '@/api/lastfm';

export default class {
  constructor() {
    // 播放器状态
    this._playing = false; // 是否正在播放
    this._progress = 0; // 当前播放歌曲进度
    this._enabled = false; // 是否启用Player
    this._repeatMode = 'off'; // off | on | one
    this._shuffle = false; // true | false
    this._volume = 1; // 0-1
    this._volumeBeforeMuted = 1; // 用于保存静音前的音量

    // 播放信息
    this._list = []; // 播放列表
    this._current = 0; // 当前播放歌曲在播放列表里面的index
    this._shuffledList = []; // 被随机打乱的播放列表
    this._shuffledCurrent = 0; // 当前播放歌曲在随机列表里面的index
    this._playlistSource = { type: 'album', id: 123 }; // 当前播放列表的信息
    this._currentTrack = { id: 86827685 }; // 当前播放歌曲的详情信息
    this._playNextList = []; // 当这个list不为空，优先播放这个list的歌
    this._isPersonalFM = false; // 是否是私人FM模式
    this._personalFMTrack = { id: 0 }; // 私人FM当前歌曲
    this._personalFMNextTrack = { id: 0 }; // 私人FM下一首

    this._howler = null;
    Object.defineProperty(this, '_howler', {
      enumerable: false,
    });

    this._init();

    window.yesplaymusic = {};
    window.yesplaymusic.player = this;
  }

  get repeatMode() {
    return this._repeatMode;
  }
  set repeatMode(mode) {
    if (this._isPersonalFM) return;
    if (!['off', 'on', 'one'].includes(mode)) {
      console.warn("repeatMode: invalid args, must be 'on' | 'off' | 'one'");
      return;
    }
    this._repeatMode = mode;
  }
  get shuffle() {
    return this._shuffle;
  }
  set shuffle(shuffle) {
    if (this._isPersonalFM) return;
    if (shuffle !== true && shuffle !== false) {
      console.warn('shuffle: invalid args, must be Boolean');
      return;
    }
    this._shuffle = shuffle;
    if (shuffle) {
      this._shuffleTheList();
    }
  }
  get volume() {
    return this._volume;
  }
  set volume(volume) {
    this._volume = volume;
    Howler.volume(volume);
  }
  get list() {
    return this.shuffle ? this._shuffledList : this._list;
  }
  set list(list) {
    this._list = list;
  }
  get current() {
    return this.shuffle ? this._shuffledCurrent : this._current;
  }
  set current(current) {
    if (this.shuffle) {
      this._shuffledCurrent = current;
    } else {
      this._current = current;
    }
  }
  get enabled() {
    return this._enabled;
  }
  get playing() {
    return this._playing;
  }
  get currentTrack() {
    return this._currentTrack;
  }
  get playlistSource() {
    return this._playlistSource;
  }
  get playNextList() {
    return this._playNextList;
  }
  get isPersonalFM() {
    return this._personalFMTrack;
  }
  get personalFMTrack() {
    return this._personalFMTrack;
  }
  get currentTrackDuration() {
    const trackDuration = this._currentTrack.dt || 1000;
    let duration = ~~(trackDuration / 1000);
    return duration > 1 ? duration - 1 : duration; // ?
  }
  get progress() {
    return this._progress;
  }
  set progress(value) {
    if (this._howler) {
      this._howler.seek(value);
    }
  }
  get isCurrentTrackLiked() {
    return store.state.liked.songs.includes(this._currentTrack.id);
  }
}