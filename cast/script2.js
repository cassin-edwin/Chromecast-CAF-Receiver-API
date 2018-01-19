var cs_castContext = '',
    cs_deviceAvailable = false,
    cs_castSession = '',
//    cs_castMedia = function () {},
    cs_onCastStateChange = function (_e)
	{
		console.log("CAST: CAST_STATE_CHANGED: ", _e.castState);
		switch (_e.castState) 
		{
			case cast.framework.CastState.NO_DEVICES_AVAILABLE:
			cs_deviceAvailable = false;
			console.log("CAST DEVICE NOT AVAILABLE");
			break;
			case cast.framework.CastState.NOT_CONNECTED:
			cs_deviceAvailable = true;
			console.log("CAST DEVICE AVAILABLE");
			break;
			case cast.framework.CastState.CONNECTING:
			break;
			case cast.framework.CastState.CONNECTED:
			loadMedia();
			break;
			default:
			break;
	    }
	//	cs_sendCallback(_e.castState);
	},
	cs_onCastConnectedChange = function (_e) 
	{
	console.log("CAST IS_CONNECTED_CHANGED", _e);
	}
	cs_onCastPlayerStateChange = function (_e) 
	{
	console.log("CAST PLAYER_STATE_CHANGED", _e);
	},
	cs_subscribeToCCEvents = function ()
	{
	if (cs_castContext)
		{
		cs_castContext.addEventListener(cast.framework.CastContextEventType.CAST_STATE_CHANGED, cs_onCastStateChange);
		}
	if (cs_playerController) 
		{
		cs_playerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, cs_onCastConnectedChange);
		/*	cs_playerController.addEventListener(cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED, cs_onCastVolumeChange);
		cs_playerController.addEventListener(cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED, cs_onCastMutedChange);
		cs_playerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, cs_onCastCurrentTimeChange); */
		cs_playerController.addEventListener(cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED, cs_onCastPlayerStateChange);
		}
},
		cs_player = '',
		cs_playerController = '';


function init() 
{
	console.log("CAST :Init");
	var options = {};
	if (!cs_castContext && cast)
		{
		cs_castContext = cast.framework.CastContext.getInstance();
		if (cs_castContext && cs_castContext.getCastState)
			{
			if (cs_castContext.getCastState() === cast.framework.CastState.NO_DEVICES_AVAILABLE)
				{
				cs_deviceAvailable = false;
				console.log("CAST DEVICE NOT AVAILABLE");
			    } 
				else if (cs_castContext.getCastState() === cast.framework.CastState.NOT_CONNECTED)
				{
				cs_deviceAvailable = true;
				console.log("CAST DEVICE NOT CONNECTED");
		     	}
			    console.log("CAST INIT STATE " + cs_castContext.getCastState());
		    }

		if (cs_castContext)
			{
			// set the options for the cast context (required for it to be initialized)
		//	options.receiverApplicationId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
			options.receiverApplicationId = '291F24B2';
			options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
			cs_castContext.setOptions(options);
			if (!cs_player) 
			{
				cs_player = new cast.framework.RemotePlayer();
			}

			if (!cs_playerController && cs_player)
            {
				cs_playerController = new cast.framework.RemotePlayerController(cs_player);
			}

			cs_subscribeToCCEvents();
			}
	}
}

function session() 
{
	var castSession = cast.framework.CastContext.getInstance().requestSession();	
}
function playOrPause()
    {
		if (cs_player && cs_player.isPaused && cs_playerController)
			{
			cs_playerController.playOrPause();
		    }
	
	    else 
		//if (cs_player && !cs_player.isPaused && cs_playerController)
			{
			cs_playerController.playOrPause();
		    }
	}
	function stop() 
	{
		if(cs_playerController)
		{
			cs_playerController.stop();
		}
	}

function loadMedia() 
{
	

	var mediaInfo1 = new chrome.cast.media.MediaInfo('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'video/mp4');
	var queueItem1 = new chrome.cast.media.QueueItem(mediaInfo1);
	queueItem1.autoplay = true;
	
	var ad1 = new chrome.cast.media.MediaInfo('https://venwebsecure.ventunotech.com/mediaTest/testAD.mp4','video/mp4');
	var queue = new chrome.cast.media.QueueItem(ad1);
	queue.autoplay = true;
	
	var mediaInfo2 = new chrome.cast.media.MediaInfo('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 'video/mp4');
	var queueItem2 = new chrome.cast.media.QueueItem(mediaInfo2);
	queueItem2.autoplay = true;
	
	var loadRequest = new chrome.cast.media.QueueLoadRequest([queueItem1,ad1,queueItem2]);
	// var request = new chrome.cast.media.LoadRequest(queue);
	var castSession = cast.framework.CastContext.getInstance().getCurrentSession().getSessionObj();
	
	
	function successCallback(){};
	function errorCallback() {};
	
	castSession.queueLoad(loadRequest,successCallback, errorCallback);
		
	
	
   	         	
   
	/*    var context = cast.framework.CastContext.getInstance();
	context.addEventListener(
	cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
	function(event){
	switch (event.sessionState){
	case cast.framework.SessionState.SESSION_STARTED:
	case cast.framework.SessionState.SESSION_RESUMED:
	break;
	case cast.framework.SessionState.SESSION_ENDED:
	console.log('CastContext: CastSession disconnected');
	// Update locally as necessary
	break;
	}
	})
	}
	function stopCasting() {
	var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
	// End the session and pass 'true' to indicate
	// that receiver application should be stopped.
	castSession.endSession(true);
	} */
}
/*function queueItem()
	{
		var mediaInfo =  new chrome.cast.media.MediaInfo('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', 'video/mp4');
        var queue = new chrome.cast.media.QueueItem(mediaInfo);
		MediaQueueItem queueItem = new MediaQueueItem.Builder(mediaInfo);
		queueItem.setAutoplay(true);
		queueItem.setPreloadTime(20);
		queueItem.build();
		var queueLoad = new chrome.cast.media.QueueLoadRequest(['http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
																'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4']);
		
	}
*/



