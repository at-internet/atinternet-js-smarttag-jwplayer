# JW Player for AT Internet JavaScript SmartTag
This JW Player plugin allows you to measure JW Player players (v7 & v8) on your website tagged with AT Internet JavaScript SmartTag trackers from version 5.2.3.
The plugin offers helpers enabling the quick implementation of JW Player players tracking.

### Content
*	JavaScript plugin for [AT Internet Javascript SmartTag] from version 5.2.3.

### Get started
* Download our main library (smarttag.js) with this plugin (dist/at-smarttag-jwplayer.min.js) and install it on your website.
* Check out the [documentation page] for an overview of the SmartTag functionalities and code examples.

### Foreword
First of all, you must download our JavaScript library from [Tag Composer].

Tag Composer allows you to configure your SmartTag:

* Set up your tagging perimeter/scope (site, domain used to write cookies, etc.).
* Select desired features via configurable plugins. **Rich Media plugin is mandatory**.

Once the library is set up, you can download it and insert it with this plugin into the source code of the HTML page to be tagged.

#### Standard tag

Tracker initialisation is done via the instantiation of a new ATInternet.Tracker.Tag object:

```
<!DOCTYPE html>
<html>
  <head lang="en">
    <meta charset="UTF-8">
    <title>My Page</title>
    <script type="text/javascript" src="http://www.site.com/smarttag.js"></script>
    <script type="text/javascript" src="http://www.site.com/at-smarttag-jwplayer.min.js"></script>
  </head>
  <body>
    <script type="text/javascript">            
      var tag = new ATInternet.Tracker.Tag();
      // your tag
    </script>
    ...
  </body>
</html>
```

#### Asynchronous tag

You can load our JavaScript library asynchronously. However, this requires an adaptation in your tagging.
Check out the [Asynchronous tag] for an overview of the functionality . 

```
<script type="text/javascript">
window.ATInternet = {
    onTrackerLoad:function(){
        window.tag = new window.ATInternet.Tracker.Tag();
        var _callback = function () {
            // your tag
        };
        // This code loads the plugin code to track media and call the '_callback' function after loading.
        ATInternet.Utils.loadScript({url: 'http://www.site.com/at-smarttag-jwplayer.min.js'}, _callback);
    }
};
(function(){      
    var at=document.createElement('script');
    at.type='text/javascript';   
    at.async=true;    
    at.src='http://www.site.com/smarttag.js';
    (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]||document.getElementsByTagName('script')[0].parentNode).insertBefore(at,null);   
})();
</script>
```

### Tagging

The different media present on the page are added to the Tracker, then user interaction information is sent.
In order to track data, you have to define some media properties as objects when JW Player players are ready as follows :

  - **_id :_** ID of the media (must match media index in playlist) ; **_mandatory_**.
  - **_mediaType :_** Content type (“video”, “audio” or “vpost” for post-roll video measurement) ; **_mandatory_**.
  - **_playerId :_** Player ID (to be added when using several players).
  - **_mediaLevel2 :_** Level 2 site in which the content is located.
  - **_mediaLabel :_** Name/label of content (use “::” if needed) or of a post-roll ad (do not use “::”) ; **_mandatory_**.
  - **_previousMedia :_** Name/label of content linked to a post-roll ad; **_mandatory when using “ypost” type_**.
  - **_refreshDuration :_** Refresh duration period (optional in seconds, but necessary for calculating detailed durations).
  - **_duration :_** Total duration of content in seconds (leave empty if L= “Live”). The duration must be inferior to 86400 ; **_mandatory when using a “clip”-type broadcast_**.
  - **_isEmbedded :_** On an external website ? (“true” or “false”)
  - **_broadcastMode :_** Broadcast (“live” or “clip”).
  - **_webdomain :_** URL in cases of external placements.

Example :

```javascript
var media = {
    'id': 0,
    'mediaType': 'video',
    'playerId': 1,
    'mediaLevel2': '2',
    'mediaLabel': 'AT Internet - A Unique Digital analytics company',
    'previousMedia': '',
    'refreshDuration': 5,
    'duration': 89,
    'isEmbedded': false,
    'broadcastMode': 'clip',
    'webdomain': ''
};
```

