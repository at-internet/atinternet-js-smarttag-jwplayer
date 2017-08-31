/**
 * @preserve This SDK is licensed under the MIT license (MIT)
 * Copyright (c) 2015- Applied Technologies Internet SAS (registration number B 403 261 258 - Trade and Companies Register of Bordeaux – France)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */

/**
 * Global Namespace for JW Player players
 * @class
 * @name JWPlayer
 * @public
 * @memberOf ATInternet
 */
ATInternet.JWPlayer = ATInternet.JWPlayer || {};

/**
 * List of player objects added to manage Rich Media
 * @array
 * @name PlayerObjectList
 * @public
 * @memberOf ATInternet.JWPlayer
 */
ATInternet.JWPlayer.PlayerObjectList = [];

/**
 * Delete list of player objects
 * @function
 * @name deletePlayerList
 * @public
 * @memberOf ATInternet.JWPlayer
 */
ATInternet.JWPlayer.deletePlayerList = function () {
    for (var i = 0; i < ATInternet.JWPlayer.PlayerObjectList.length; i++) {
        delete ATInternet.JWPlayer.PlayerObjectList[i];
    }
    ATInternet.JWPlayer.PlayerObjectList = [];
};

/**
 * @class
 * @classdesc Plugin used to manage Rich Media measurement on JWPlayer players
 * @name JWPlayer
 * @memberOf ATInternet.Tracker.Plugins
 * @type {function}
 * @param parent {object} Instance of the Tag used
 * @public
 */
ATInternet.Tracker.Plugins.JWPlayer = function (parent) {

    var JW = {
        PlayerState: {
            IDLE: 0,
            PLAYING: 1,
            PAUSED: 2,
            BUFFERING: 3
        }
    };

    /**
     * Initialize player properties on state change event
     * @memberOf ATInternet.Tracker.Plugins.JWPlayer#
     * @function
     * @name _initPlayerProperties
     * @param player {object} player object
     * @param newState {string} new state
     * @private
     */
    var _initPlayerProperties = function (player, newState) {
        // We get the media index with 'getPlaylistIndex' method from JWPlayer API
        player.oldIndex = player.newIndex;
        var playList = player.getPlaylist();
        if (playList !== null) {
            player.newIndex = player.getPlaylistIndex();
        }
        else {
            player.newIndex = 0;
        }
        player.oldState = player.newState;
        player.newState = JW.PlayerState[newState.toString().toUpperCase()];
        player.currentIndex = player.newIndex;
    };

    /**
     * Main object
     * @memberOf ATInternet.Tracker.Plugins.JWPlayer#
     * @object
     * @name JWPlayer
     * @public
     */
    parent.jwPlayer = {};

    /**
     * Initialize process
     * @memberOf ATInternet.Tracker.Plugins.JWPlayer#
     * @function
     * @name init
     * @param player {object} player object
     * @public
     */
    parent.jwPlayer.init = function (player) {
        if (player) {
            ATInternet.JWPlayer.PlayerObjectList.push(new PlayerObject(player));
        }
    };

    /**
     * Create utility object to manage Rich Media functionality
     * @memberOf ATInternet.Tracker.Plugins.JWPlayer#
     * @class
     * @name PlayerObject
     * @param player {object} player object
     * @private
     */
    var PlayerObject = function (player) {
        if (player.mediaList) {
            var _this = this;
            _this.player = player;
            _this.player.currentIndex = 0;
            _this.player.oldIndex = 0;
            _this.player.newIndex = 0;
            _this.player.oldState = JW.PlayerState.IDLE;
            _this.player.newState = JW.PlayerState.IDLE;
            _this.player.action = null;
            _this.player.currentMedia = null;
            _this.player.isBuffering = false;
            // Create Rich Media Tags in order to send hit
            _this.player.hit = function () {
                var _player = this;
                if (_player.currentMedia === null) {
                    var playList = _player.getPlaylist();
                    if (playList !== null) {
                        var mediaId = _player.currentIndex;
                        for (var i = 0; i < _player.mediaList.length; i++) {
                            if (mediaId === _player.mediaList[i].id) {
                                _player.currentMedia = _player.mediaList[i];
                                break;
                            }
                        }
                    }
                    else {
                        _player.currentMedia = _player.mediaList[0];
                    }
                }
                // Rich Media Tags
                if (_player.currentMedia !== null) {
                    parent.richMedia.add(_player.currentMedia);
                    parent.richMedia.send({
                        'action': _player.action,
                        'playerId': _player.currentMedia.playerId,
                        'mediaLabel': _player.currentMedia.mediaLabel,
                        'isBuffering': _player.isBuffering
                    });
                    _player.currentMedia = null;
                }
                _player.isBuffering = false;
            };
            _this.addListeners();
        }
    };

    /**
     * Manage current playback states
     * @memberOf ATInternet.Tracker.Plugins.JWPlayer#
     * @function
     * @name addListeners
     * @private
     */
    PlayerObject.prototype.addListeners = function () {
        var _this = this;
        var _fire = function (event) {
            _this.fire(event);
        };
        _this.player.on('idle', function (state) {
            _fire(state.newstate);
        });
        _this.player.on('pause', function (state) {
            _fire(state.newstate);
        });
        _this.player.on('play', function (state) {
            _fire(state.newstate);
        });
        _this.player.on('buffer', function (state) {
            _fire(state.newstate);
        });
    };

    /**
     * Define Rich Media action on player state change
     * @memberOf ATInternet.Tracker.Plugins.JWPlayer#
     * @function
     * @name fire
     * @param newState {string} new state
     * @private
     */
    PlayerObject.prototype.fire = function (newState) {

        var _player = this.player;
        var _hit = false;

        _initPlayerProperties(_player, newState);

        switch (_player.oldState + '.' + _player.newState) {
            case JW.PlayerState.IDLE + '.' + JW.PlayerState.BUFFERING:
            case JW.PlayerState.PAUSED + '.' + JW.PlayerState.BUFFERING:
                _player.action = 'play';
                _player.isBuffering = true;
                _hit = true;
                break;
            case JW.PlayerState.IDLE + '.' + JW.PlayerState.PLAYING:
            case JW.PlayerState.PAUSED + '.' + JW.PlayerState.PLAYING:
                _player.action = 'play';
                _hit = true;
                break;
            case JW.PlayerState.BUFFERING + '.' + JW.PlayerState.PLAYING:
                _player.action = 'info';
                _hit = true;
                break;
            case JW.PlayerState.PLAYING + '.' + JW.PlayerState.BUFFERING:
                _player.action = 'info';
                _player.isBuffering = true;
                _hit = true;
                break;
            case JW.PlayerState.PLAYING + '.' + JW.PlayerState.PAUSED:
            case JW.PlayerState.BUFFERING + '.' + JW.PlayerState.PAUSED:
                _player.action = 'pause';
                _hit = true;
                break;
            case JW.PlayerState.PLAYING + '.' + JW.PlayerState.IDLE:
            case JW.PlayerState.PAUSED + '.' + JW.PlayerState.IDLE:
            case JW.PlayerState.BUFFERING + '.' + JW.PlayerState.IDLE:
                _player.action = 'stop';
                _hit = true;
                break;
        }

        // We send hit
        if (_hit) {
            _player.hit();
        }
    };
    /* @if test */
    var _this = this;
    _this._initPlayerProperties = _initPlayerProperties;
    _this.PlayerObject = PlayerObject;
    /* @endif */
};
ATInternet.Tracker.addPlugin('JWPlayer');