var Tag = function () {
    var _this = this;
    _this.addObject = {};
    _this.sendObject = {};
    _this.richMedia = {
        add: function (obj) {
            _this.addObject = obj;
        },
        send: function (obj) {
            _this.sendObject = obj;
        }
    };
};
ATInternet = {
    Tracker: {
        Plugins: {},
        Tag: Tag,
        addPlugin: function () {}
    }
};
var JW = {
    PlayerState: {
        IDLE: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3
    }
};