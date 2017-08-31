describe('[plugin] players JW Player :', function () {
    var tag, plugin;
    var JWPlayer = ATInternet.Tracker.Plugins.JWPlayer;
    var media = {
        'id': 0,
        'mediaType': 'video',
        'playerId': 1,
        'mediaLevel2': '2',
        'mediaLabel': 'Andrea',
        'previousMedia': '',
        'refreshDuration': 5,
        'duration': 73,
        'isEmbedded': true,
        'broadcastMode': 'clip',
        'webdomain': ''
    };
    beforeEach(function () {
        tag = new Tag();
        plugin = new JWPlayer(tag);
    });
    describe('Namespaces, objects, methods and properties : ', function () {
        it('Should create a JWPlayer namespace on ATInternet', function () {
            expect(ATInternet.JWPlayer).to.exist;
        });
        it('Should create a PlayerObjectList array on JWPlayer namespace', function () {
            expect(ATInternet.JWPlayer.PlayerObjectList).to.exist;
        });
        it('Should contain a function "deletePlayerList"', function () {
            expect(ATInternet.JWPlayer).to.have.property('deletePlayerList')
                .that.is.a('function');
        });
        it('Should contain a main JWPlayer object', function () {
            expect(tag.jwPlayer).to.be.an('object');
        });
        it('Should contain a function "init"', function () {
            expect(tag.jwPlayer).to.have.property('init')
                .that.is.a('function');
        });
        it('Should contain a function "PlayerObject"', function () {
            expect(plugin).to.have.property('PlayerObject')
                .that.is.a('function');
        });
        it('Should contain a prototype function "addListeners"', function () {
            expect(plugin.PlayerObject.prototype).to.have.property('addListeners')
                .that.is.a('function');
        });
        it('Should contain a prototype function "fire"', function () {
            expect(plugin.PlayerObject.prototype).to.have.property('fire')
                .that.is.a('function');
        });
        it('Should contain a function "_initPlayerProperties"', function () {
            expect(plugin).to.have.property('_initPlayerProperties')
                .that.is.a('function');
        });
    });
    describe('Execution :', function () {
        describe('init :', function () {
            it('Should not add a null object in the player list', function () {
                ATInternet.JWPlayer.deletePlayerList();
                tag.jwPlayer.init(null);
                expect(ATInternet.JWPlayer.PlayerObjectList).to.be.empty;
            });
            it('Should add an empty object in the player list', function () {
                ATInternet.JWPlayer.deletePlayerList();
                tag.jwPlayer.init({});
                expect(ATInternet.JWPlayer.PlayerObjectList).to.have.length(1);
            });
        });
        it('Should add media properties if player (with id property) with mediaList is added', function () {
            ATInternet.JWPlayer.deletePlayerList();
            tag.jwPlayer.init({
                mediaList: [],
                id: 'playerId',
                // Simulate JWPlayer API
                on: function () {
                    return null;
                },
                // Simulate JWPlayer API
                getPlaylist: function () {
                    return null;
                },
                getPlaylistIndex: function () {
                    return 0;
                }
            });
            expect(ATInternet.JWPlayer.PlayerObjectList[0]).to.have.deep.property('player')
                .that.is.an('object');
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('mediaList')
                .that.is.an('array')
                .that.is.empty;
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('currentIndex', 0);
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('oldIndex', 0);
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('newIndex', 0);
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('oldState', JW.PlayerState.IDLE);
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('newState', JW.PlayerState.IDLE);
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', null);
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('currentMedia', null);
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('isBuffering', false);
            expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('hit')
                .that.is.a('function');
            expect(ATInternet.JWPlayer.PlayerObjectList[0]).to.have.deep.property('addListeners')
                .that.is.a('function');
        });
        describe('Should execute addListeners, fire and hit methods with a valid player object :', function () {
            it('Should send a "play" action with buffering', function () {
                ATInternet.JWPlayer.deletePlayerList();
                tag.jwPlayer.init({
                    mediaList: [media],
                    on: function () {
                        return null;
                    },
                    getPlaylist: function () {
                        return null;
                    },
                    getPlaylistIndex: function () {
                        return 0;
                    }
                });
                // Change player state in order to send a 'play' action with buffering
                // case JW.PlayerState.IDLE + '.' + JW.PlayerState.BUFFERING:
                ATInternet.JWPlayer.PlayerObjectList[0].fire('idle');
                ATInternet.JWPlayer.PlayerObjectList[0].fire('buffering');
                expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'play',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': true
                });
                // case JW.PlayerState.PAUSED + '.' + JW.PlayerState.BUFFERING:
                ATInternet.JWPlayer.PlayerObjectList[0].fire('paused');
                ATInternet.JWPlayer.PlayerObjectList[0].fire('buffering');
                expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                expect(tag.addObject).to.deep.equal(media);
                expect(tag.sendObject).to.deep.equal({
                    'action': 'play',
                    'playerId': 1,
                    'mediaLabel': 'Andrea',
                    'isBuffering': true
                });
            });
            it('Should send a "play" action', function () {
                it('Should send a "play" action', function () {
                    ATInternet.JWPlayer.deletePlayerList();
                    tag.jwPlayer.init({
                        mediaList: [media],
                        on: function () {
                            return null;
                        },
                        getPlaylist: function () {
                            return null;
                        },
                        getPlaylistIndex: function () {
                            return 0;
                        }
                    });
                    // Change player state in order to send a 'play' action
                    // case JW.PlayerState.UNSTARTED + '.' + JW.PlayerState.PLAYING:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('idle');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('playing');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                    expect(tag.addObject).to.deep.equal(media);
                    expect(tag.sendObject).to.deep.equal({
                        'action': 'play',
                        'playerId': 1,
                        'mediaLabel': 'Andrea',
                        'isBuffering': false
                    });
                    // case JW.PlayerState.PAUSED + '.' + JW.PlayerState.PLAYING:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('paused');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('playing');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                    expect(tag.addObject).to.deep.equal(media);
                    expect(tag.sendObject).to.deep.equal({
                        'action': 'play',
                        'playerId': 1,
                        'mediaLabel': 'Andrea',
                        'isBuffering': false
                    });
                });
                it('Should send an "info" action', function () {
                    ATInternet.JWPlayer.deletePlayerList();
                    tag.jwPlayer.init({
                        mediaList: [media],
                        on: function () {
                            return null;
                        },
                        getPlaylist: function () {
                            return null;
                        },
                        getPlaylistIndex: function () {
                            return 0;
                        }
                    });
                    // Change player state in order to send an 'info' action
                    // case JW.PlayerState.BUFFERING + '.' + JW.PlayerState.PLAYING:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('buffering');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('playing');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'info');
                    expect(tag.addObject).to.deep.equal(media);
                    expect(tag.sendObject).to.deep.equal({
                        'action': 'info',
                        'playerId': 1,
                        'mediaLabel': 'Andrea',
                        'isBuffering': false
                    });
                });
                it('Should send an "info" action with buffering', function () {
                    ATInternet.JWPlayer.deletePlayerList();
                    tag.jwPlayer.init({
                        mediaList: [media],
                        on: function () {
                            return null;
                        },
                        getPlaylist: function () {
                            return null;
                        },
                        getPlaylistIndex: function () {
                            return 0;
                        }
                    });
                    // Change player state in order to send an 'info' action with buffering
                    // case JW.PlayerState.PLAYING + '.' + JW.PlayerState.BUFFERING:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('playing');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('buffering');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'info');
                    expect(tag.addObject).to.deep.equal(media);
                    expect(tag.sendObject).to.deep.equal({
                        'action': 'info',
                        'playerId': 1,
                        'mediaLabel': 'Andrea',
                        'isBuffering': true
                    });
                });
                it('Should send a "pause" action', function () {
                    ATInternet.JWPlayer.deletePlayerList();
                    tag.jwPlayer.init({
                        mediaList: [media],
                        on: function () {
                            return null;
                        },
                        getPlaylist: function () {
                            return null;
                        },
                        getPlaylistIndex: function () {
                            return 0;
                        }
                    });
                    // Change player state in order to send a 'pause' action
                    // case JW.PlayerState.PLAYING + '.' + JW.PlayerState.PAUSED:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('playing');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('paused');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'pause');
                    expect(tag.addObject).to.deep.equal(media);
                    expect(tag.sendObject).to.deep.equal({
                        'action': 'pause',
                        'playerId': 1,
                        'mediaLabel': 'Andrea',
                        'isBuffering': false
                    });
                    // case JW.PlayerState.BUFFERING + '.' + JW.PlayerState.PAUSED:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('buffering');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('paused');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'pause');
                    expect(tag.addObject).to.deep.equal(media);
                    expect(tag.sendObject).to.deep.equal({
                        'action': 'pause',
                        'playerId': 1,
                        'mediaLabel': 'Andrea',
                        'isBuffering': false
                    });
                });
                it('Should send a "stop" action', function () {
                    ATInternet.JWPlayer.deletePlayerList();
                    tag.jwPlayer.init({
                        mediaList: [media],
                        on: function () {
                            return null;
                        },
                        getPlaylist: function () {
                            return null;
                        },
                        getPlaylistIndex: function () {
                            return 0;
                        }
                    });
                    // Change player state in order to send an 'info' action
                    // case JW.PlayerState.PLAYING + '.' + JW.PlayerState.IDLE:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('playing');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('idle');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'stop');
                    expect(tag.addObject).to.deep.equal(media);
                    expect(tag.sendObject).to.deep.equal({
                        'action': 'stop',
                        'playerId': 1,
                        'mediaLabel': 'Andrea',
                        'isBuffering': false
                    });
                    // case JW.PlayerState.PAUSED + '.' + JW.PlayerState.IDLE:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('paused');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('idle');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'stop');
                    expect(tag.addObject).to.deep.equal(media);
                    expect(tag.sendObject).to.deep.equal({
                        'action': 'stop',
                        'playerId': 1,
                        'mediaLabel': 'Andrea',
                        'isBuffering': false
                    });
                    // case JW.PlayerState.BUFFERING + '.' + JW.PlayerState.IDLE:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('buffering');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('idle');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'stop');
                    expect(tag.addObject).to.deep.equal(media);
                    expect(tag.sendObject).to.deep.equal({
                        'action': 'stop',
                        'playerId': 1,
                        'mediaLabel': 'Andrea',
                        'isBuffering': false
                    });
                });
                it('Should not send a "play" action if media ID does not exist', function () {
                    ATInternet.JWPlayer.deletePlayerList();
                    tag.jwPlayer.init({
                        mediaList: [media],
                        on: function () {
                            return null;
                        },
                        getPlaylist: function () {
                            return [{}];
                        },
                        getPlaylistIndex: function () {
                            return 1;
                        }
                    });
                    // Change player state in order to send a 'play' action
                    // case JW.PlayerState.IDLE + '.' + JW.PlayerState.PLAYING:
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('idle');
                    ATInternet.JWPlayer.PlayerObjectList[0].fire('playing');
                    expect(ATInternet.JWPlayer.PlayerObjectList[0].player).to.have.deep.property('action', 'play');
                    // currentMedia is null
                    expect(tag.addObject).to.deep.equal({});
                    expect(tag.sendObject).to.deep.equal({});
                });
            });
        });
    });
});