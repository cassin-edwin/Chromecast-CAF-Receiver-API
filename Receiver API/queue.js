const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

// Support Load by contentId. It fetches media data by contentId and
// uses the contentUrl for the media URL.
playerManager.setMessageInterceptor(
	cast.framework.messages.MessageType.LOAD, loadRequestData => {
	if (loadRequestData.media && loadRequestData.media.contentId) {
		return thirdparty.getMediaById(loadRequestData.media.contentId)
		.then(media => {
			if (media) {
				loadRequestData.media.contentUrl = media.url;
				loadRequestData.media.contentId = media.id;
				loadRequestData.media.contentType = media.contentType;
				loadRequestData.media.metadata = media.metadata;
			}
			return loadRequestData;
		});
	}
	return loadRequestData;
});
context.start();

// Creates a simple queue with a combination of contents.
const DemoQueue = class extends cast.framework.QueueBase {
 constructor() {
   super();

   /**
    * List of media urls.
    * @private @const {!Array<string>}
    */
   this.myMediaUrls_ = [...];
 }
 /**
  * Provide a list of items.
  * @param {!cast.framework.messages.LoadRequestData} loadRequestData
  * @return {!cast.framework.messages.QueueData}
  */
 initialize(loadRequestData) {
   const items = [];
   for (const mediaUrl of this.myMediaUrls_) {
     const item = new cast.framework.messages.QueueItem();
     item.media = new cast.framework.messages.MediaInformation();
     item.media.contentId = mediaUrl;
     items.push(item);
   }
   const queueData =
       loadRequestData.queueData || new cast.framework.messages.QueueData();
   queueData.name = 'Ven Queue';
   queueData.description = 'Your Queue Description';
   queueData.items = items;
   // Start with the first item in the playlist.
   queueData.startIndex = 0;
   // Start from 10 seconds into the first item.
   queueData.currentTime = 10;
   return queueData;
 }
};


const context = cast.framework.CastReceiverContext.getInstance();
context.start(
{
	queue: new DemoQueue()
});