#### Tagging with player

```
<!-- 1. This code loads the main AT Internet library. -->
<script type="text/javascript" src="http://www.site.com/smarttag.js"></script>

<!-- 2. This code loads the plugin code to track media. -->
<script type="text/javascript" src="http://www.site.com/at-smarttag-jwplayer.min.js"></script>

<!-- 3. This code loads the JW Player API code synchronously. -->
<script type="text/javascript" src="//content.jwplatform.com/libraries/FILE.js"></script>

<!-- 4. The player will replace this <div> tag. -->
<div id="player1"></div>
```
```javascript
// 5. Tracker initialisation
var tag = new ATInternet.Tracker.Tag();

// 6. Player initialisation.

var playlist = [{
    "file": "//content.jwplatform.com/videos/kaUXWqTZ-640.mp4",
    "image": "//content.jwplatform.com/thumbs/kaUXWqTZ-640.jpg",
    "title": "Elephant's Dream"
}, {
    "file": "//content.jwplatform.com/videos/C4lp6Dtd-640.mp4",
    "image": "//content.jwplatform.com/thumbs/C4lp6Dtd-640.jpg",
    "title": "Tears of Steel"
}, {
    "file": "//content.jwplatform.com/videos/bkaovAYt-640.mp4",
    "image": "//content.jwplatform.com/thumbs/bkaovAYt-640.jpg",
    "title": "Big Buck Bunny"
}];

var player1 = jwplayer("player1");
player1.setup({
    "playlist": playlist,
    "height": 360,
    "width": 640
});

// 7. Those functions initialize Rich Media measurement
//    when player is ready.

player1.on('ready', function () {
    onJWPlayerPlayerReady(this);
});

function onJWPlayerPlayerReady(player) {
    var mediaList = [];
    if (player.id === "player1") {
        var media1 = {
            'id': 0, // Set media index in playlist
            'mediaType': 'video',
            'playerId': 1,
            'mediaLevel2': '2',
            'mediaLabel': 'Elephant\'s Dream',
            'previousMedia': '',
            'refreshDuration': 10,
            'duration': 75,
            'isEmbedded': false,
            'broadcastMode': 'clip',
            'webdomain': ''
        };
        var media2 = {
            'id': 1, // Set media index in playlist
            'mediaType': 'video',
            'playerId': 1,
            'mediaLevel2': '2',
            'mediaLabel': 'Tears of Steel',
            'previousMedia': '',
            'refreshDuration': 10,
            'duration': 39,
            'isEmbedded': false,
            'broadcastMode': 'clip',
            'webdomain': ''
        };
        var media3 = {
            'id': 2, // Set media index in playlist
            'mediaType': 'video',
            'playerId': 1,
            'mediaLevel2': '2',
            'mediaLabel': 'Big Buck Bunny',
            'previousMedia': '',
            'refreshDuration': 10,
            'duration': 33,
            'isEmbedded': false,
            'broadcastMode': 'clip',
            'webdomain': ''
        };
        mediaList.push(media1, media2, media3);
    }
    if (mediaList.length > 0) {
        // Add media properties to player mediaList
        player.mediaList = mediaList;
        // Call init method to launch process
        tag.jwPlayer.init(player);
    }
}
```

### License
MIT

[documentation page]: <http://developers.atinternet-solutions.com/javascript-en/getting-started-javascript-en/tracker-initialisation-javascript-en/>
[Tag Composer]: <https://apps.atinternet-solutions.com/TagComposer/>
[Asynchronous tag]: <http://developers.atinternet-solutions.com/javascript-en/advanced-features-javascript-en/asynchronous-tag-javascript-en/>
[AT Internet Javascript SmartTag]: <http://developers.atinternet-solutions.com/javascript-en/getting-started-javascript-en/tracker-initialisation-javascript-en/>

   
   

